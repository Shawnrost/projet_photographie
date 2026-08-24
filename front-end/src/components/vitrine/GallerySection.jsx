// GallerySection.jsx
import { useEffect, useRef, useState, memo, forwardRef } from 'react';
import useRevealOnScroll from '../hooks/useRevealOnScroll';

// ─────────────────────────────────────────────────────────────────────────
// BANQUE D'IMAGES — chaque image n'apparaît qu'UNE SEULE FOIS dans toute
// la galerie. 4 images locales (les vôtres) + 6 images distantes (Lorem
// Picsum, libres d'usage, à remplacer par vos propres photos si besoin —
// il suffit de changer les URLs ci-dessous, la structure reste identique).
// ─────────────────────────────────────────────────────────────────────────
const LOCAL_IMAGES = [
  { src: '/images/2.jpeg', label: 'Portrait Émotionnel — 35mm', category: 'Portrait' },
  { src: '/images/3.jpeg', label: 'Paysage Onirique — 50mm', category: 'Paysage' },
  { src: '/images/5.jpeg', label: 'Street Art Urbain — 35mm', category: 'Street' },
  { src: '/images/6.jpeg', label: 'Nature Morte — 50mm', category: 'Nature' },
];

const REMOTE_IMAGES = [
  { src: 'https://picsum.photos/seed/architecture-minimal/1000/1300', label: 'Architecture Minimaliste — 24mm', category: 'Architecture' },
  { src: 'https://picsum.photos/seed/contemporary-art-gallery/1000/1300', label: 'Art Contemporain — 85mm', category: 'Art' },
  { src: 'https://picsum.photos/seed/travel-horizon-dusk/1000/1300', label: 'Voyage & Horizons — 24mm', category: 'Voyage' },
  { src: 'https://picsum.photos/seed/fashion-editorial-look/1000/1300', label: 'Mode & Élégance — 85mm', category: 'Mode' },
  { src: 'https://picsum.photos/seed/wildlife-portrait-eye/1000/1300', label: 'Faune Sauvage — 400mm', category: 'Faune' },
  { src: 'https://picsum.photos/seed/abstract-color-flow/1000/1300', label: 'Abstraction Chromatique — Macro', category: 'Abstrait' },
];

// Pool final : 10 images, toutes uniques. On pioche dedans sans jamais
// réutiliser le même index deux fois.
const GALLERY_IMAGES = [...LOCAL_IMAGES, ...REMOTE_IMAGES];

