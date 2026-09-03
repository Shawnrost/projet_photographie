import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuArtiste from './MenuArtiste';

/* ─────────────────────────────────────────────────────────────────────────────
   SPRINGS
───────────────────────────────────────────────────────────────────────────── */
const SPRING_MORPH   = { type: 'spring', stiffness: 120, damping: 22, mass: 1.1 };
const SPRING_CONTENT = { type: 'spring', stiffness: 220, damping: 30, mass: 0.7 };
const SPRING_HOVER   = { type: 'spring', stiffness: 380, damping: 22 };

/* ─────────────────────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────────────────────── */
const ICONS = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H5a1 1 0 01-1-1V9.75z"/>
      <path d="M9 22V12h6v10"/>
    </svg>
  ),
  search: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  chat: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  ),
  commandes: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor"/>
      <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor"/>
      <path d="M7 15h4" stroke="currentColor" strokeLinecap="round"/>
      <path d="M15 15h2" stroke="currentColor" strokeLinecap="round"/>
    </svg>
  ),
  archives: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  ),
  card: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  close: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
};

/* ─────────────────────────────────────────────────────────────────────────────
   NAV LINKS (Client, Photographe & Admin)
───────────────────────────────────────────────────────────────────────────── */
const NAV_CLIENT = [
  { id: 'accueil',     href: '/accueil',    label: 'Accueil',     ic: ICONS.home },
  { id: 'recherche',   href: '/recherche',  label: 'Rechercher',  ic: ICONS.search },
  { id: 'discussion',  href: '/discussion', label: 'Discussion',  ic: ICONS.chat },
  { id: 'commandes',   href: '/commandes',  label: 'Commandes',   ic: ICONS.commandes },
  { id: 'archives',    href: '#archives',   label: 'Archives',    ic: ICONS.archives },
];

const NAV_PHOTOGRAPHE = [
  { id: 'accueil',     href: '/accueil',          label: 'Accueil',     ic: ICONS.home },
  { id: 'recherche',   href: '/recherche',         label: 'Rechercher',  ic: ICONS.search },
  { id: 'discussion',  href: '/discussion',        label: 'Discussion',  ic: ICONS.chat },
  { id: 'commandes',   href: '/admin/commandes',   label: 'Commandes',   ic: ICONS.commandes },
  { id: 'abonnement',  href: '/abonnement',        label: 'Abonnement',  ic: ICONS.card },
];

const NAV_ADMIN = [
  { id: 'accueil',     href: '/accueil',          label: 'Accueil',     ic: ICONS.home },
  { id: 'recherche',   href: '/recherche',         label: 'Rechercher',  ic: ICONS.search },
  { id: 'commandes',   href: '/admin/commandes',   label: 'Commandes',   ic: ICONS.commandes },
  { id: 'abonnements', href: '/admin/abonnements', label: 'Abonnements', ic: ICONS.card },
];

