import { motion } from 'framer-motion';

const EtapeRole = ({ setRole, setTempRole, onNext }) => {
    
    const handleSelect = (role) => {
        setRole(role);
        setTempRole(null); // On reset le survol lors du clic
        onNext();
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }} 
            className="space-y-4"
        >
            <div className="text-center mb-8">
                <p className="text-[#f5f5f1]/40 text-[9px] tracking-[0.3em] uppercase italic">
                    Définissez votre profil
                </p>
            </div>

            {/* BOUTON COLLECTIONNEUR */}
            <button 
                onMouseEnter={() => setTempRole("client")}
                onMouseLeave={() => setTempRole(null)}
                onClick={() => handleSelect("client")}
                className="w-full p-7 border border-[#f5f5f1]/10 rounded-[28px] text-[#f5f5f1] hover:bg-[#f5f5f1]/5 transition-all group flex justify-between items-center relative overflow-hidden"
            >
                <span className="text-[11px] tracking-[0.3em] uppercase font-serif group-hover:text-[#c5a358] transition-colors">
                    Collectionneur
                </span>
                <div className="flex items-center gap-3">
                    <span className="text-[7px] border border-[#f5f5f1]/20 px-2 py-1 rounded-full opacity-40 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                        Acheter
                    </span>
                    <span className="text-[#c5a358] opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">→</span>
                </div>
            </button>

            {/* BOUTON PHOTOGRAPHE */}
            <button 
                onMouseEnter={() => setTempRole("photographe")}
                onMouseLeave={() => setTempRole(null)}
                onClick={() => handleSelect("photographe")}
                className="w-full p-7 bg-[#c5a358] rounded-[28px] text-[#1a1a1a] shadow-xl hover:bg-[#f5f5f1] transition-all group flex justify-between items-center"
            >
                <span className="text-[11px] tracking-[0.3em] uppercase font-serif font-bold italic">
                    Photographe
                </span>
                <div className="flex items-center gap-3 font-bold">
                    <span className="text-[7px] border border-[#1a1a1a]/20 px-2 py-1 rounded-full uppercase tracking-widest">
                        Exposer
                    </span>
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
            </button>
            
            <p className="text-[8px] text-[#f5f5f1]/20 text-center tracking-[0.2em] uppercase pt-6 leading-loose">
                Le rôle de photographe nécessite une validation <br /> 
                ultérieure par nos curateurs.
            </p>
        </motion.div>
    );
};

export default EtapeRole;