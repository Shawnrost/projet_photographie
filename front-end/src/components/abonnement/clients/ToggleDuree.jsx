import { motion } from 'framer-motion';

const DUREES = [
  { value: '1_mois', label: '1 mois' },
  { value: '3_mois', label: '3 mois' },
  { value: '6_mois', label: '6 mois' },
];

const SPRING = { type: 'spring', stiffness: 400, damping: 32 };

// variant "dark" : pour fond vert sauge (page browse)
// variant "light" : pour fond blanc (panneau détail)
const ToggleDuree = ({ dureeActive, onChange, variant = 'light' }) => {
  const isDark = variant === 'dark';

  return (
    <div
      className="relative flex items-center gap-1 rounded-full border p-1"
      style={{
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(26,26,26,0.08)',
        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(26,26,26,0.03)',
      }}
    >
      {DUREES.map((d) => {
        const isActive = d.value === dureeActive;
        return (
          <button
            key={d.value}
            onClick={() => onChange(d.value)}
            className="relative px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] rounded-full transition-colors duration-300"
            style={{
              color: isActive
                ? (isDark ? '#1f2922' : '#1a1a1a')
                : (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(26,26,26,0.4)'),
            }}
          >
            {isActive && (
              <motion.span
                layoutId={isDark ? 'dureePillDark' : 'dureePillLight'}
                transition={SPRING}
                className="absolute inset-0 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.12)]"
                style={{
                  backgroundColor: isDark ? '#f8f9f8' : '#ffffff',
                  border: '1px solid rgba(201,169,110,0.25)',
                  willChange: 'transform',
                }}
              />
            )}
            <span className="relative z-10">{d.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ToggleDuree;