/* ─────────────────────────────────────────────────────────────────────────────
   NOTIFICATION BAR
───────────────────────────────────────────────────────────────────────────── */
const NotificationBar = ({ notification, onClose }) => {
  const isSuccess = notification.type === 'success';
  const isError = notification.type === 'error';
  
  const getColors = () => {
    if (isSuccess) return {
      bg: 'rgba(16,185,129,0.08)',
      border: 'rgba(16,185,129,0.25)',
      icon: '#10b981',
      text: '#0f172a',
      progress: '#10b981'
    };
    if (isError) return {
      bg: 'rgba(220,38,38,0.08)',
      border: 'rgba(220,38,38,0.2)',
      icon: '#dc2626',
      text: '#0f172a',
      progress: '#dc2626'
    };
    return {
      bg: 'rgba(59,130,246,0.08)',
      border: 'rgba(59,130,246,0.2)',
      icon: '#3b82f6',
      text: '#0f172a',
      progress: '#3b82f6'
    };
  };
  
  const colors = getColors();
  const icon = isSuccess ? ICONS.success : isError ? ICONS.error : ICONS.info;

  return (
    <motion.div
      key="notif"
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={SPRING_CONTENT}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        height: '100%',
        padding: '0 22px',
        position: 'relative',
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 22, delay: 0.06 }}
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          color: colors.icon,
        }}
      >
        {icon}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.08 }}
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <p style={{
          color: colors.text,
          fontSize: 13.5,
          fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: '-0.01em',
          margin: 0,
          whiteSpace: 'nowrap',
        }}>
          {notification.message}
        </p>
        {notification.details && (
          <p style={{
            color: '#64748b',
            fontSize: 10.5,
            fontWeight: 400,
            fontFamily: "'DM Sans', sans-serif",
            margin: 0,
            opacity: 0.7,
            whiteSpace: 'nowrap',
          }}>
            {notification.details}
          </p>
        )}
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.05)' }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          flexShrink: 0,
          transition: 'all 0.15s ease',
          outline: 'none',
        }}
      >
        {ICONS.close}
      </motion.button>

      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 24,
          right: 24,
          height: 1.5,
          borderRadius: 99,
          background: colors.progress,
          opacity: 0.3,
          transformOrigin: 'left',
        }}
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 4.2, ease: 'linear' }}
      />
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   NAV LINK
───────────────────────────────────────────────────────────────────────────── */
const NavLink = ({ lk, index, active, isCompact, navigate }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.07 + index * 0.035, ...SPRING_CONTENT }}
      whileTap={{ scale: 0.89 }}
      onClick={() => lk.href.startsWith('/') ? navigate(lk.href) : (window.location.hash = lk.href)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isCompact ? '9px 12px' : '8px 13px',
        borderRadius: 13,
        border: 'none',
        background: 'transparent',
        color: active ? '#0f172a' : hovered ? '#475569' : '#94a3b8',
        cursor: 'pointer',
        minWidth: isCompact ? 46 : 'auto',
        gap: 3,
        outline: 'none',
        transition: 'color 0.18s ease',
      }}
    >
      <AnimatePresence>
        {(active || hovered) && (
          <motion.div
            key="bg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={SPRING_HOVER}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 13,
              background: active
                ? 'rgba(201,169,110,0.1)'
                : 'rgba(15,23,42,0.04)',
              zIndex: -1,
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          scale: active ? 1.08 : hovered ? 1.04 : 1,
          color: active ? '#c9a96e' : hovered ? '#475569' : '#94a3b8',
        }}
        transition={SPRING_HOVER}
      >
        {lk.ic}
      </motion.div>

      {!isCompact && (
        <span style={{
          fontSize: 8,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: active ? 600 : 400,
          fontFamily: "'DM Mono', monospace",
          transition: 'font-weight 0.2s',
          color: active ? '#c9a96e' : 'inherit',
        }}>
          {lk.label}
        </span>
      )}

      {active && (
        <motion.div
          layoutId="activeNavDot"
          transition={SPRING_MORPH}
          style={{
            position: 'absolute',
            bottom: isCompact ? 5 : 4,
            width: 3,
            height: 3,
            borderRadius: '50%',
            backgroundColor: '#c9a96e',
          }}
        />
      )}
    </motion.button>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   HAMBURGER
───────────────────────────────────────────────────────────────────────────── */
const HamburgerButton = ({ onOpen }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.14, ...SPRING_CONTENT }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.88 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onOpen}
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: hovered ? 'rgba(201,169,110,0.1)' : 'rgba(15,23,42,0.03)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4.5,
        border: `1px solid ${hovered ? 'rgba(201,169,110,0.3)' : 'rgba(15,23,42,0.08)'}`,
        cursor: 'pointer',
        flexShrink: 0,
        outline: 'none',
        transition: 'background 0.2s, border-color 0.2s',
      }}
    >
      {[16, 10, 16].map((w, i) => (
        <motion.span
          key={i}
          animate={{ backgroundColor: hovered ? '#c9a96e' : '#64748b', width: w }}
          transition={{ duration: 0.2 }}
          style={{ height: 1.5, borderRadius: 2, display: 'block' }}
        />
      ))}
    </motion.button>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   NAV CONTENT
