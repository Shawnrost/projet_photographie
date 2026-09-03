import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────────────────────
   SPRINGS
───────────────────────────────────────────────────────────────────────────── */
const SPRING_ITEM  = { type: 'spring', stiffness: 280, damping: 26, mass: 0.8 };
const SPRING_HOVER = { type: 'spring', stiffness: 400, damping: 22 };

/* ─────────────────────────────────────────────────────────────────────────────
   SVG ICONS — fine stroke, professional line-art
───────────────────────────────────────────────────────────────────────────── */
const IC = {
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  profile: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
  stats: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  palette: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/>
      <circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/>
      <path d="M12 2C6.5 2 2 6.5 2 12a10 10 0 0010 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  ),
  gallery: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  commandes: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor"/>
      <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor"/>
      <path d="M7 15h4" stroke="currentColor" strokeLinecap="round"/>
      <path d="M15 15h2" stroke="currentColor" strokeLinecap="round"/>
    </svg>
  ),
  card: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
      <path d="M5 15h4" strokeLinecap="round"/>
    </svg>
  ),
  logout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  chevron: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
};

/* ─────────────────────────────────────────────────────────────────────────────
   STAGGER VARIANTS
───────────────────────────────────────────────────────────────────────────── */
const container = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.07 } },
  exit:   { opacity: 0, transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const itemVariant = {
  hidden: { opacity: 0, x: -12, scale: 0.97 },
  show:   { opacity: 1, x: 0,   scale: 1,    transition: SPRING_ITEM },
  exit:   { opacity: 0, x: -8,  scale: 0.97, transition: { duration: 0.11 } },
};

/* ─────────────────────────────────────────────────────────────────────────────
   ACTION ITEM
───────────────────────────────────────────────────────────────────────────── */
const ActionItem = ({ action, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const isLogout = !!action.isLogout;

  const accentColor  = isLogout ? '#dc2626'      : '#c9a96e';
  const accentAlpha  = isLogout ? 'rgba(220,38,38,' : 'rgba(201,169,110,';
  const labelColor   = isLogout ? '#dc2626'      : '#0f172a';
  const subColor     = isLogout ? 'rgba(220,38,38,0.55)' : '#94a3b8';

  return (
    <motion.div variants={itemVariant}>
      <motion.button
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileTap={{ scale: 0.975 }}
        onClick={onClick}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '9px 12px',
          borderRadius: 12,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          textAlign: 'left',
          outline: 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* hover bg */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              key="hbg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 12,
                background: `${accentAlpha}0.06)`,
              }}
            />
          )}
        </AnimatePresence>

        {/* left accent bar */}
        <motion.div
          animate={{ scaleY: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          transition={SPRING_HOVER}
          style={{
            position: 'absolute',
            left: 0,
            top: '20%',
            bottom: '20%',
            width: 2,
            borderRadius: 2,
            backgroundColor: accentColor,
            transformOrigin: 'center',
          }}
        />

        {/* icon box */}
        <motion.div
          animate={{
            backgroundColor: hovered ? `${accentAlpha}0.08)` : 'rgba(15,23,42,0.04)',
            borderColor:     hovered ? `${accentAlpha}0.18)` : 'rgba(15,23,42,0.07)',
            color:           hovered ? accentColor : '#64748b',
          }}
          transition={{ duration: 0.18 }}
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            border: '1px solid rgba(15,23,42,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <motion.div
            animate={{ scale: hovered ? 1.12 : 1 }}
            transition={SPRING_HOVER}
          >
            {action.svgIcon}
          </motion.div>
        </motion.div>

        {/* text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <motion.span
            animate={{ x: hovered ? 2 : 0, color: hovered ? labelColor : isLogout ? '#dc2626' : '#1e293b' }}
            transition={SPRING_HOVER}
            style={{
              fontSize: 13,
              fontWeight: 500,
              display: 'block',
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '-0.01em',
            }}
          >
            {action.label}
          </motion.span>
          <span style={{
            color: subColor,
            fontSize: 10.5,
            fontWeight: 400,
            display: 'block',
            marginTop: 1,
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: '0.005em',
          }}>
            {action.desc}
          </span>
        </div>

        {/* chevron */}
        <motion.div
          animate={{ x: hovered ? 2 : -1, opacity: hovered ? 0.65 : 0.2, color: accentColor }}
          transition={SPRING_HOVER}
          style={{ flexShrink: 0 }}
        >
          {IC.chevron}
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────────────────────────────────────────── */
const SectionLabel = ({ children }) => (
  <motion.div
    variants={itemVariant}
    style={{
      padding: '10px 14px 4px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}
  >
    <span style={{
      color: '#cbd5e1',
      fontSize: 9,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      fontFamily: "'DM Mono', monospace",
    }}>
      {children}
    </span>
    <div style={{ flex: 1, height: 1, background: 'rgba(15,23,42,0.05)' }} />
  </motion.div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   MENU ARTISTE
───────────────────────────────────────────────────────────────────────────── */
const MenuArtiste = ({ user, initiales, onLogout, onClose, isAdmin }) => {
  const navigate = useNavigate();
  const userObj  = user?.user || user;

  const getNomAffichage = () => {
    if (!userObj) return 'Artiste Invité';
    const prenom = userObj.prenom   || userObj.first_name || '';
    const nom    = userObj.nom      || userObj.last_name  || '';
    const uname  = userObj.username || '';
    if (prenom || nom) return `${prenom} ${nom}`.trim();
    return uname || 'Artiste Invité';
  };
  const nomAffichage = getNomAffichage();

  const actions = isAdmin
    ? [
        { label: 'Tableau de bord', href: '/admin/dashboard',   svgIcon: IC.dashboard, desc: 'Vue d\'ensemble' },
        { label: 'Mon profil',      href: '/profil',            svgIcon: IC.profile,   desc: 'Gérer mon compte' },
        { label: 'Abonnements',     href: '/admin/abonnements', svgIcon: IC.card,      desc: 'Gestion des formules' },
        { label: 'Commandes',       href: '/admin/commandes',   svgIcon: IC.commandes, desc: 'Suivi de toutes les commandes' },
        { label: 'Statistiques',    href: '/admin/stats',       svgIcon: IC.stats,     desc: 'Analyses détaillées' },
        { label: 'Paramètres',      href: '/parametres',        svgIcon: IC.settings,  desc: 'Configuration' },
      ]
    : [
        { label: 'Profil artiste', href: '/profil',      svgIcon: IC.palette,   desc: 'Mon espace créatif' },
        { label: 'Mes œuvres',     href: '/mes-oeuvres', svgIcon: IC.gallery,   desc: 'Collection personnelle' },
        { label: 'Mon abonnement', href: '/abonnement',  svgIcon: IC.card,      desc: 'Ma formule en cours' },
        { label: 'Mes commandes',  href: '/commandes',   svgIcon: IC.commandes, desc: 'Panier & historique' },
        { label: 'Paramètres',     href: '/parametres',  svgIcon: IC.settings,  desc: 'Préférences' },
      ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      exit="exit"
      style={{ padding: '4px 8px 10px', display: 'flex', flexDirection: 'column', gap: 0 }}
    >
      {/* ── Profile card ── */}
      <motion.div
        variants={itemVariant}
        style={{
          padding: '13px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 13,
          borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(201,169,110,0.06) 0%, rgba(15,23,42,0.02) 100%)',
          border: '1px solid rgba(201,169,110,0.14)',
          margin: '0 2px 6px',
        }}
      >
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.06 }}
          transition={SPRING_HOVER}
          style={{
            width: 44,
            height: 44,
            borderRadius: 13,
            background: 'linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(201,169,110,0.2)',
            boxShadow: '0 2px 10px rgba(201,169,110,0.1), 0 1px 3px rgba(0,0,0,0.04)',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.16, type: 'spring', stiffness: 400, damping: 20 }}
            style={{
              color: '#0f172a',
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: '0.03em',
            }}
          >
            {initiales}
          </motion.span>
          {/* gold corner accent */}
          <div style={{
            position: 'absolute',
            bottom: 3,
            right: 3,
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#c9a96e',
            opacity: 0.8,
          }} />
        </motion.div>

        {/* Name + role */}
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.13 }}
          style={{ flex: 1, minWidth: 0 }}
        >
          <p style={{
            color: '#0f172a',
            fontSize: 13.5,
            fontWeight: 600,
            margin: 0,
            letterSpacing: '-0.02em',
            fontFamily: "'DM Sans', sans-serif",
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {nomAffichage}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
            <motion.div
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                backgroundColor: '#10b981',
                flexShrink: 0,
              }}
            />
            <p style={{
              color: '#94a3b8',
              fontSize: 9.5,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              margin: 0,
              fontFamily: "'DM Mono', monospace",
              fontWeight: 500,
            }}>
              {isAdmin ? 'Administrateur' : 'Artiste'}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Navigation ── */}
      <SectionLabel>Navigation</SectionLabel>

      <div style={{ padding: '0 2px' }}>
        {actions.map((action) => (
          <ActionItem
            key={action.label}
            action={action}
            onClick={() => {
              navigate(action.href);
              if (onClose) onClose();
            }}
          />
        ))}
      </div>

      {/* ── Session ── */}
      <SectionLabel>Session</SectionLabel>

      <div style={{ padding: '0 2px' }}>
        <ActionItem
          action={{
            label:    'Déconnexion',
            desc:     'Mettre fin à la session en cours',
            svgIcon:  IC.logout,
            isLogout: true,
          }}
          onClick={() => {
            if (onLogout) onLogout();
            if (onClose)  onClose();
          }}
        />
      </div>
    </motion.div>
  );
};

export default MenuArtiste;