import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AchatPopup = ({ pub, onClose, theme }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Confirmation, 2: Paiement, 3: Succès
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [panierInfo, setPanierInfo] = useState(null);
  const [commandeId, setCommandeId] = useState(null);

  // Vérifier si l'utilisateur est connecté et est un client
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/connexion');
      return;
    }
    
    // Vérifier le rôle de l'utilisateur
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'photographe') {
          setError('Les photographes ne peuvent pas acheter leurs propres photos.');
        }
      } catch (e) {}
    }
  }, [navigate]);

  // Étape 1: Ajouter au panier
  const handleAjouterAuPanier = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/connexion');
        return;
      }

      // Ajouter au panier
      const res = await api.post('/commandes/panier/ajouter/', {
        publication_id: pub.id
      });

      if (res.data.success) {
        setPanierInfo(res.data.data);
        setStep(2);
      }
    } catch (err) {
      console.error('Erreur ajout panier:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        setError(errors.join(' '));
      } else {
        setError('Erreur lors de l\'ajout au panier.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Étape 2: Passer la commande et payer
  const handlePayer = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/connexion');
        return;
      }

      // 1. Valider le panier (passer commande)
      const validateRes = await api.post('/commandes/panier/');
      
      if (validateRes.data.success) {
        const commandeId = validateRes.data.data.id;
        setCommandeId(commandeId);

        // 2. Payer la commande
        const payRes = await api.post(`/commandes/${commandeId}/payer/`, {
          confirmation: true
        });

        if (payRes.data.success) {
          setStep(3);
          // Mettre à jour l'état de la publication
          pub.est_vendue = true;
        }
      }
    } catch (err) {
      console.error('Erreur paiement:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        setError(errors.join(' '));
      } else {
        setError('Erreur lors du paiement.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser et fermer
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  // Empêcher la fermeture pendant le chargement
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !loading) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [loading, handleClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleClose}
      className="fixed inset-0 z-50 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: 'rgba(31, 41, 34, 0.85)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        onClick={e => e.stopPropagation()}
        style={{ backgroundColor: theme.bgDeep }}
        className="relative w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Bouton fermeture */}
        <button
          onClick={handleClose}
          disabled={loading}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/20 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-black/40 transition-all text-xs disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ✕
        </button>

        {/* En-tête avec image miniature */}
        <div className="p-6 pb-0">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/20 flex-shrink-0">
              <img 
                src={pub.image_affichee} 
                alt={pub.titre}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-serif italic text-xl font-light truncate">
                {pub.titre}
              </h3>
              <p className="text-white/40 text-xs font-mono tracking-wider truncate">
                {pub.photographe_nom}
              </p>
              <p style={{ color: theme.accentSage }} className="text-lg font-serif italic font-light mt-1">
                {parseFloat(pub.prix).toFixed(2)} €
              </p>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="h-[1px] bg-gradient-to-r from-white/10 via-white/5 to-transparent my-6" />

        {/* Contenu principal */}
        <div className="px-6 pb-6">
          {/* Erreur */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
            >
              {error}
            </motion.div>
          )}

          {/* Étapes */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <p className="text-white/60 text-sm font-light leading-relaxed">
                    Vous êtes sur le point d'acquérir cette œuvre numérique.
                  </p>
                  <ul className="text-white/40 text-xs space-y-1.5 font-mono tracking-wider">
                    <li>✓ Tirage certifié</li>
                    <li>✓ Livraison immédiate (format numérique)</li>
                    <li>✓ Suppression du filigrane après paiement</li>
                  </ul>
                </div>

                <button
                  onClick={handleAjouterAuPanier}
                  disabled={loading}
                  style={{ backgroundColor: theme.accentSage }}
                  className="w-full py-3.5 rounded-xl text-[#2d3a30] text-sm tracking-wider uppercase font-bold hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Ajout en cours...
                    </span>
                  ) : (
                    'Ajouter au panier'
                  )}
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Total à payer</span>
                    <span style={{ color: theme.accentSage }} className="font-serif italic text-xl font-light">
                      {panierInfo?.prix_a_payer || pub.prix} €
                    </span>
                  </div>
                  <div className="mt-2 text-white/30 text-[10px] font-mono tracking-wider">
                    {panierInfo?.nombre_articles || 1} article(s)
                  </div>
                </div>

                <button
                  onClick={handlePayer}
                  disabled={loading}
                  style={{ backgroundColor: theme.accentSage }}
                  className="w-full py-3.5 rounded-xl text-[#2d3a30] text-sm tracking-wider uppercase font-bold hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Paiement en cours...
                    </span>
                  ) : (
                    'Confirmer le paiement'
                  )}
                </button>

                <button
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="w-full text-white/30 text-[10px] tracking-wider uppercase hover:text-white/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Retour
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4"
                >
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h4 className="text-white font-serif italic text-2xl font-light">
                  Acquisition réussie ! 🎉
                </h4>
                <p className="text-white/50 text-sm font-light mt-2">
                  L'œuvre a rejoint votre collection. 
                  Le filigrane a été supprimé.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-6 px-8 py-3 rounded-xl border border-white/20 text-white/60 text-xs tracking-wider uppercase hover:bg-white/5 hover:text-white transition-all"
                >
                  Fermer
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AchatPopup;