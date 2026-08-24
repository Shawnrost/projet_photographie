// C:\Users\ASUS\Desktop\projet_photographie\front-end\src\components\discussion\Discussion.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ContactList from './ContactList';
import ChatWindow from './ChatWindow';

const Discussion = () => {
  const navigate = useNavigate();
  const wsRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [searchContactQuery, setSearchContactQuery] = useState("");
  const [conversations, setConversations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchingGlobal, setIsSearchingGlobal] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  // 1. Extraction de l'ID utilisateur (JWT)
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/connexion');
      return;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      setCurrentUserId(decoded.user_id || decoded.id);
    } catch (error) {
      console.error("Erreur lors du décodage du token JWT:", error);
    }
  }, [navigate]);

  // Récupération de l'ensemble des salons actifs
  const fetchConversations = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8000/api/conversations/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      // Gestion des différentes structures de réponse
      if (result.success && Array.isArray(result.data)) {
        setConversations(result.data);
      } else if (Array.isArray(result)) {
        setConversations(result);
      } else if (result.results && Array.isArray(result.results)) {
        // Si la réponse est paginée
        setConversations(result.results);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des conversations:", error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  // 2. Chargement initial des salons
  useEffect(() => {
    fetchConversations();
  }, []);

  // 3. Recherche globale d'utilisateurs (Debounce)
  useEffect(() => {
    if (!searchContactQuery.trim() || searchContactQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearchingGlobal(true);
      const token = localStorage.getItem('access_token');
      
      try {
        const response = await fetch(`http://localhost:8000/api/auth/recherche/?q=${encodeURIComponent(searchContactQuery)}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          const filteredUsers = result.data.filter(user => user.id !== currentUserId);

          const formattedResults = filteredUsers.map(user => ({
            id: null, 
            utilisateur_id: user.id,
            photographe_id: user.id, // Assure-toi que c'est bien l'UUID du photographe
            nom_complet: `${user.prenom || ''} ${user.nom || ''}`.trim(),
            photo_profil: user.photo_profil,
            role: user.role,
            is_global_user: true
          }));

          setSearchResults(formattedResults);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Erreur lors de la recherche globale des utilisateurs:", error);
        setSearchResults([]);
      } finally {
        setIsSearchingGlobal(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchContactQuery, currentUserId]);

  // 4. Sélection d'une cible (Salon existant ou Profil global)
  const handleSelectConversation = (target) => {
    // On ferme le WebSocket actuel s'il y en a un ouvert
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (target.is_global_user) {
      // On bascule sur l'interface à blanc sans appeler l'API de suite
      setActiveConversation(target);
      setMessages([]);
    } else {
      setActiveConversation(target);
    }
  };

  // 5. Gestionnaire d'historique et connexion WS pour salons existants
  useEffect(() => {
    if (!activeConversation || !activeConversation.id) return;

    const token = localStorage.getItem('access_token');
    
    const loadHistory = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/conversations/${activeConversation.id}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const result = await response.json();
        
        // Gestion des différentes structures de réponse
        let messagesData = [];
        if (result.success && Array.isArray(result.data)) {
          messagesData = result.data;
        } else if (Array.isArray(result)) {
          messagesData = result;
        } else if (result.results && Array.isArray(result.results)) {
          messagesData = result.results;
        }
        
        setMessages([...messagesData].reverse());
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique:", error);
        setMessages([]);
      }
    };

    loadHistory();

    const wsUrl = `ws://localhost:8000/ws/conversations/${activeConversation.id}/?token=${token}`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "message") {
          setMessages((prev) => [...prev, data.message]);
        }
      } catch (error) {
        console.error("Erreur de parsing WebSocket:", error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("Erreur WebSocket:", error);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [activeConversation]);

  // 6. Gestionnaire d'envoi dynamique (POST d'initialisation OU WebSocket)
  const handleSendMessage = async (textContenu) => {
    const token = localStorage.getItem('access_token');

    // Cas A : Premier message d'un salon non créé (is_global_user)
    if (activeConversation?.is_global_user && !activeConversation.id) {
      console.log("Création d'une nouvelle conversation avec:", activeConversation);
      
      // CORRECTION : S'assurer que photographe_id est bien un UUID valide
      const photographeId = activeConversation.photographe_id || activeConversation.utilisateur_id;
      
      if (!photographeId) {
        console.error("Aucun photographe_id trouvé pour créer la conversation");
        return;
      }

      try {
        // CORRECTION : Structure du payload conforme au serializer
        const payload = {
          photographe_id: photographeId,
          message_initial: textContenu
        };
        
        console.log("Payload envoyé:", payload);

        const response = await fetch('http://localhost:8000/api/conversations/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        console.log("Status de la réponse:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Erreur HTTP:", response.status, errorText);
          return;
        }

        const result = await response.json();
        console.log("Réponse complète:", result);

        // Gestion des différentes structures de réponse
        let conversationData = null;
        
        if (result.success && result.data) {
          conversationData = result.data;
        } else if (result.data) {
          conversationData = result.data;
        } else if (result.id) {
          conversationData = result;
        }

        if (conversationData) {
          // On recharge la liste latérale
          await fetchConversations();
          // On bascule sur la vraie structure de conversation reçue de la DB
          setActiveConversation(conversationData);
          setSearchContactQuery("");
        } else {
          console.error("Format de réponse POST inattendu:", result);
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi du message initial (POST):", error);
      }
    } 
    // Cas B : Envoi classique sur salon actif existant
    else if (activeConversation?.id) {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: "message",
          contenu: textContenu
        }));
      } else {
        console.warn("WebSocket non ouvert, tentative de reconnexion...");
        // Tu pourrais ajouter une logique de reconnexion ici
      }
    } else {
      console.warn("Aucune conversation active ou cible sélectionnée");
    }
  };

  // Filtrage local
  const filteredConversationsLocal = conversations.filter((conv) => {
    const targetName = `${conv.photographe_nom || ''} ${conv.client_nom || ''}`.toLowerCase();
    return targetName.includes(searchContactQuery.toLowerCase());
  });

  const displayList = searchContactQuery.trim() !== "" 
    ? [
        ...filteredConversationsLocal, 
        ...searchResults.filter(res => !conversations.some(c => c.photographe_id === res.utilisateur_id || c.client_id === res.utilisateur_id))
      ]
    : conversations;

  if (loading) {
    return (
      <div className="w-screen h-screen bg-[#2d3a30] flex flex-col items-center justify-center font-sans text-white text-xs tracking-[0.4em] uppercase">
        <p className="text-[#aec3b0] text-xl mb-4 animate-pulse">●</p>
        Connexion au serveur...
      </div>
    );
  }

  return (
    <section className="w-screen h-screen bg-[#2d3a30] text-[#2d3a30] font-sans overflow-hidden flex flex-col md:flex-row relative">
      <ContactList 
        searchQuery={searchContactQuery}
        setSearchQuery={setSearchContactQuery}
        isSearchingGlobal={isSearchingGlobal}
        displayList={displayList}
        activeConversation={activeConversation}
        onSelectConversation={handleSelectConversation}
      />
      <ChatWindow 
        activeConversation={activeConversation}
        messages={messages}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
      />
    </section>
  );
};

export default Discussion;