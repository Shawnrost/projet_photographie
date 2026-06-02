import { motion } from 'framer-motion';
import { useState } from 'react';

const Recherche = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("Tous");

  const SUGGESTED_TAGS = ["Tous", "Portraits", "Paysages", "Conceptuel", "Noir & Blanc", "Madagascar"];

  const DUMMY_RESULTS = [
    { id: 1, titre: "Lumière d'Analamanga", categorie: "Paysages", auteur: "Ofélia R.", img: "https://images.unsplash.com/photo-1500622557534-20d135458576?q=80&w=600" },
    { id: 2, titre: "Regard Croisé", categorie: "Portraits", auteur: "Ofélia R.", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600" },
    { id: 3, titre: "Ombres de Tana", categorie: "Noir & Blanc", auteur: "Ofélia R.", img: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=600" },
    { id: 4, titre: "Silhouettes Océanes", categorie: "Conceptuel", auteur: "Studio e.Sary", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600" },
  ];

  // Si rien n'est tapé ET que le tag est "Tous", on n'affiche rien par défaut
  const isSearchActive = searchQuery.trim() !== "" || selectedTag !== "Tous";

  const filteredResults = isSearchActive 
    ? DUMMY_RESULTS.filter(item => {
        const matchesQuery = item.titre.toLowerCase().includes(searchQuery.toLowerCase()) || item.auteur.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = selectedTag === "Tous" || item.categorie === selectedTag;
        return matchesQuery && matchesTag;
      })
    : []; // Tableau vide si aucune recherche n'est initiée

  return (
    <section className="w-screen h-screen bg-[#2d3a30] text-[#2d3a30] font-sans overflow-hidden flex flex-col md:flex-row relative">
      
      {/* 1. PANNEAU DE GAUCHE : RECHERCHE */}
      <div className="w-full md:w-2/5 h-2/5 md:h-full p-6 md:p-12 pt-28 md:pt-36 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 relative z-10">
        <div className="space-y-4 md:space-y-6 my-auto w-full">
          <div className="space-y-1">
            <span className="font-mono text-[8px] tracking-[0.4em] text-[#aec3b0] uppercase italic">Index Numérique</span>
            <h1 className="font-serif italic text-2xl md:text-4xl text-white tracking-wide leading-none">Explorer .</h1>
          </div>

          <div className="relative w-full">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une création..."
              className="w-full bg-white/[0.04] border border-white/10 focus:border-[#aec3b0] text-white rounded-2xl pl-10 pr-4 py-3 text-xs tracking-wide transition-all outline-none placeholder-white/30"
            />
            <svg className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
            </svg>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-[8px] tracking-widest uppercase text-[#aec3b0]/70">Filtres esthétiques</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-[8px] tracking-wider uppercase transition-all duration-300 ${
                    selectedTag === tag 
                      ? 'bg-[#aec3b0] text-[#2d3a30] font-medium shadow-sm' 
                      : 'bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.07]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="hidden md:block font-mono text-[8px] text-white/30 uppercase tracking-[0.2em]">e.Sary Galerie — Moteur d'indexation</p>
      </div>

      {/* 2. PANNEAU DE DROITE : GRILLE DE RÉSULTATS */}
      <div className="w-full md:w-3/5 h-3/5 md:h-full bg-[#f8f9f8] p-6 md:p-12 pt-16 md:pt-24 overflow-y-auto relative z-10 custom-scrollbar">
        <div className="flex justify-between items-baseline border-b border-[#2d3a30]/10 pb-4 mb-6 select-none">
          <h2 className="font-serif text-xl md:text-2xl italic text-[#2d3a30]">
            {!isSearchActive ? "En attente d'exploration" : "Résultats de l'exploration"}
          </h2>
          <span className="font-mono text-[9px] text-[#2d3a30]/50 uppercase tracking-widest">
            {filteredResults.length} {filteredResults.length > 1 ? 'Œuvres' : 'Œuvre'}
          </span>
        </div>

        {!isSearchActive ? (
          /* État initial : Rien n'est écrit ou filtré */
          <div className="h-4/5 flex flex-col items-center justify-center text-center opacity-40">
            <svg className="w-6 h-6 text-[#2d3a30] mb-2 font-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
            </svg>
            <p className="font-serif italic text-sm">Saisissez un mot ou sélectionnez un filtre esthétique.</p>
          </div>
        ) : filteredResults.length > 0 ? (
          /* Résultats trouvés */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-12">
            {filteredResults.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="group relative flex flex-col bg-white border border-[#2d3a30]/5 rounded-2xl overflow-hidden p-2 shadow-sm hover:shadow-md transition-all duration-500"
              >
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#2d3a30]/5 relative">
                  <img src={item.img} alt={item.titre} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-1000 ease-out" />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#2d3a30] font-mono text-[7.5px] font-medium tracking-widest uppercase px-2 py-1 rounded-md">
                    {item.categorie}
                  </span>
                </div>
                <div className="pt-3 pb-1 px-1 flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-base text-[#2d3a30] leading-tight group-hover:text-gold transition-colors duration-300">{item.titre}</h3>
                    <p className="font-sans text-[10px] text-[#2d3a30]/50 tracking-wide mt-0.5">par {item.auteur}</p>
                  </div>
                  <button className="w-8 h-8 rounded-full border border-[#2d3a30]/10 flex items-center justify-center hover:bg-[#2d3a30] hover:text-white transition-all duration-300">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Aucun résultat correspondant aux critères */
          <div className="h-4/5 flex flex-col items-center justify-center text-center">
            <span className="text-2xl text-[#2d3a30]/20 mb-2">⊘</span>
            <p className="font-serif italic text-sm text-[#2d3a30]/60">Aucune archive ne correspond à vos critères.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Recherche;