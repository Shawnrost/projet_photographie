const PanneauRecherche = ({ searchQuery, setSearchQuery, selectedTag, setSelectedTag, tags }) => {
  
  const TYPES_FILTRES = [
    { id: "Tous", label: "Tous", role: null },
    { id: "photographe", label: "Photographes", role: "photographe" },
    { id: "client", label: "Clients", role: "client" }
  ];

  return (
    <div className="w-full md:w-5/12 h-2/5 md:h-full p-8 md:p-16 pt-32 md:pt-44 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 relative z-10 bg-[#2d3a30]">
      
      <div className="space-y-8 md:space-y-12 my-auto w-full max-w-md mx-auto md:mx-0">
        
        {/* EN-TÊTE TYPOGRAPHIQUE */}
        <div className="space-y-2 select-none">
          <span className="font-mono text-[9px] tracking-[0.5em] text-[#aec3b0] uppercase italic block opacity-80">
            Index Numérique
          </span>
          <h1 className="font-serif italic text-3xl md:text-5xl text-white tracking-wide leading-none font-light">
            Explorer<span className="text-[#aec3b0]">.</span>
          </h1>
        </div>

        {/* BARRE DE RECHERCHE */}
        <div className="relative w-full group">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un photographe, client..."
            className="w-full bg-white/[0.03] border border-white/10 focus:border-[#aec3b0] focus:bg-white/[0.06] text-white rounded-2xl pl-12 pr-5 py-4 text-sm tracking-wide transition-all duration-500 outline-none placeholder-white/25 shadow-inner"
          />
          <svg 
            className="w-5 h-5 text-white/30 absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-500 group-focus-within:text-[#aec3b0]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
          </svg>
          
          {/* Indicateur de recherche minimum */}
          {searchQuery.length > 0 && searchQuery.length < 2 && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#aec3b0]/50 text-[10px] font-mono">
              Min. 2 car.
            </span>
          )}
        </div>

        {/* FILTRES TYPE D'ENTITÉ */}
        <div className="space-y-3">
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#aec3b0]/60 select-none">
            Filtrer par type
          </p>
          <div className="flex flex-wrap gap-2">
            {TYPES_FILTRES.map((type) => {
              const isActive = selectedTag === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedTag(type.id)}
                  className={`px-5 py-2.5 rounded-full font-mono text-[9px] tracking-widest uppercase transition-all duration-500 ease-out border ${
                    isActive 
                      ? 'bg-[#aec3b0] text-[#2d3a30] border-[#aec3b0] font-semibold shadow-[0_10px_25px_rgba(174,195,176,0.15)] scale-105' 
                      : 'bg-white/[0.02] text-white/50 border-white/5 hover:text-white hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Indication de résultats */}
        {searchQuery.trim().length >= 2 && (
          <div className="bg-[#aec3b0]/5 border border-[#aec3b0]/10 rounded-2xl p-4">
            <p className="font-mono text-[10px] text-[#aec3b0]/70 uppercase tracking-wider">
              Recherche en cours
            </p>
            <p className="font-serif italic text-sm text-[#aec3b0]/50 mt-1">
              "{searchQuery}"
            </p>
          </div>
        )}
      </div>

      {/* FOOTER DISCRET */}
      <p className="hidden md:block font-mono text-[9px] text-white/20 uppercase tracking-[0.3em] select-none">
        Gasy Ant'sary Galerie — Moteur d'indexation
      </p>
    </div>
  );
};

export default PanneauRecherche;