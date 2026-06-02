import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuArtiste from './MenuArtiste'; 

const Entete_app = ({ user, onLogout }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notification, setNotification] = useState(null); // { message: string, type: 'success' | 'error' }
  const navigate = useNavigate();
  const location = useLocation();

  const isSearchPage = 
    location.pathname === '/recherche' || 
    location.pathname === '/profil' || 
    location.pathname === '/discussion';

  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  // Écouteur d'événements globaux pour déclencher la Dynamic Island depuis l'extérieur
  useEffect(() => {
    const handleTriggerNotification = (e) => {
      const { message, type } = e.detail;
      setNotification({ message, type });

      // Rétraction automatique après 4 secondes
      setTimeout(() => {
        setNotification(null);
      }, 4000);
    };

    window.addEventListener('trigger-island-notification', handleTriggerNotification);
    return () => window.removeEventListener('trigger-island-notification', handleTriggerNotification);
  }, []);

  const initiales = user && user.prenom && user.nom 
    ? `${user.prenom[0]}${user.nom[0]}`.toUpperCase() 
    : "OR"; 

  const NAV_LINKS = [
    { id: 'accueil', href: '/accueil', icon: (
      <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ), label: 'Accueil' },
    { id: 'recherche', href: '/recherche', icon: (
      <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
      </svg>
    ), label: 'Rechercher' },
    { id: 'discussion', href: '/discussion', icon: (
      <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ), label: 'Discussion' },
    { id: 'expositions', href: '#series', icon: (
      <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ), label: 'Expositions' },
    { id: 'archives', href: '#archives', icon: (
      <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
      </svg>
    ), label: 'Archives' }
  ];

  // États de l'île gérés dynamiquement si notification active
  const islandVariants = {
    default: {
      width: "100%",
      maxWidth: "1200px",
      height: notification ? "96px" : "76px",
      borderRadius: notification ? "32px" : "28px",
      paddingLeft: "32px",
      paddingRight: "32px",
      x: "0%",
    },
    compact: {
      width: notification ? "420px" : "360px", 
      maxWidth: "100%",
      height: notification ? "86px" : "56px",
      borderRadius: notification ? "26px" : "22px",
      paddingLeft: "20px",
      paddingRight: "20px",
      x: "calc(-30vw + 20px)", 
    }
  };

  const springTransition = {
    type: "spring",
    stiffness: 380,
    damping: 30,
    mass: 0.6
  };

  return (
    <div className="fixed top-0 inset-x-0 z-50 pt-5 px-6 pointer-events-none flex flex-col items-center">
      <motion.nav
        variants={islandVariants}
        animate={isSearchPage ? "compact" : "default"}
        transition={springTransition}
        className={`pointer-events-auto flex flex-col justify-center bg-white/95 backdrop-blur-xl relative shadow-[0_25px_60px_rgba(0,0,0,0.06)] will-change-[width,height,transform] transition-colors duration-500 border ${
          notification 
            ? notification.type === 'success' 
              ? 'border-emerald-500/30 ring-4 ring-emerald-500/5' 
              : 'border-rose-500/30 ring-4 ring-rose-500/5'
            : 'border-[#2d3a30]/5'
        }`}
      >
        <AnimatePresence mode="wait">
          {!notification ? (
            /* ÉTAT DE NAVIGATION NORMAL */
            <motion.div 
              key="nav-content"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              className="w-full flex justify-between items-center"
            >
              {/* LOGO */}
              <motion.button 
                animate={{ 
                  opacity: isSearchPage ? 0 : 1, 
                  width: isSearchPage ? 0 : "auto",
                  marginRight: isSearchPage ? 0 : 24
                }}
                transition={springTransition}
                onClick={() => navigate('/accueil')} 
                className="group flex flex-col items-start select-none shrink-0 text-left overflow-hidden h-full justify-center"
              >
                <span className="font-serif italic text-xl md:text-2xl text-[#2d3a30] leading-none">
                  e<span className="text-gold">.</span>Sary
                </span>
                <span className="font-mono text-[7px] tracking-[0.6em] uppercase text-gold mt-1 opacity-60">
                  Studio
                </span>
              </motion.button>

              {/* NAVIGATION */}
              <div className="flex-1 flex justify-center items-center h-full">
                <div className="flex items-center gap-1 md:gap-3">
                  {NAV_LINKS.map((link) => {
                    const isActive = !profileOpen && (location.pathname === link.href || window.location.hash === link.href);

                    return (
                      <button
                        key={link.id}
                        onClick={() => { if (link.href.startsWith('/')) navigate(link.href); else window.location.hash = link.href; }}
                        className="relative flex flex-col items-center justify-center p-2 rounded-xl group select-none"
                      >
                        <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-gold' : 'text-[#2d3a30]/40 group-hover:text-[#2d3a30]'}`}>
                          {link.icon}
                        </span>
                        
                        {!isSearchPage && (
                          <motion.span 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: isActive ? 1 : 0, height: "auto" }}
                            className="z-10 font-sans font-light text-[8px] tracking-[0.2em] uppercase mt-0.5"
                          >
                            {link.label}
                          </motion.span>
                        )}

                        {isActive && (
                          <motion.div 
                            layoutId="artisticFrame"
                            className="absolute inset-0 border border-gold/20 rounded-xl bg-gold/[0.01] z-0"
                            transition={springTransition}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MENU PROFIL */}
              <div className="flex items-center justify-end shrink-0 pl-2">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-8 h-8 flex flex-col justify-center items-center gap-[4px] relative"
                >
                  <motion.span 
                    animate={profileOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
                    transition={springTransition}
                    className="w-5 h-[1.5px] bg-[#2d3a30] block rounded-full"
                  />
                  <motion.span 
                    animate={profileOpen ? { opacity: 0, x: -5 } : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.1 }}
                    className="w-5 h-[1.5px] bg-[#2d3a30] block rounded-full"
                  />
                  <motion.span 
                    animate={profileOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
                    transition={springTransition}
                    className="w-5 h-[1.5px] bg-[#2d3a30] block rounded-full"
                  />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <MenuArtiste 
                      user={user}
                      initiales={initiales}
                      onLogout={onLogout}
                      onClose={() => setProfileOpen(false)}
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            /* ÉTAT DYNAMIC ISLAND : NOTIFICATION IMPÉRIALE */
            <motion.div
              key="island-notification"
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full flex items-center justify-center gap-3 px-4 text-center"
            >
              {notification.type === 'success' ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
                  ✓
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600 shrink-0 shadow-xs">
                  ⚠️
                </div>
              )}
              <p className="font-serif italic text-sm text-[#2d3a30] tracking-wide line-clamp-2">
                {notification.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

export default Entete_app;