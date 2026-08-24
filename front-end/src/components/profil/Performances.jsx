const PerformancesTab = () => {
  return (
    <div className="bg-white border border-[#2d3a30]/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h3 className="font-serif italic text-xl">Statistiques de l'Atelier</h3>
      <p className="font-sans text-sm text-[#2d3a30]/60 max-w-xs">
        Les données d'audience et d'engagement de vos séries seront disponibles après vos premières expositions publiques.
      </p>
    </div>
  );
};

export default PerformancesTab;