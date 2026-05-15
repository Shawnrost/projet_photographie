import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Importation des composants de la Vitrine
import EnTete from './components/vitrine/EnTete.jsx';
import Banniere from './components/vitrine/Banniere.jsx';

// Importation des composants d'Authentification
import Connexion from './components/connexion/Connexion.jsx';
import InscriptionMain from './components/connexion/Inscription.jsx';

// Composant pour animer les transitions de pages
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* ROUTE ACCUEIL : En-tête + Bannière */}
        <Route 
          path="/" 
          element={
            <>
              <EnTete />
              <Banniere />
            </>
          } 
        />

        {/* ROUTE CONNEXION */}
        <Route 
          path="/connexion" 
          element={<Connexion />} 
        />

        {/* ROUTE INSCRIPTION (Multi-étapes) */}
        <Route 
          path="/inscription" 
          element={<InscriptionMain />} 
        />

      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <main className="relative w-full h-screen bg-charcoal overflow-hidden grain">
        {/* Effet de grain de film global défini dans index.css */}
        <div className="relative z-10 w-full h-full">
          <AnimatedRoutes />
        </div>
        
        {/* Overlay de texture artistique permanent */}
        <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>
      </main>
    </Router>
  );
}

export default App;