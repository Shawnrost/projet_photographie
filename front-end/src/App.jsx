import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Vitrine publique
import Vitrine from './components/vitrine/Vitrine.jsx';
import EnTete from './components/vitrine/EnTete.jsx';

// Authentification
import Connexion from './components/connexion/Connexion.jsx';
import InscriptionMain from './components/connexion/Inscription.jsx';

// Application privée
import Accueil from './components/accueil/Accueil.jsx';
import Profil from './components/profil/Profil.jsx';
import Recherche from './components/recherche/Recherche.jsx';
import Discussion from './components/discussion/Discussion.jsx';
import Commande from './components/commande/clients/Commande.jsx';
import Entete_app from './components/entete/Entete_app.jsx';

// Administration et Photographes
import GestionAbonnements from './components/abonnement/admin/GestionAbonnements.jsx';
import AbonnementClient from './components/abonnement/clients/AbonnementClient.jsx';
import GestionCommandes from './components/commande/photographe/GestionCommandes.jsx';

const EASE = [0.16, 1, 0.3, 1];

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
    transition={{ duration: 0.5, ease: EASE }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

const AppShell = ({ user, setUser, onLogout }) => {
  const location = useLocation();

  // Liste de toutes les routes privées
  const privateRoutes = [
    { path: '/accueil', element: <Accueil user={user} />, header: true, scrollable: true },
    { path: '/profil', element: <Profil user={user} />, header: true, scrollable: true },
    { path: '/recherche', element: <Recherche />, header: true, scrollable: true },
    { path: '/discussion', element: <Discussion />, header: true, scrollable: true },
    { path: '/commandes', element: <Commande />, header: true, scrollable: true }, // Espace Client
    { path: '/admin/abonnements', element: <GestionAbonnements />, header: true, scrollable: true }, // Espace Admin
    { path: '/admin/commandes', element: <GestionCommandes />, header: true, scrollable: true }, // Espace Photographe / Admin
    { path: '/abonnement', element: <AbonnementClient />, header: true, scrollable: true }, // Abonnement Photographe
  ];

  const currentRoute = privateRoutes.find((r) => r.path === location.pathname);
  const showGlobalHeader = Boolean(currentRoute?.header);
  const isScrollable = Boolean(currentRoute?.scrollable) || location.pathname === '/';

  const showVitrineHeader = location.pathname === '/';

  return (
    <main
      className={`relative w-full min-h-screen bg-charcoal grain ${
        isScrollable ? 'overflow-y-auto' : 'overflow-hidden'
      }`}
    >
      <div className="relative z-10 w-full min-h-screen">
        {showVitrineHeader && <EnTete />}
        {showGlobalHeader && <Entete_app user={user} onLogout={onLogout} />}

        <AnimatePresence mode="popLayout">
          <Routes location={location} key={location.pathname}>
            {/* Vitrine publique */}
            <Route path="/" element={<PageWrapper><Vitrine /></PageWrapper>} />

            {/* Authentification */}
            <Route path="/connexion" element={<PageWrapper><Connexion setUser={setUser} /></PageWrapper>} />
            <Route path="/inscription" element={<PageWrapper><InscriptionMain /></PageWrapper>} />

            {/* Routes privées */}
            {privateRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={<PageWrapper>{element}</PageWrapper>} />
            ))}
          </Routes>
        </AnimatePresence>
      </div>

      {/* Grain superposé */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.02] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
    </main>
  );
};

function App() {
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
    window.location.href = '/connexion';
  };

  return (
    <Router>
      <AppShell user={currentUser} setUser={handleSetUser} onLogout={handleLogout} />
    </Router>
  );
}

export default App;