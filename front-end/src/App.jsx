import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import EnTete from './components/vitrine/EnTete.jsx';
import Banniere from './components/vitrine/Banniere.jsx';
import Vitrine from './components/vitrine/Vitrine.jsx'; // ⬅️ NOUVEAU
import Connexion from './components/connexion/Connexion.jsx';
import InscriptionMain from './components/connexion/Inscription.jsx';
import Accueil from './components/accueil/Accueil.jsx'; 
import Profil from './components/profil/Profil.jsx'; 
import Recherche from './components/recherche/Recherche.jsx';
import Discussion from './components/discussion/Discussion.jsx'; 
import Entete_app from './components/entete/Entete_app.jsx';
import Commande from './components/commande/Commande.jsx';

// Importation du composant de gestion des abonnements côté Admin
import GestionAbonnements from './components/abonnement/GestionAbonnements.jsx';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = ({ user, setUser, onLogout }) => {
  const location = useLocation();
  
  // Routes avec en-tête globale
  const privateRoutes = ['/accueil', '/profil', '/recherche', '/discussion', '/admin/abonnements', '/commandes'];
  const showGlobalHeader = privateRoutes.includes(location.pathname);

  // Pages qui nécessitent un scroll
  const scrollableRoutes = ['/admin/abonnements', '/commandes', '/profil', '/recherche', '/discussion'];
  const isScrollable = scrollableRoutes.includes(location.pathname);

  return (
    <>
      {showGlobalHeader && <Entete_app user={user} onLogout={onLogout} />}

      <AnimatePresence mode="popLayout">
        <Routes location={location} key={location.pathname}>
          {/* Page d'accueil avec EnTete + Banniere (votre version existante) */}
          <Route path="/" element={<PageWrapper><EnTete /><Banniere /></PageWrapper>} />
          
          {/* NOUVEAU : Page Vitrine complète (page dédiée aux oeuvres) */}
          <Route path="/vitrine" element={<PageWrapper><Vitrine /></PageWrapper>} />
          
          {/* Authentification */}
          <Route path="/connexion" element={<PageWrapper><Connexion setUser={setUser} /></PageWrapper>} />
          <Route path="/inscription" element={<PageWrapper><InscriptionMain /></PageWrapper>} />
          
          {/* Routes principales */}
          <Route path="/accueil" element={<PageWrapper><Accueil user={user} /></PageWrapper>} />
          <Route path="/profil" element={<PageWrapper><Profil user={user} /></PageWrapper>} />
          <Route path="/recherche" element={<PageWrapper><Recherche /></PageWrapper>} />
          <Route path="/discussion" element={<PageWrapper><Discussion /></PageWrapper>} />
          
          {/* Route Commandes */}
          <Route path="/commandes" element={
            <PageWrapper>
              <Commande />
            </PageWrapper>
          } />
          
          {/* Route Admin */}
          <Route path="/admin/abonnements" element={
            <PageWrapper>
              <GestionAbonnements />
            </PageWrapper>
          } />
        </Routes>
      </AnimatePresence>
    </>
  );
};

function App() {
  // Initialisation dynamique basée sur les données réelles enregistrées en local
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('user_profile');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user_profile');
    
    if (token && savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else if (!token) {
      setCurrentUser(null);
    }
  }, []);

  // Mise à jour du state ET du localStorage en même temps pour la cohérence
  const handleSetUser = (userProfile) => {
    setCurrentUser(userProfile);
    if (userProfile) {
      localStorage.setItem('user_profile', JSON.stringify(userProfile));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_profile');
    setCurrentUser(null);
    window.location.href = "/connexion";
  };

  return (
    <Router>
      <main className="relative w-full min-h-screen bg-charcoal grain">
        <div className="relative z-10 w-full min-h-screen">
          <AnimatedRoutes 
            user={currentUser} 
            setUser={handleSetUser} 
            onLogout={handleLogout} 
          />
        </div>
        
        <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.02] mix-blend-overlay">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>
      </main>
    </Router>
  );
}

export default App;