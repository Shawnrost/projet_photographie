import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';

const FEATURES_DESCRIPTIONS = {
  essai: [
    'Accès Premium complet (1 mois)',
    'Expositions immersives illimitées',
    'Tirages certifiés physiques & numériques',
    'Support dédié 24/7 pour votre lancement'
  ],
  basic: [
    'Galerie publique standard',
    'Gestion de tirages certifiés',
    'Commission standard (10%)',
    'Support par ticket sous 48h'
  ],
  premium: [
    'Expositions immersives illimitées',
    'Tirages certifiés physiques & numériques',
    'Commission réduite (5%)',
    'Accès prioritaire aux ventes privées',
    'Support dédié 24/7'
  ]
};

const EtapeTarifInscription = ({ onSuivant, onBack }) => {
  const [tarifsRaw, setTarifsRaw] = useState([]);
  const [selectedDuree, setSelectedDuree] = useState('1_mois');
  const [fetchLoading, setFetchLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Récupération de la grille tarifaire (GET Public)
  useEffect(() => {
    const fetchTarifs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/abonnements/tarifs/');
        if (response.data && response.data.success) {
          setTarifsRaw(response.data.data);
        } else {
          setError("Impossible de décoder la grille tarifaire.");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des tarifs :", err);
        setError("Impossible de charger les offres tarifaires.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchTarifs();
  }, []);

  // 2. Gestion de la souscription (POST Protégé)
  const handleSouscription = async (planType, dureeSelectionnee) => {
    setSubmitLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token'); // Récupération de ton JWT
      
      const response = await axios.post(
        'http://localhost:8000/api/abonnements/souscrire/',
        {
          type: planType,       // "basic" ou "premium"
          duree: dureeSelectionnee // "1_mois", "3_mois" ou "6_mois"
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.success) {
        // Succès : On passe à l'étape suivante du formulaire (ou redirection dashboard)
        if (onSuivant) onSuivant(response.data.data);
      }
    } catch (err) {
      console.error("Erreur lors de la souscription :", err);
      const messageErreur = err.response?.data?.errors?.type?.[0] 
        || err.response?.data?.message 
        || "Une erreur est survenue lors de la validation de votre formule.";
      setError(messageErreur);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="text-center space-y-4 py-20">
        <div className="w-6 h-6 border-2 border-[#c5a358] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-[#f5f5f1]/40 font-mono text-[9px] tracking-[0.4em] uppercase italic">
          Interrogation de la Galerie...
        </p>
      </div>
    );
  }

  // Filtrer les formules payantes issues de ton PlanTarif Django
  const plansAffiches = tarifsRaw.filter(t => t.duree === selectedDuree);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 1.02 }} 
      className="w-full flex flex-col justify-center items-center gap-10"
    >
      <div className="text-center space-y-3">
        <p className="text-[#c5a358] font-mono text-[9px] tracking-[0.5em] uppercase italic">
          Sélection de maintenance de compte
        </p>
        <h3 className="text-[#f5f5f1] font-serif italic text-4xl font-light tracking-tight">
          Choisissez votre envergure artistique
        </h3>
        {error && (
          <p className="text-red-400 font-mono text-[10px] tracking-widest uppercase mt-2">
            ⚠️ {error}
          </p>
        )}
      </div>

      {/* Sélecteur de Durée */}
      <div className="flex bg-[#f5f5f1]/[0.02] border border-[#f5f5f1]/10 p-1.5 rounded-full gap-2">
        {[
          { id: '1_mois', label: '1 MOIS' },
          { id: '3_mois', label: '3 MOIS' },
          { id: '6_mois', label: '6 MOIS' }
        ].map((duree) => (
          <button
            key={duree.id}
            onClick={() => setSelectedDuree(duree.id)}
            disabled={submitLoading}
            className={`px-6 py-2 rounded-full text-[9px] font-mono tracking-widest transition-all duration-300 ${
              selectedDuree === duree.id
                ? 'bg-[#c5a358] text-[#1a1a1a] shadow-lg font-bold'
                : 'text-[#f5f5f1]/40 hover:text-[#f5f5f1] disabled:opacity-30'
            }`}
          >
            {duree.label}
          </button>
        ))}
      </div>

      {/* Grille des cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-4">
        
        {/* ================= CARD 1 : ESSAI GRATUIT ================= */}
        <div className="relative rounded-[32px] p-8 md:p-10 backdrop-blur-[60px] border border-[#f5f5f1]/20 bg-[#f5f5f1]/[0.04] transition-all duration-500 flex flex-col justify-between group h-[495px] shadow-2xl hover:border-[#f5f5f1]/50">
          <span className="absolute top-6 right-8 text-[#f5f5f1]/60 border border-[#f5f5f1]/20 font-mono text-[7px] tracking-[0.3em] uppercase py-1 px-3 rounded-full italic bg-[#1a1a1a]">
            Offre de bienvenue
          </span>

          <div>
            <p className="font-serif italic text-2xl font-light text-[#f5f5f1]">
              Essai Premium
            </p>
            
            <div className="mt-4 flex items-baseline text-[#f5f5f1]">
              <span className="text-4xl font-serif font-light italic">0.00€</span>
              <span className="text-[#f5f5f1]/30 text-[9px] tracking-widest uppercase ml-2 font-mono">/ 1 mois unique</span>
            </div>

            <p className="text-[#f5f5f1]/50 text-[11px] font-light leading-relaxed tracking-wide mt-4">
              Testez l'intégralité de l'expérience e.Sary Studio Premium. <strong className="text-[#c5a358] font-normal">Valable strictement pendant 30 jours</strong>, sans engagement, pour propulser votre art.
            </p>

            <div className="h-[1px] bg-[#f5f5f1]/10 my-6" />

            <ul className="space-y-3">
              {FEATURES_DESCRIPTIONS.essai.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="text-xs text-[#f5f5f1]/40">✓</span>
                  <span className="text-[#f5f5f1]/70 text-[10px] tracking-wide font-light uppercase">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => handleSouscription('premium', '1_mois')}
            disabled={submitLoading}
            className="w-full py-4 rounded-[20px] font-serif italic text-base transition-all duration-300 flex justify-between px-8 items-center disabled:opacity-50 mt-8 bg-[#f5f5f1]/10 text-[#f5f5f1] border border-[#f5f5f1]/10 hover:bg-[#f5f5f1] hover:text-[#1a1a1a]"
          >
            <span className="tracking-wide">
              {submitLoading ? "Traitement..." : "Lancer mon essai gratuit"}
            </span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* ================= CARDS DYNAMIQUES (Django PlanTarif) ================= */}
        {plansAffiches.map((item) => {
          const isPremium = item.plan === 'premium';
          const features = FEATURES_DESCRIPTIONS[item.plan] || [];

          return (
            <div 
              key={`${item.plan}-${item.duree}`}
              className={`relative rounded-[32px] p-8 md:p-10 backdrop-blur-[60px] border transition-all duration-500 flex flex-col justify-between group h-[495px] shadow-2xl ${
                isPremium 
                  ? 'bg-[#c5a358]/[0.06] border-[#c5a358]/40 hover:border-[#c5a358]' 
                  : 'bg-[#f5f5f1]/[0.02] border-[#f5f5f1]/10 hover:border-[#f5f5f1]/30'
              }`}
            >
              {isPremium && (
                <span className="absolute top-6 right-8 text-[#c5a358] border border-[#c5a358]/30 font-mono text-[7px] tracking-[0.3em] uppercase py-1 px-3 rounded-full italic bg-[#1a1a1a]">
                  Recommandé
                </span>
              )}

              <div>
                <p className={`font-serif italic text-2xl font-light ${isPremium ? 'text-[#c5a358]' : 'text-[#f5f5f1]'}`}>
                  {item.plan === 'premium' ? 'Premium Studio' : 'Basic Galerie'}
                </p>
                
                <div className="mt-4 flex items-baseline text-[#f5f5f1]">
                  <span className="text-4xl font-serif font-light italic">{item.prix} Ar</span>
                  <span className="text-[#f5f5f1]/30 text-[9px] tracking-widest uppercase ml-2 font-mono">
                    / {item.duree.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-[#f5f5f1]/50 text-[11px] font-light leading-relaxed tracking-wide mt-4">
                  {isPremium 
                    ? "L'infrastructure complète dédiée aux artistes installés et exigeants." 
                    : "Pour les photographes indépendants cherchant une vitrine d'exception."
                  }
                </p>

                <div className="h-[1px] bg-[#f5f5f1]/10 my-6" />

                <ul className="space-y-3">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className={`text-xs ${isPremium ? 'text-[#c5a358]' : 'text-[#f5f5f1]/40'}`}>✓</span>
                      <span className="text-[#f5f5f1]/70 text-[10px] tracking-wide font-light uppercase">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSouscription(item.plan, item.duree)}
                disabled={submitLoading}
                className={`w-full py-4 rounded-[20px] font-serif italic text-base transition-all duration-300 flex justify-between px-8 items-center disabled:opacity-50 mt-8 ${
                  isPremium
                    ? 'bg-[#c5a358] text-[#1a1a1a] hover:bg-[#f5f5f1]'
                    : 'bg-[#f5f5f1]/10 text-[#f5f5f1] border border-[#f5f5f1]/10 hover:bg-[#f5f5f1] hover:text-[#1a1a1a]'
                }`}
              >
                <span className="tracking-wide">
                  {submitLoading ? "Traitement..." : "Développer mon studio"}
                </span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          );
        })}
      </div>

      <button 
        onClick={onBack} 
        disabled={submitLoading}
        className="text-[#f5f5f1]/20 text-[9px] uppercase tracking-[0.5em] hover:text-[#c5a358] transition-all disabled:opacity-30 font-light"
      >
        Retour à la sécurité
      </button>
    </motion.div>
  );
};

export default EtapeTarifInscription;