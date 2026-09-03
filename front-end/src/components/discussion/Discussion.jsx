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

  // 1. Extraction de l'ID utilisateur connecté depuis le JWT
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

  // 2. Récupération des conversations actives
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
      
      if (result.success && Array.isArray(result.data)) {
        setConversations(result.data);
      } else if (Array.isArray(result)) {
        setConversations(result);
      } else if (result.results && Array.isArray(result.results)) {
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

  useEffect(() => {
    fetchConversations();
  }, []);

  // 3. Recherche globale d'utilisateurs adaptée à vos modèles
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

          const formattedResults = filteredUsers.map(user => {
            // Extraction spécifique de l'UUID ProfilPhotographe
            let profilId = null;
            if (user.profil_photographe) {
              profilId = typeof user.profil_photographe === 'object' 
                ? user.profil_photographe.id 
                : user.profil_photographe;
            } else {
              profilId = user.profil_photographe_id || user.photographe_id || user.id;
            }

            return {
              id: null, 
              utilisateur_id: user.id,
              photographe_id: profilId, // UUID du ProfilPhotographe
              nom_complet: `${user.prenom || ''} ${user.nom || ''}`.trim(),
              photo_profil: user.photo_profil,
              role: user.role,
              is_global_user: true
            };
          });

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

  // 4. Sélection d'une conversation ou d'un utilisateur cible
  const handleSelectConversation = (target) => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (target.is_global_user) {
      setActiveConversation(target);
      setMessages([]);
    } else {
      // On entre dans une discussion existante : on retire immédiatement
      // la bulle de notification (côté local) pour ce salon.
      const targetSansNotif = { ...target, non_lus_count: 0 };
      setActiveConversation(targetSansNotif);

      if (target.non_lus_count > 0) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === target.id ? { ...conv, non_lus_count: 0 } : conv
          )
        );

        // Synchronisation optionnelle avec le back-end : marque le salon
        // comme lu côté serveur. Échoue silencieusement si l'endpoint
        // n'existe pas encore, sans bloquer l'affichage.
        const token = localStorage.getItem('access_token');
        fetch(`http://localhost:8000/api/conversations/${target.id}/marquer-lu/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).catch(() => {});
      }
    }
  };

  // 5. Chargement de l'historique et connexion WebSocket
  useEffect(() => {
    if (!activeConversation || !activeConversation.id) return;

    const token = localStorage.getItem('access_token');
    
    const loadHistory = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/conversations/${activeConversation.id}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const result = await response.json();
        
        let messagesData = [];
        if (result.success && Array.isArray(result.data)) {
          messagesData = result.data;
        } else if (Array.isArray(result)) {
          messagesData = result;
        } else if (result.results && Array.isArray(result.results)) {
          messagesData = result.results;
        }
        
        // Tri explicite par date d'envoi (croissant) : les messages les plus
        // anciens restent toujours en haut et les plus récents en bas,
        // quel que soit l'ordre renvoyé par l'API (comportement type Facebook).
        const messagesTriees = [...messagesData].sort((a, b) => {
          const dateA = new Date(a.sent_at || a.created_at || 0).getTime();
          const dateB = new Date(b.sent_at || b.created_at || 0).getTime();
          return dateA - dateB;
        });

        setMessages(messagesTriees);
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

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [activeConversation]);

  // 6. Envoi de message avec vérification du rôle et de l'UUID Photographe
  const handleSendMessage = async (textContenu) => {
    const token = localStorage.getItem('access_token');

    if (activeConversation?.is_global_user && !activeConversation.id) {
      
      // Filtrage : Seuls les utilisateurs avec le rôle "photographe" possèdent un ProfilPhotographe
      if (activeConversation.role && activeConversation.role.toLowerCase() !== 'photographe') {
        alert("Action impossible : Cet utilisateur est un client. Vous ne pouvez initier une conversation qu'avec un photographe.");
        return;
      }

      const targetPhotographeId = activeConversation.photographe_id;
      
      if (!targetPhotographeId) {
        alert("Erreur : Impossible de trouver l'identifiant du profil photographe.");
        return;
      }

      try {
        const payload = {
          photographe_id: targetPhotographeId,
          message_initial: textContenu
        };

        const response = await fetch('http://localhost:8000/api/conversations/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
            alert("Erreur 404 : Le profil photographe associé à cet utilisateur n'a pas encore été créé en base de données.");
          } else if (result.message) {
            alert(result.message);
          }
          return;
        }

        const conversationData = result.data || result;

        if (conversationData && conversationData.id) {
          await fetchConversations();
          setActiveConversation(conversationData);
          setSearchContactQuery("");
        }
      } catch (error) {
        console.error("Erreur lors de la création de la conversation:", error);
      }
    } 
    else if (activeConversation?.id) {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: "message",
          contenu: textContenu
        }));
      }
    }
  };

  const filteredConversationsLocal = conversations.filter((conv) => {
    const targetName = `${conv.photographe_nom || ''} ${conv.client_nom || ''}`.toLowerCase();
    return targetName.includes(searchContactQuery.toLowerCase());
  });

  const displayList = searchContactQuery.trim() !== "" 
    ? [
        ...filteredConversationsLocal, 
        ...searchResults.filter(res => !conversations.some(c => c.photographe_id === res.photographe_id || c.client_id === res.utilisateur_id))
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