───────────────────────────────────────────────────────────────────────────── */
const NavContent = ({ links, isCompact, location, navigate, onOpenMenu, userRole }) => (
  <motion.div
    key="nav"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, scale: 0.98 }}
    transition={{ duration: 0.16 }}
    style={{
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      gap: isCompact ? 2 : 10,
      justifyContent: isCompact ? 'center' : 'space-between',
      paddingLeft: isCompact ? 8 : 18,
      paddingRight: isCompact ? 8 : 14,
    }}
  >
    {!isCompact && (
      <motion.button
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.04, ...SPRING_CONTENT }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/accueil')}
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 7,
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          flexShrink: 0,
          padding: '4px 6px',
          borderRadius: 10,
          outline: 'none',
        }}
      >
        <span style={{
          color: '#0f172a',
          fontWeight: 700,
          fontSize: 21,
          letterSpacing: '-0.03em',
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
        }}>
          e<span style={{ color: '#c9a96e' }}>.</span>Sary
        </span>
        <span style={{
          color: '#c9a96e',
          fontSize: 7,
          letterSpacing: '0.42em',
          textTransform: 'uppercase',
          fontFamily: "'DM Mono', monospace",
          opacity: 0.7,
          marginBottom: 2,
        }}>
          {userRole === 'admin' ? 'Admin' : userRole === 'photographe' ? 'Pro' : 'Studio'}
        </span>
      </motion.button>
    )}

    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      flex: isCompact ? '1' : '0 1 auto',
      justifyContent: 'center',
    }}>
      {links.map((lk, i) => {
        const active = location.pathname === lk.href ||
          (lk.href.startsWith('#') && typeof window !== 'undefined' && window.location.hash === lk.href);
        return (
          <NavLink key={lk.id} lk={lk} index={i} active={active} isCompact={isCompact} navigate={navigate} />
        );
      })}
    </div>

    <HamburgerButton onOpen={onOpenMenu} />
  </motion.div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   MENU PANEL
