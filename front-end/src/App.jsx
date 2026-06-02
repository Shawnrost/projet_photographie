import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import EnTete from './components/vitrine/EnTete.jsx';
import Banniere from './components/vitrine/Banniere.jsx';
import Connexion from './components/connexion/Connexion.jsx';
import InscriptionMain from './components/connexion/Inscription.jsx';
import Accueil from './components/accueil/Accueil.jsx'; 
import Profil from './components/profil/Profil.jsx'; 
import Recherche from './components/recherche/Recherche.jsx';
import Discussion from './components/discussion/Discussion.jsx'; // Importation de la messagerie
import Entete_app from './components/entete/Entete_app.jsx';

// Wrapper artistique pour les transitions de pages fluides
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

const AnimatedRoutes = ({ user, onLogout }) => {
  const location = useLocation();
  
  // Ajout de '/discussion' dans la liste pour afficher l'Entete_app sur cette page
  const privateRoutes = ['/accueil', '/profil', '/recherche', '/discussion'];
  const showGlobalHeader = privateRoutes.includes(location.pathname);

  return (
    <>
      {showGlobalHeader && <Entete_app user={user} onLogout={onLogout} />}

      {/* Le secret des 60fps : popLayout empêche l'écran de tressauter */}
      <AnimatePresence mode="popLayout">
        <Routes location={location} key={location.pathname}>
          
          <Route path="/" element={<PageWrapper><EnTete /><Banniere /></PageWrapper>} />
          <Route path="/connexion" element={<PageWrapper><Connexion /></PageWrapper>} />
          <Route path="/inscription" element={<PageWrapper><InscriptionMain /></PageWrapper>} />
          
          <Route path="/accueil" element={<PageWrapper><Accueil /></PageWrapper>} />
          <Route path="/profil" element={<PageWrapper><Profil /></PageWrapper>} />
          <Route path="/recherche" element={<PageWrapper><Recherche /></PageWrapper>} />
          
          {/* Route pour la page de discussion artistique */}
          <Route path="/discussion" element={<PageWrapper><Discussion /></PageWrapper>} />

        </Routes>
      </AnimatePresence>
    </>
  );
};

function App() {
  const currentUser = { prenom: "Ofélia", nom: "R." };
  const handleLogout = () => console.log("Déconnexion");

  return (
    <Router>
      <main className="relative w-full h-screen bg-charcoal overflow-hidden grain">
        <div className="relative z-10 w-full h-full">
          <AnimatedRoutes user={currentUser} onLogout={handleLogout} />
        </div>
        
        {/* Overlay permanent de texture */}
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