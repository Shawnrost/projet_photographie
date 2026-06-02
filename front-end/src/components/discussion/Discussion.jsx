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

  // 1. Extraction de l'ID de l'utilisateur connecté (JWT)
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
      if (result.success) {
        setConversations(result.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Chargement initial des salons
  useEffect(() => {
    fetchConversations();
  }, []);

  // 3. Debounce pour la recherche globale d'utilisateurs
  useEffect(() => {
    if (!searchContactQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearchingGlobal(true);
      const token = localStorage.getItem('access_token');
      
      try {
        const response = await fetch(`http://localhost:8000/api/users/?search=${searchContactQuery}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        const usersList = Array.isArray(data) ? data : (data.results || data.data || []);
        const filteredUsers = usersList.filter(user => user.id !== currentUserId);

        const formattedResults = filteredUsers.map(user => ({
          id: null,
          utilisateur_id: user.id,
          nom_complet: `${user.prenom || ''} ${user.nom || ''}`.trim() || user.email,
          photo_profil: user.photo_profil,
          role: user.role,
          is_global_user: true
        }));

        setSearchResults(formattedResults);
      } catch (error) {
        console.error("Erreur lors de la recherche globale des utilisateurs:", error);
      } finally {
        setIsSearchingGlobal(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchContactQuery, currentUserId]);

  // 4. Sélection ou création dynamique de salon
  const handleSelectConversation = async (target) => {
    const token = localStorage.getItem('access_token');
    
    if (target.is_global_user) {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/conversations/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            photographe_id: target.utilisateur_id,
            message_initial: "Discussion initiée."
          })
        });
        const result = await response.json();
        if (result.success || result.id) {
          await fetchConversations();
          setActiveConversation(result.data || result);
          setSearchContactQuery(""); 
        }
      } catch (error) {
        console.error("Impossible d'initier la conversation avec cet utilisateur:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setActiveConversation(target);
    }
  };

  // 5. Gestion de l'historique API et liaison du WebSocket en temps réel
  useEffect(() => {
    if (!activeConversation || !activeConversation.id) return;

    const token = localStorage.getItem('access_token');
    
    const loadHistory = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/conversations/${activeConversation.id}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success) {
          setMessages(result.data.reverse());
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique:", error);
      }
    };

    loadHistory();

    const wsUrl = `ws://localhost:8000/ws/conversations/${activeConversation.id}/?token=${token}`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "message") {
        setMessages((prev) => [...prev, data.message]);
      }
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [activeConversation]);

  // 6. Gestionnaire d'envoi de message via le WebSocket
  const handleSendMessage = (textContenu) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(JSON.stringify({
      type: "message",
      contenu: textContenu
    }));
  };

  // Fusion & Filtrage unifié de la liste des contacts
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
      {/* Panneau gauche : Contacts et recherche */}
      <ContactList 
        searchQuery={searchContactQuery}
        setSearchQuery={setSearchContactQuery}
        isSearchingGlobal={isSearchingGlobal}
        displayList={displayList}
        activeConversation={activeConversation}
        onSelectConversation={handleSelectConversation}
      />

      {/* Panneau droit : Fenêtre de discussion et flux WebSocket */}
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