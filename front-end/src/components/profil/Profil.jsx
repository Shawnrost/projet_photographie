import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Importation des sous-onglets
import InformationTab from './Information';
import CollectionTab from './collection/Collection';
import PerformancesTab from './Performances';

const Profil = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('information');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({ prenom: "", nom: "", email: "", bio: "" });
  const [previewPhoto, setPreviewPhoto] = useState(null);

  // Collection initialisée à vide pour les vraies données du photographe
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/connexion');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/moi/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          const data = response.data.data;
          setUser(data);
          setFormData({
            prenom: data.prenom || "Ofélia",
            nom: data.nom || "R.",
            email: data.email || "ofelia@e-sary.com",
            bio: data.bio || "Artiste plasticienne et photographe explorant les textures de la lumière. Fondatrice de l'espace e.Sary."
          });

          if (data.photos) {
            setCollection(data.photos);
          }
        }
      } catch (error) {
        console.error("Erreur API Profil :", error);
        localStorage.removeItem('access_token');
        navigate('/connexion');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handlePhotoClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setUser(prev => ({
      ...prev,
      ...formData,
      photo_profil: previewPhoto || prev?.photo_profil
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setPreviewPhoto(null);
    if (user) {
      setFormData({
        prenom: user.prenom || "Ofélia",
        nom: user.nom || "R.",
        email: user.email || "ofelia@e-sary.com",
        bio: user.bio || "Artiste plasticienne et photographe explorant les textures de la lumière. Fondatrice de l'espace e.Sary."
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="w-screen h-screen bg-[#2d3a30] flex flex-col items-center justify-center font-sans text-white text-xs tracking-[0.4em] uppercase">
        <p className="text-[#aec3b0] text-xl mb-4 animate-pulse">●</p>
        Chargement de l'Atelier...
      </div>
    );
  }

  const initiales = user && user.prenom && user.nom 
    ? `${user.prenom[0]}${user.nom[0]}`.toUpperCase() 
    : "OR";

  const MENU_ITEMS = [
    { id: 'information', label: 'Information', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
    { id: 'collection', label: 'Collection', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
    { id: 'performances', label: 'Performances', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
  ];

  return (
    <section className="w-screen h-screen bg-[#2d3a30] text-[#2d3a30] font-sans overflow-hidden flex flex-col md:flex-row relative">
      
      {/* 1. PANNEAU DE GAUCHE : AJUSTÉ POUR FAIRE DESCENDRE LES ÉLÉMENTS (pt-20 md:pt-36) */}
      <div className="w-full md:w-2/5 h-auto md:h-full p-8 md:p-12 pt-20 md:pt-36 flex flex-col items-center md:items-start relative z-10 border-b md:border-b-0 md:border-r border-white/10">
        
        {/* Profil Header */}
        <div className="flex flex-col items-center md:items-start gap-4 mb-8">
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border border-[#aec3b0]/30 p-1 bg-[#1c251e]/40 shadow-2xl flex items-center justify-center overflow-hidden">
            {previewPhoto || user?.photo_profil ? (
              <img src={previewPhoto || user.photo_profil} alt="Profil" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-[#aec3b0] font-serif italic text-2xl md:text-4xl font-light">{initiales}</span>
            )}
          </div>

          <div className="text-center md:text-left">
            <p className="font-mono text-[8px] tracking-[0.4em] text-[#aec3b0] uppercase italic">Artiste Résident</p>
            <h1 className="font-serif italic text-2xl md:text-4xl tracking-wide text-white leading-tight">
              {user?.prenom || formData.prenom} {user?.nom || formData.nom}
            </h1>
          </div>
        </div>

        {/* MENU DE NAVIGATION VERTICAL */}
        <nav className="w-full space-y-2 mb-auto">
          {MENU_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsEditing(false); }}
                whileHover={{ x: 5 }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive ? 'bg-white/10 text-gold shadow-lg' : 'text-white/40 hover:text-white/80'
                }`}
              >
                <svg className={`w-4 h-4 transition-colors ${isActive ? 'text-gold' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase">{item.label}</span>
                {isActive && <motion.div layoutId="activeDot" className="w-1 h-1 bg-gold rounded-full ml-auto" />}
              </motion.button>
            );
          })}
        </nav>

        <div className="hidden md:block w-full pt-6 font-mono text-[9px] tracking-wider uppercase text-white/30 border-t border-white/5">
          <p>e.Sary Studio © 2026</p>
        </div>
      </div>

      {/* 2. PANNEAU DE DROITE : AJUSTÉ POUR FAIRE MONTER LE TITRE ET LE CONTENU (pt-16 md:pt-14) */}
      <div className="w-full md:w-3/5 h-full bg-[#f8f9f8] p-6 md:p-12 pt-16 md:pt-14 relative z-10 overflow-y-auto custom-scrollbar">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.4 }}
            className="h-full flex flex-col"
          >
            {/* EN-TÊTE DE SECTION AVEC BOUTON MODIFIER FLOTTANT */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="font-mono text-[9px] tracking-[0.3em] text-[#2d3a30]/40 uppercase">Espace Gestion</span>
                <h2 className="font-serif text-3xl md:text-4xl italic text-[#2d3a30] capitalize">{activeTab}</h2>
                <div className="w-12 h-[1px] bg-gold mt-2" />
              </div>

              {activeTab === 'information' && !isEditing && (
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#2d3a30", color: "#fff" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-[#2d3a30]/20 text-[#2d3a30] font-mono text-[9px] uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Modifier la fiche
                </motion.button>
              )}
            </div>

            <div className="flex-1">
              {/* RENDU SÉLECTIF DES ONGLETS COMPOSANTS */}
              {activeTab === 'information' && (
                <InformationTab 
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  formData={formData}
                  setFormData={setFormData}
                  previewPhoto={previewPhoto}
                  handlePhotoClick={handlePhotoClick}
                  fileInputRef={fileInputRef}
                  handleFileChange={handleFileChange}
                  handleSave={handleSave}
                  handleCancel={handleCancel}
                  initiales={initiales}
                  user={user}
                />
              )}

              {activeTab === 'collection' && (
                <CollectionTab collection={collection} />
              )}

              {activeTab === 'performances' && (
                <PerformancesTab />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

export default Profil;