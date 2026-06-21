import { motion } from 'framer-motion';

const BarreFiltres = ({ 
  user, totalPublications, filtreType, setFiltreType, filtreCat, 
  setFiltreCat, categories, onReset, theme 
}) => {

  const TYPES_DISPONIBLES = [
    { id: 'publicite', nom: 'Publicité' },
    { id: 'vente', nom: 'Vente' }
  ];

  // Vérifier si un filtre est actif
  const isFilterActive = filtreCat !== '' || filtreType !== 'publicite';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12"
    >
      {/* Titre et Rôle */}
      <div className="space-y-1.5 flex-shrink-0">
        <p style={{ color: theme.accentSage }} className="text-[10px] tracking-[0.4em] uppercase font-sans font-bold italic">
          {user?.role === 'photographe' ? "Studio d'exposition" : "Collection Privée"}
        </p>
        <h1 className="text-[#f8f9f8] font-serif italic text-4xl md:text-5xl font-light tracking-tight flex items-baseline gap-4">
          Publications
          {filtreType === 'publicite' && (
            <span className="text-[#aec3b0] text-sm font-mono tracking-wider uppercase bg-[#aec3b0]/10 px-3 py-1 rounded-full">
              Publicités
            </span>
          )}
          {filtreType === 'vente' && (
            <span className="text-[#aec3b0] text-sm font-mono tracking-wider uppercase bg-[#aec3b0]/10 px-3 py-1 rounded-full">
              En vente
            </span>
          )}
        </h1>
      </div>

      {/* Zone des Filtres Épurée */}
      <div className="flex flex-col gap-4 w-full xl:max-w-3xl xl:items-end">
        
        {/* Sélection des Types */}
        <div className="flex flex-wrap gap-2">
          {TYPES_DISPONIBLES.map((t) => (
            <button
              key={t.id}
              onClick={() => setFiltreType(t.id)}
              className={`px-5 py-2 rounded-xl font-serif text-sm italic tracking-wide transition-all duration-300 border ${
                filtreType === t.id 
                  ? 'bg-[#aec3b0] text-[#1e2520] font-bold border-[#aec3b0] shadow-sm' 
                  : 'bg-white/[0.04] text-white/80 border-white/10 hover:text-white hover:bg-white/[0.09]'
              }`}
            >
              {t.nom}
            </button>
          ))}
        </div>

        {/* Sélection des Catégories dynamiques */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 xl:justify-end">
            <button
              onClick={() => setFiltreCat('')}
              className={`px-5 py-2 rounded-xl font-serif text-sm italic tracking-wide transition-all duration-300 border ${
                filtreCat === '' 
                  ? 'bg-[#aec3b0] text-[#1e2520] font-bold border-[#aec3b0] shadow-sm' 
                  : 'bg-white/[0.04] text-white/80 border-white/10 hover:text-white hover:bg-white/[0.09]'
              }`}
            >
              Toutes catégories
            </button>
            
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setFiltreCat(c.id)}
                className={`px-5 py-2 rounded-xl font-serif text-sm italic tracking-wide transition-all duration-300 border ${
                  filtreCat === c.id 
                    ? 'bg-[#aec3b0] text-[#1e2520] font-bold border-[#aec3b0] shadow-sm' 
                    : 'bg-white/[0.04] text-white/80 border-white/10 hover:text-white hover:bg-white/[0.09]'
                }`}
              >
                {c.nom}
              </button>
            ))}

            {/* Bouton Reset */}
            {isFilterActive && (
              <button 
                onClick={onReset}
                style={{ borderColor: theme.accentSage, color: theme.accentSage }}
                className="px-5 py-2 rounded-xl font-serif text-sm italic border bg-white/[0.02] hover:bg-white/10 hover:text-white transition-all duration-300"
              >
                ✕ Reset
              </button>
            )}
          </div>
        )}

        {/* Indicateur de filtre actif */}
        {isFilterActive && (
          <p className="text-[#aec3b0]/50 text-[9px] font-mono tracking-wider uppercase">
            {filtreType === 'publicite' ? 'Publicités ' : 'En vente '}
            {filtreCat && `• ${categories.find(c => c.id === filtreCat)?.nom || ''}`}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default BarreFiltres;