// CHAQUE SECTION UTILISE DES IMAGES UNIQUES (aucun index réemployé)
const STORIES = [
  {
    id: 1,
    title: "Une Galerie d'Exception",
    subtitle: "Là où l'art prend vie",
    description: "Bienvenue dans l'espace dédié aux photographes de talent. Chaque image raconte une histoire unique, capture un instant précieux, immortalise une émotion authentique. Notre plateforme est un pont entre les artistes de l'objectif et les amateurs d'art visuel.",
    images: [
      { ...GALLERY_IMAGES[0], span: 'md:col-span-4 md:row-span-3', dir: 'left' },
      { ...GALLERY_IMAGES[1], span: 'md:col-span-2 md:row-span-2', dir: 'right' },
    ],
  },
  {
    id: 2,
    title: "Œuvres Uniques",
    subtitle: "Chaque pièce est exclusive",
    description: "Chaque photographie présentée sur notre plateforme est unique et authentique. Les photographes sélectionnent leurs meilleures œuvres, offrant aux collectionneurs des pièces rares et originales. Une collection soigneusement curatée.",
    images: [
      { ...GALLERY_IMAGES[2], span: 'md:col-span-3 md:row-span-3', dir: 'left' },
      { ...GALLERY_IMAGES[3], span: 'md:col-span-3 md:row-span-3', dir: 'right' },
    ],
  },
  {
    id: 3,
    title: "Échanges Créatifs",
    subtitle: "Dialogue & Collaboration",
    description: "Les collectionneurs et amateurs peuvent interagir directement avec les photographes. Que ce soit pour acquérir une œuvre existante ou pour commander une séance photo sur-mesure pour un événement spécial, le dialogue est au cœur de notre plateforme.",
    images: [
      { ...GALLERY_IMAGES[4], span: 'md:col-span-3 md:row-span-2', dir: 'left' },
      { ...GALLERY_IMAGES[5], span: 'md:col-span-3 md:row-span-2', dir: 'right' },
      { ...GALLERY_IMAGES[6], span: 'md:col-span-3 md:row-span-2', dir: 'left' },
      { ...GALLERY_IMAGES[7], span: 'md:col-span-3 md:row-span-2', dir: 'right' },
    ],
  },
  {
    id: 4,
    title: "Vision Partagée",
    subtitle: "L'Art Accessible à Tous",
    description: "Nous croyons que l'art doit être accessible. Notre plateforme démocratise la photographie en mettant en relation directe les créateurs et les passionnés, sans intermédiaire. Une vision moderne de la diffusion artistique.",
    images: [
      { ...GALLERY_IMAGES[8], span: 'md:col-span-4 md:row-span-3', dir: 'left' },
      { ...GALLERY_IMAGES[9], span: 'md:col-span-2 md:row-span-2', dir: 'right' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Petits composants utilitaires pour le rendu artistique
// ─────────────────────────────────────────────────────────────────────────

// Révélation du texte mot par mot (effet éditorial, cinématographique)
const RevealWords = memo(function RevealWords({ text, revealed, className = '', baseDelay = 0 }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.28em]">
          <span
            className={`inline-block transition-all duration-700 ease-out ${
              revealed ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-[110%] opacity-0 rotate-3'
            }`}
            style={{ transitionDelay: `${baseDelay + i * 55}ms` }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
});

// Bouton "magnétique" — suit légèrement le curseur, retour élastique
const MagneticButton = memo(function MagneticButton({ children, className = '', strength = 18, ...props }) {
  const ref = useRef(null);
  const rafRef = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      if (el) {
        el.style.transition = 'transform 0.15s ease-out';
        el.style.transform = `translate(${px * strength}px, ${py * strength}px)`;
      }
      rafRef.current = null;
    });
  };

  const handleLeave = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const el = ref.current;
    if (el) {
      el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      el.style.transform = 'translate(0px, 0px)';
    }
  };

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ transform: 'translate(0px, 0px)', willChange: 'transform' }}
      {...props}
    >
      {children}
    </button>
  );
});

// Compteur animé (0 → valeur) déclenché à l'entrée dans le viewport
const CountUp = memo(function CountUp({ target, trigger, suffix = '' }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let raf;
    const duration = 1100;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, target]);

  return <>{value}{suffix}</>;
});

// Grain filmique subtil, posé sur toute la section, pour une texture "argentique"
const FilmGrain = memo(function FilmGrain() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05] mix-blend-overlay"
      aria-hidden="true"
    >
      <filter id="grainFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grainFilter)" />
    </svg>
  );
});

// Curseur "diaphragme" — clin d'œil photographique, apparaît au survol des images
// forwardRef + memo : sa position est mise à jour directement en DOM (aucun re-render au mousemove)
const ApertureCursor = memo(
  forwardRef(({ visible }, ref) => (
    <div
      ref={ref}
      className="pointer-events-none absolute z-20 hidden md:block transition-opacity duration-300"
      style={{
        left: '50%',
        top: '50%',
        opacity: visible ? 1 : 0,
        transform: 'translate(-50%, -50%)',
        willChange: 'transform, left, top',
      }}
    >
      <svg width="52" height="52" viewBox="0 0 52 52" className={visible ? 'animate-[apertureSpin_6s_linear_infinite]' : ''}>
        <circle cx="26" cy="26" r="23" fill="none" stroke="rgba(156,175,136,0.55)" strokeWidth="1" />
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={i}
            x1="26"
            y1="26"
            x2="26"
            y2="6"
            stroke="rgba(156,175,136,0.85)"
            strokeWidth="1.5"
            strokeLinecap="round"
            transform={`rotate(${i * 60} 26 26)`}
          />
        ))}
        <circle cx="26" cy="26" r="3" fill="rgba(156,175,136,0.9)" />
      </svg>
    </div>
  ))
);