───────────────────────────────────────────────────────────────────────────── */
const MenuPanel = ({ resolvedUser, initiales, isAdmin, isPhotographe, onLogout, isCompact, onClose }) => (
  <motion.div
    key="menu"
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.97 }}
    transition={{ duration: 0.18 }}
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}
  >
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, ...SPRING_CONTENT }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 18px 13px',
        borderBottom: '1px solid rgba(15,23,42,0.06)',
        flexShrink: 0,
      }}
    >
      <span style={{
        color: '#0f172a',
        fontWeight: 700,
        fontSize: 18,
        letterSpacing: '-0.03em',
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: 'italic',
      }}>
        e<span style={{ color: '#c9a96e' }}>.</span>Sary
      </span>

      <motion.button
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.09 }}
        whileHover={{ scale: 1.12, backgroundColor: 'rgba(15,23,42,0.05)' }}
        whileTap={{ scale: 0.88 }}
        onClick={onClose}
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: 'rgba(15,23,42,0.03)',
          border: '1px solid rgba(15,23,42,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#64748b',
          transition: 'all 0.15s ease',
          outline: 'none',
        }}
      >
        {ICONS.close}
      </motion.button>
    </motion.div>

    <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
      <MenuArtiste
        user={resolvedUser}
        initiales={initiales}
        isAdmin={isAdmin}
        isPhotographe={isPhotographe}
        onLogout={onLogout}
        isCompact={isCompact}
        onClose={onClose}
      />
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
const Entete_app = ({ user: propsUser, onLogout }) => {
  const [profileOpen, setProfileOpen]   = useState(false);
  const [notification, setNotification] = useState(null);
  const [localUser, setLocalUser]       = useState(null);
  const [winW, setWinW]                 = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );
  const [menuHeight, setMenuHeight] = useState(0);
  const [notificationWidth, setNotificationWidth] = useState(0);
  const menuContentRef              = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const h = () => setWinW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    if (propsUser) {
      setLocalUser(propsUser);
    } else {
      const s = localStorage.getItem('user_profile');
      if (s) { try { setLocalUser(JSON.parse(s)); } catch (_) {} }
    }
  }, [propsUser]);

  useEffect(() => { setProfileOpen(false); }, [location.pathname]);

  // Notifications
  useEffect(() => {
    const handleNotification = (e) => {
      const { message, type = 'success', details = '' } = e.detail || {};
      if (!message) return;
      
      setNotification({ message, type, details });
      
      setTimeout(() => {
        setNotification(null);
      }, 4500);
    };
    
    window.addEventListener('trigger-island-notification', handleNotification);
    return () => window.removeEventListener('trigger-island-notification', handleNotification);
  }, []);

  // Mesurer largeur notification
  useEffect(() => {
    if (!notification) {
      setNotificationWidth(0);
      return;
    }
    
    const measureText = (text, fontSize = 13.5) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.font = `500 ${fontSize}px "DM Sans", sans-serif`;
      return ctx.measureText(text).width;
    };

    const mainTextWidth = measureText(notification.message);
    const detailsWidth = notification.details ? measureText(notification.details, 10.5) : 0;
    const maxTextWidth = Math.max(mainTextWidth, detailsWidth);
    
    const totalWidth = maxTextWidth + 34 + 28 + 44 + 20;
    const minWidth = 320;
    const maxWidth = Math.min(winW - 48, 700);
    
    setNotificationWidth(Math.min(Math.max(totalWidth, minWidth), maxWidth));
    
  }, [notification, winW]);

  const closeNotification = () => setNotification(null);

  useEffect(() => {
    if (!profileOpen || !menuContentRef.current) return;
    const obs = new ResizeObserver(() => {
      if (menuContentRef.current) setMenuHeight(menuContentRef.current.scrollHeight);
    });
    obs.observe(menuContentRef.current);
    setMenuHeight(menuContentRef.current.scrollHeight);
    return () => obs.disconnect();
  }, [profileOpen, localUser]);

  // Analyse du rôle exact de l'utilisateur
  const resolvedUser = localUser?.user || localUser;
  const rawRole      = resolvedUser?.role || (resolvedUser?.is_superuser ? 'admin' : null) || resolvedUser?.type;
  
  const isAdmin       = rawRole === 'admin' || rawRole === true || rawRole === 'administrator';
  const isPhotographe = rawRole === 'photographe';

  // Choix de la navigation selon le rôle
  const links = isAdmin ? NAV_ADMIN : isPhotographe ? NAV_PHOTOGRAPHE : NAV_CLIENT;

  // Pages dites "compactes"
  const isCompact =
    location.pathname === '/profil'            ||
    location.pathname === '/recherche'         ||
    location.pathname === '/discussion'        ||
    location.pathname === '/commandes'         ||
    location.pathname === '/abonnement';

  const getInitiales = useCallback(() => {
    if (!resolvedUser) return 'U';
    const p = resolvedUser.prenom || resolvedUser.first_name || resolvedUser.username || '';
    const n = resolvedUser.nom    || resolvedUser.last_name  || '';
    if (p && n) return `${p[0]}${n[0]}`.toUpperCase();
    if (p) return p.substring(0, 2).toUpperCase();
    return 'U';
  }, [resolvedUser]);
  
  const initiales = getInitiales();

  /* ── dimensions ── */
  const getConfig = () => {
    if (notification && notificationWidth > 0) {
      return {
        width: notificationWidth,
        height: notification.details ? 76 : 64,
        borderRadius: 32,
      };
    }
    if (profileOpen) {
      const h = menuHeight > 0 ? menuHeight + 88 : 370;
      return { width: 330, height: Math.min(h, winW > 768 ? 570 : 490), borderRadius: 28 };
    }
    if (isCompact) {
      const w = 50 + links.length * 52;
      return { width: w, height: 52, borderRadius: 26 };
    }
    return { width: Math.min(winW - 64, 800), height: 66, borderRadius: 33 };
  };
  const cfg = getConfig();

  /* ── position ── */
  const getPos = () => {
    if (location.pathname === '/admin/abonnements' || location.pathname === '/admin/commandes') {
      return { left: '50%', top: '24px', transform: 'translateX(-50%)' };
    }
    if (isCompact || profileOpen) return { left: '24px', top: '24px', transform: 'none' };
    return { left: '50%', top: '24px', transform: 'translateX(-50%)' };
  };
  const pos = getPos();

  const showNotification = notification !== null;

  return (
    <motion.div
      animate={{ left: pos.left, top: pos.top, transform: pos.transform }}
      transition={{ ...SPRING_MORPH, left: { type: 'spring', stiffness: 110, damping: 20 } }}
      style={{ position: 'fixed', zIndex: 9999, pointerEvents: 'auto' }}
    >
      <motion.div
        layout
        animate={{ 
          width: cfg.width, 
          height: cfg.height, 
          borderRadius: cfg.borderRadius,
          borderColor: showNotification
            ? notification.type === 'success'
              ? 'rgba(16,185,129,0.3)'
              : notification.type === 'error'
                ? 'rgba(220,38,38,0.25)'
                : 'rgba(59,130,246,0.25)'
            : 'rgba(255,255,255,0.9)'
        }}
        transition={SPRING_MORPH}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(52px) saturate(200%)',
          WebkitBackdropFilter: 'blur(52px) saturate(200%)',
          boxShadow: profileOpen
            ? '0 28px 70px -14px rgba(15,23,42,0.14), 0 0 0 1px rgba(15,23,42,0.07)'
            : showNotification
              ? `0 10px 36px -8px rgba(15,23,42,0.11), 0 0 0 1px ${
                  notification.type === 'success' ? 'rgba(16,185,129,0.2)' :
                  notification.type === 'error' ? 'rgba(220,38,38,0.2)' :
                  'rgba(59,130,246,0.2)'
                }`
              : '0 4px 24px -4px rgba(15,23,42,0.08), 0 0 0 1px rgba(15,23,42,0.06)',
          border: showNotification
            ? notification.type === 'success'
              ? '1px solid rgba(16,185,129,0.3)'
              : notification.type === 'error'
                ? '1px solid rgba(220,38,38,0.25)'
                : '1px solid rgba(59,130,246,0.25)'
            : '1px solid rgba(255,255,255,0.9)',
          willChange: 'width, height, border-radius',
        }}
      >
        <motion.div
          animate={{ opacity: profileOpen ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            top: 0,
            left: '8%',
            right: '8%',
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)',
            pointerEvents: 'none',
          }}
        />

        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: showNotification ? 0 : 1,
            pointerEvents: showNotification ? 'none' : 'auto',
            transition: 'opacity 0.3s ease',
          }}>
            {profileOpen ? (
              <MenuPanel
                resolvedUser={resolvedUser}
                initiales={initiales}
                isAdmin={isAdmin}
                isPhotographe={isPhotographe}
                onLogout={onLogout}
                isCompact={isCompact}
                onClose={() => setProfileOpen(false)}
              />
            ) : (
              <NavContent
                links={links}
                isCompact={isCompact}
                location={location}
                navigate={navigate}
                onOpenMenu={() => setProfileOpen(true)}
                userRole={rawRole}
              />
            )}
          </div>

          <AnimatePresence>
            {showNotification && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                width: '100%',
                height: '100%',
              }}>
                <NotificationBar 
                  notification={notification} 
                  onClose={closeNotification}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {profileOpen && (
          <motion.div
            key="glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute',
              inset: -1,
              borderRadius: cfg.borderRadius + 2,
              boxShadow: '0 0 0 2px rgba(201,169,110,0.2)',
              pointerEvents: 'none',
              zIndex: -1,
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Entete_app;