// Composant Image avec animations
const StoryImage = memo(function StoryImage({ image, index, isActive, direction = 'left' }) {
  const imageRef = useRef(null);
  const innerRef = useRef(null);
  const apertureRef = useRef(null);
  const rafRef = useRef(null);
  const pendingRef = useRef({ px: 0.5, py: 0.5 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Distance et rotation de départ selon le côté d'arrivée
  const enterX = direction === 'right' ? 140 : direction === 'left' ? -140 : 0;
  const enterRotate = direction === 'right' ? 5 : direction === 'left' ? -5 : 0;
  const [particles] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 2,
    }))
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && isActive) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, [isActive]);

  // Tilt 3D + curseur diaphragme : écrits directement en DOM via rAF,
  // sans passer par setState, pour rester fluide même à haute fréquence.
  const handleMouseMove = (e) => {
    const el = imageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    pendingRef.current = {
      px: (e.clientX - rect.left) / rect.width,
      py: (e.clientY - rect.top) / rect.height,
    };
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      const { px, py } = pendingRef.current;
      const tiltX = (0.5 - py) * 10;
      const tiltY = (px - 0.5) * 10;
      if (innerRef.current) {
        innerRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${innerRef.current.dataset.hovered === '1' ? 1.03 : 1})`;
      }
      if (apertureRef.current) {
        apertureRef.current.style.left = `${px * 100}%`;
        apertureRef.current.style.top = `${py * 100}%`;
      }
      rafRef.current = null;
    });
  };

  const resetTilt = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (innerRef.current) {
      innerRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
  };

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      ref={imageRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true);
        if (innerRef.current) innerRef.current.dataset.hovered = '1';
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (innerRef.current) innerRef.current.dataset.hovered = '0';
        resetTilt();
      }}
      className={`group relative overflow-hidden rounded-lg ${image.span}`}
      style={{
        transitionProperty: 'transform, opacity',
        transitionDuration: '1100ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${index * 160}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'translate(0, 0) rotate(0deg)'
          : `translate(${enterX}px, 70px) rotate(${enterRotate}deg)`,
        willChange: 'transform, opacity',
      }}
    >
      <div
        ref={innerRef}
        data-hovered="0"
        className="relative h-full w-full overflow-hidden bg-charcoal/90"
        style={{
          boxShadow: isHovered ? '0 25px 70px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.2)',
          transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
          transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease',
          borderRadius: 'inherit',
          willChange: 'transform',
        }}
      >
        {/* Image avec dérive "Ken Burns" continue + zoom au survol + fallback local garanti */}
        {!imgError ? (
          <img
            src={image.src}
            alt={image.label}
            className={`h-full w-full object-cover transition-[filter] duration-[1500ms] ${
              isVisible ? 'blur-0' : 'blur-md'
            }`}
            style={{
              transform: isHovered ? 'scale(1.18)' : 'scale(1.05)',
              transition: 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
              animation: isVisible && !isHovered ? 'kenBurns 22s ease-in-out infinite alternate' : 'none',
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImgError(true)}
          />
        ) : (
          // Si l'image ne charge pas (réseau, pare-feu, etc.), on affiche
          // une carte de substitution locale — jamais un espace vide.
          <div className="h-full w-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-charcoal via-[#232323] to-sage/10">
            <svg width="34" height="34" viewBox="0 0 34 34" className="opacity-40">
              <rect x="1" y="6" width="32" height="24" rx="2" fill="none" stroke="rgba(156,175,136,0.6)" strokeWidth="1.5" />
              <circle cx="17" cy="18" r="6" fill="none" stroke="rgba(156,175,136,0.6)" strokeWidth="1.5" />
              <rect x="11" y="2" width="6" height="4" fill="rgba(156,175,136,0.6)" />
            </svg>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-sage/40 px-4 text-center">
              {image.category}
            </span>
          </div>
        )}

        {/* Placeholder pendant le chargement */}
        {!imageLoaded && !imgError && (
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-sage/20 animate-pulse" />
        )}

        {/* Rideau de révélation - Noir */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute inset-0 bg-charcoal transition-transform duration-[1600ms] ease-out origin-left ${
            isVisible ? 'scale-x-0 delay-300' : 'scale-x-100'
          }`} />
          <div className={`absolute inset-0 bg-charcoal/95 transition-transform duration-[1400ms] ease-out origin-right ${
            isVisible ? 'scale-x-0 delay-500' : 'scale-x-100'
          }`} />
        </div>

        {/* Deuxième rideau - Vert sauge */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute inset-0 bg-sage/30 transition-transform duration-[1200ms] ease-out origin-bottom ${
            isVisible ? 'scale-y-0 delay-700' : 'scale-y-100'
          }`} />
        </div>

        {/* Effet de lumière scintillante */}
        <div className={`absolute -inset-full transition-opacity duration-700 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sage/20 to-transparent rotate-45 animate-[shimmer_2s_infinite]" />
        </div>

        {/* Overlay sombre avec dégradé vert sauge */}
        <div className={`absolute inset-0 bg-gradient-to-t from-charcoal/90 via-sage/20 to-transparent transition-opacity duration-700 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Effet de vignette cinématographique */}
        <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)] transition-opacity duration-700 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Particules lumineuses */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-sage/40"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite`,
                boxShadow: '0 0 20px rgba(156, 175, 136, 0.3)',
              }}
            />
          ))}
        </div>

        {/* Curseur diaphragme, signature photographique de la galerie */}
        <ApertureCursor ref={apertureRef} visible={isHovered} />

        {/* Cadre vert sauge subtil */}
        <div className={`absolute inset-0 border-2 transition-colors duration-500 ${
          isHovered ? 'border-sage/40' : 'border-sage/0'
        }`} />

        {/* Badge catégorie */}
        <div className={`absolute top-4 right-4 transition-all duration-700 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <span className={`px-3 py-1.5 text-[8px] font-mono uppercase tracking-[0.2em] rounded-full bg-black/40 backdrop-blur-sm text-sage/80 border transition-all duration-500 ${
            isHovered ? 'border-sage/60 shadow-[0_0_18px_rgba(156,175,136,0.35)]' : 'border-sage/30'
          }`}>
            {image.category}
          </span>
        </div>

        {/* Label avec animation élégante */}
        <div className={`absolute bottom-0 left-0 right-0 p-5 transition-all duration-700 delay-800 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`h-px bg-sage/50 transition-all duration-700 delay-900 ${
              isVisible ? 'w-8 scale-x-100' : 'w-8 scale-x-0'
            } ${isHovered ? '!w-14' : ''}`} style={{ transitionProperty: 'width, transform' }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/90 drop-shadow-lg">
              {image.label}
            </span>
          </div>
        </div>

        {/* Fine bordure lumineuse qui se dessine au survol (remplace toute icône) */}
        <div className={`absolute inset-3 border border-white/0 transition-all duration-700 pointer-events-none ${
          isHovered ? 'border-white/20' : ''
        }`} />
      </div>
    </div>
  );
});

// Section d'histoire
const StorySection = memo(function StorySection({ story, index, isActive }) {
  const sectionRef = useRef(null);
  const { ref: textRef, revealed: textRevealed } = useRevealOnScroll(1, { threshold: 0.15 });

  return (
    <div
      ref={sectionRef}
      className={`relative flex min-h-screen flex-col justify-center py-20 md:py-24 transition-all duration-1000 ${
        isActive ? 'opacity-100 scale-100' : 'opacity-50 scale-[0.97]'
      }`}
    >
      {/* Fond sombre avec vert sauge */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-sage/5 blur-3xl transition-all duration-1000 ${
          isActive ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`} />
        <div className={`absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-charcoal/20 blur-3xl transition-all duration-1000 delay-200 ${
          isActive ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-sage/5 blur-3xl transition-all duration-1000 delay-300 ${
          isActive ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`} />
      </div>

      <div className="relative mx-auto w-full max-w-[1700px] px-6 md:px-12 xl:px-20">
        {/* En-tête */}
        <div
          ref={textRef}
          className={`mb-12 md:mb-16 transition-all duration-700 ease-out ${
            textRevealed[0] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="flex items-center gap-6 mb-4">
            <span className={`font-mono text-sm text-sage/60 transition-all duration-500 ${
              textRevealed[0] ? 'opacity-100' : 'opacity-0'
            }`}>{String(index + 1).padStart(2, '0')}</span>
            <div className={`h-px bg-sage/20 transition-all duration-1000 ease-out origin-left ${
              textRevealed[0] ? 'flex-1 opacity-100' : 'flex-1 scale-x-0 opacity-0'
            }`} />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/30">
              {story.title.split(' ')[0]}
            </span>
          </div>

          <h3 className="font-display text-4xl italic text-white md:text-6xl lg:text-7xl xl:text-8xl drop-shadow-lg">
            <RevealWords text={story.title} revealed={textRevealed[0]} />
          </h3>

          <div className="mt-4 flex items-center gap-4">
            <span className="font-mono text-sm uppercase tracking-[0.2em] text-sage/50">
              {story.subtitle}
            </span>
            <div className={`h-px bg-sage/20 transition-all duration-1000 ease-out delay-200 origin-left ${
              textRevealed[0] ? 'flex-1 opacity-100' : 'flex-1 scale-x-0 opacity-0'
            }`} />
          </div>
        </div>

        {/* Grille d'images */}
        <div className={`grid grid-cols-1 gap-5 md:grid-cols-6 md:gap-6 md:[grid-auto-flow:dense] md:[grid-auto-rows:minmax(9rem,11vh)] transition-all duration-700 ${
          isActive ? 'scale-100' : 'scale-95'
        }`}>
          {story.images.map((image, imgIndex) => (
            <StoryImage
              key={`${image.src}-${index}-${imgIndex}`}
              image={image}
              index={imgIndex}
              isActive={isActive}
              direction={image.dir}
            />
          ))}
        </div>

        {/* Description */}
        <div
          className={`mt-10 max-w-4xl transition-all duration-700 delay-300 ${
            textRevealed[0] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className={`h-px bg-sage/40 mb-6 transition-all duration-700 ease-out origin-left ${
            textRevealed[0] ? 'w-20 scale-x-100' : 'w-20 scale-x-0'
          }`} />
          <p className="font-serif text-lg leading-relaxed text-white/70 md:text-xl">
            {story.description}
          </p>

          {/* Boutons d'action */}
          <div className={`mt-8 flex flex-wrap items-center gap-6 transition-all duration-700 delay-500 ${
            textRevealed[0] ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}>
            <MagneticButton
              strength={14}
              className="group relative overflow-hidden rounded-full px-10 py-3.5 text-sm font-mono text-white shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-sage/20 bg-[#9CAF88] hover:bg-[#7A8B6A] transition-colors duration-300"
            >
              <span className="relative z-10">Explorer les œuvres</span>
              <span className="absolute inset-0 bg-white/10 transition-transform duration-300 scale-x-0 group-hover:scale-x-100 origin-left" />
            </MagneticButton>

            <button className="group flex items-center gap-3 text-sm font-mono text-white/40 transition-all duration-300 hover:text-white/70">
              <span className="relative">
                En savoir plus
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-white/50 transition-all duration-300 group-hover:w-full" />
              </span>
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Composant principal
const GallerySection = () => {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef(null);
  const spotlightRef = useRef(null);
  const sectionRefs = useRef([]);
  const { ref: headerRef, revealed: headerRevealed } = useRevealOnScroll(1);
  const { ref: footerRef, revealed: footerRevealed } = useRevealOnScroll(1, { threshold: 0.4 });

  // Effet parallaxe 3D + halo lumineux qui suit le curseur.
  // Écrit directement en DOM via rAF (aucun setState au mousemove) pour
  // rester fluide même sur une page chargée.
  useEffect(() => {
    let rafId = null;
    let latest = { x: 0, y: 0 };

    const applyFrame = () => {
      const x = (latest.x / window.innerWidth - 0.5) * 15;
      const y = (latest.y / window.innerHeight - 0.5) * 15;
      if (containerRef.current) {
        containerRef.current.style.transform = `perspective(1200px) rotateX(${y * 0.02}deg) rotateY(${x * 0.02}deg)`;
      }
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect && spotlightRef.current) {
        const sx = ((latest.x - rect.left) / rect.width) * 100;
        const sy = ((latest.y - rect.top) / rect.height) * 100;
        spotlightRef.current.style.background = `radial-gradient(600px circle at ${sx}% ${sy}%, rgba(156,175,136,0.08), transparent 70%)`;
      }
      rafId = null;
    };

    const handleMouseMove = (e) => {
      latest = { x: e.clientX, y: e.clientY };
      if (rafId) return;
      rafId = requestAnimationFrame(applyFrame);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Détection de la section active
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setActiveSection(index);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-20% 0px -20% 0px',
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const progress = ((activeSection + 1) / STORIES.length) * 100;

  return (
    <section
      id="expositions"
      ref={containerRef}
      className="relative w-full bg-[#1A1A1A] overflow-hidden"
      style={{
        transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg)',
        transition: 'transform 0.1s ease-out',
        willChange: 'transform',
      }}
    >
      {/* Barre de progression vert sauge */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#9CAF88]/10">
        <div
          className="h-full bg-[#9CAF88] transition-all duration-700 ease-out shadow-[0_0_12px_rgba(156,175,136,0.6)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Halo lumineux ambiant qui suit le curseur */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(600px circle at 50% 50%, rgba(156,175,136,0.08), transparent 70%)',
        }}
      />

      {/* Grain filmique global */}
      <FilmGrain />

      {/* Fond d'ambiance */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
      </div>

      {/* En-tête */}
      <div className="relative px-6 pt-28 md:px-12 md:pt-32 xl:px-20">
        <div
          ref={headerRef}
          className={`relative mx-auto max-w-[1700px] transition-all duration-700 ease-out ${
            headerRevealed[0] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="flex flex-col items-start gap-3 border-b border-[#9CAF88]/10 pb-8">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm text-[#9CAF88]/60">01</span>
              <h2 className="font-display text-5xl italic text-white md:text-7xl drop-shadow-2xl">
                <RevealWords text="L'Expérience" revealed={headerRevealed[0]} />
              </h2>
            </div>
            <p className="font-serif text-base text-white/40 md:text-lg">
              Découvrez comment notre plateforme révolutionne la relation entre photographes et amateurs d'art
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center gap-8 overflow-x-auto pb-3 scrollbar-hide">
            {STORIES.map((story, index) => (
              <button
                key={story.id}
                onClick={() => {
                  sectionRefs.current[index]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }}
                className={`flex items-center gap-3 whitespace-nowrap transition-all duration-300 group ${
                  activeSection === index
                    ? 'text-white'
                    : 'text-white/20 hover:text-white/50'
                }`}
              >
                <div className={`h-px transition-all duration-300 ${
                  activeSection === index ? 'w-8 bg-[#9CAF88]' : 'w-8 bg-white/10 group-hover:bg-white/20'
                }`} />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                  {story.subtitle}
                </span>
                {activeSection === index && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#9CAF88] animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="relative mt-8">
        {STORIES.map((story, index) => (
          <div
            key={story.id}
            ref={(el) => (sectionRefs.current[index] = el)}
            data-index={index}
            className="scroll-mt-28"
          >
            <StorySection
              story={story}
              index={index}
              isActive={activeSection === index}
            />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        ref={footerRef}
        className={`relative border-t border-[#9CAF88]/10 px-6 py-16 md:px-12 transition-all duration-1000 ${
          footerRevealed[0] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#9CAF88]/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-[1700px]">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className={`h-px bg-sage/30 transition-all duration-[1400ms] ease-out ${
              footerRevealed[0] ? 'w-24 opacity-100' : 'w-0 opacity-0'
            }`} />
            <p className="font-serif text-base text-white/20 max-w-2xl">
              Rejoignez une communauté de passionnés et découvrez l'art photographique sous un nouveau jour
            </p>
            <div className="flex items-center gap-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/10">
                <CountUp target={STORIES.length} trigger={footerRevealed[0]} /> chapitres
              </span>
              <span className="h-1 w-1 rounded-full bg-[#9CAF88]/20" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/10">
                <CountUp target={GALLERY_IMAGES.length} trigger={footerRevealed[0]} /> œuvres uniques
              </span>
            </div>

            <MagneticButton
              strength={16}
              className="mt-4 group relative overflow-hidden rounded-full px-12 py-4 text-sm font-mono text-white shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-sage/20 bg-[#9CAF88] hover:bg-[#7A8B6A] transition-colors duration-300"
            >
              <span className="relative z-10">Commencer l'exploration</span>
              <span className="absolute inset-0 bg-white/10 transition-transform duration-500 scale-x-0 group-hover:scale-x-100 origin-left" />
            </MagneticButton>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(25deg); }
          100% { transform: translateX(200%) rotate(25deg); }
        }

        @keyframes floatParticle {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.2;
          }
          25% {
            transform: translate(15px, -25px) scale(1.3);
            opacity: 0.6;
          }
          50% {
            transform: translate(-10px, -40px) scale(0.7);
            opacity: 0.4;
          }
          75% {
            transform: translate(25px, -15px) scale(1.1);
            opacity: 0.7;
          }
        }

        @keyframes kenBurns {
          0% { transform: scale(1.05) translate(0, 0); }
          100% { transform: scale(1.16) translate(-1.5%, -1.5%); }
        }

        @keyframes apertureSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </section>
  );
};

export default GallerySection;