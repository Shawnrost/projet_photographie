import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToggleDuree from './ToggleDuree';
import CarteFormule from './CarteFormule';
import CarteAbonnementActif from './CarteAbonnementActif';
import PanneauDetailFormule from './PanneauDetailFormule';
import HistoriqueAbonnements from './HistoriqueAbonnements';
import ModalAnnulationAbonnement from './ModalAnnulationAbonnement';
import {
  getTarifs,
  getStatutAbonnement,
  getHistoriqueAbonnements,
  souscrireAbonnement,
  annulerAbonnement,
} from '../../../services/abonnementService';

const EASE = [0.16, 1, 0.3, 1];
const SPRING = { type: 'spring', stiffness: 300, damping: 30, mass: 0.9 };

const THEME = {
  bg: '#2d3a30',
  bgCard: '#38483c',
  bgDeep: '#1f2922',
  accentSage: '#aec3b0',
  ivory: '#f8f9f8',
  gold: '#c9a96e',
};

const triggerNotification = (message, type = 'success', details = '') => {
  window.dispatchEvent(new CustomEvent('trigger-island-notification', {
    detail: { message, type, details },
  }));
};

const AbonnementClient = () => {
  const [tarifs, setTarifs] = useState([]);
  const [statut, setStatut] = useState(null);
  const [historique, setHistorique] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [chargementAction, setChargementAction] = useState(false);
  const [dureeActive, setDureeActive] = useState('1_mois');
  const [planSelectionne, setPlanSelectionne] = useState(null);
  const [vue, setVue] = useState('browse'); // 'browse' | 'detail' | 'historique'
  const [estAuthentifie, setEstAuthentifie] = useState(false);
  const [estAdmin, setEstAdmin] = useState(false);
  const [modalAnnulationOuvert, setModalAnnulationOuvert] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userProfile = localStorage.getItem('user_profile');
    if (token) {
      setEstAuthentifie(true);
      if (userProfile) {
        try {
          const user = JSON.parse(userProfile);
          setEstAdmin(user.role === 'admin' || user.is_superuser === true);
        } catch (_) {}
      }
    }
  }, []);

  useEffect(() => {
    const charger = async () => {
      setChargement(true);
      try {
        const tarifsRes = await getTarifs();
        if (tarifsRes.success) setTarifs(tarifsRes.data);

        if (estAuthentifie && !estAdmin) {
          try {
            const statutRes = await getStatutAbonnement();
            if (statutRes.success) setStatut(statutRes.data);
          } catch (_) {}

          try {
            const histRes = await getHistoriqueAbonnements();
            if (histRes.success) setHistorique(histRes.data);
          } catch (_) {}
        }
      } catch (err) {
        triggerNotification('Erreur lors du chargement des formules', 'error', err.message);
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, [estAuthentifie, estAdmin]);

  const tarifPourPlanEtDuree = (plan, duree) =>
    tarifs.find((t) => t.plan === plan && t.duree === duree);

  const planActuel = statut?.abonnement?.plan_tarif?.plan || statut?.abonnement?.type;

  const handleSelectionnerCarte = (plan) => {
    setPlanSelectionne(plan);
    setVue('detail');
  };

  const handleRetourBrowse = () => {
    setVue('browse');
  };

  const handleSouscrire = async () => {
    if (!estAuthentifie) {
      triggerNotification('Veuillez vous connecter pour souscrire', 'error');
      return;
    }
    if (estAdmin) {
      triggerNotification('Les administrateurs ne peuvent pas souscrire', 'error');
      return;
    }
    setChargementAction(true);
    try {
      const res = await souscrireAbonnement(planSelectionne, dureeActive);
      if (res.success) {
        triggerNotification('Abonnement activé avec succès !', 'success', `Formule ${planSelectionne}`);
        setStatut({ a_abonnement_actif: true, abonnement: res.data });
        const histRes = await getHistoriqueAbonnements();
        if (histRes.success) setHistorique(histRes.data);
        setVue('browse');
        setPlanSelectionne(null);
      }
    } catch (err) {
      triggerNotification('Erreur lors de la souscription', 'error', err.message);
    } finally {
      setChargementAction(false);
    }
  };

  const handleConfirmerAnnulation = async () => {
    if (!statut?.abonnement?.id) return;
    setChargementAction(true);
    try {
      const res = await annulerAbonnement(statut.abonnement.id);
      if (res.success) {
        triggerNotification('Abonnement annulé', 'success');
        setStatut({ a_abonnement_actif: false, abonnement: null });
        const histRes = await getHistoriqueAbonnements();
        if (histRes.success) setHistorique(histRes.data);
      }
    } catch (err) {
      triggerNotification('Erreur lors de l\'annulation', 'error', err.message);
    } finally {
      setChargementAction(false);
      setModalAnnulationOuvert(false);
    }
  };

  if (chargement) {
    return (
      <div
        style={{ backgroundColor: THEME.bg }}
        className="flex min-h-screen w-full flex-col items-center justify-center px-4"
      >
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          style={{ color: THEME.gold }}
          className="mb-6 font-serif text-4xl italic"
        >
          e<span style={{ color: THEME.accentSage }}>.</span>Sary
        </motion.div>
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#c9a96e]" />
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.4em] text-white/30 text-center">
          Chargement des formules...
        </p>
      </div>
    );
  }

  return (
    <section
      style={{ backgroundColor: THEME.bg }}
      className="relative h-screen w-screen overflow-hidden overflow-y-auto font-sans"
    >
      <AnimatePresence mode="wait">

        {/* ─────────────────────────────── VUE 1 : BROWSE (plein écran vert) ─────────────────────────────── */}
        {vue === 'browse' && (
          <motion.div
            key="browse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="flex h-full w-full flex-col items-center justify-center overflow-y-auto px-4 py-12 sm:px-6 sm:py-16"
          >
            {/* Lien historique */}
            {estAuthentifie && !estAdmin && (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setVue('historique')}
                className="absolute right-4 top-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.2em] text-white/50 backdrop-blur-sm transition-colors duration-300 hover:border-white/20 hover:text-white/80 sm:right-8 sm:top-8 sm:px-4 sm:text-[9px]"
              >
                Historique
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </motion.button>
            )}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-3 text-center px-2"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.35em]" style={{ color: THEME.gold }}>
                Mon compte
              </p>
              <h1 className="mt-3 font-serif text-3xl italic text-white sm:text-4xl md:text-5xl">
                Choisissez votre formule
              </h1>
              <p className="mx-auto mt-3 max-w-md font-sans text-sm font-light text-white/40">
                Débloquez tout le potentiel de votre profil artiste.
              </p>
            </motion.div>

            {statut?.a_abonnement_actif && (
              <div className="mt-8 w-full max-w-xl px-2">
                <CarteAbonnementActif
                  abonnement={statut.abonnement}
                  onDemanderAnnulation={() => setModalAnnulationOuvert(true)}
                />
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
              className="mt-8"
            >
              <ToggleDuree dureeActive={dureeActive} onChange={setDureeActive} variant="dark" />
            </motion.div>

            <div className="mt-8 flex w-full max-w-xl flex-wrap justify-center gap-4 px-2 sm:gap-6">
              {['basic', 'premium'].map((plan, i) => (
                <CarteFormule
                  key={plan}
                  plan={plan}
                  index={i}
                  tarif={tarifPourPlanEtDuree(plan, dureeActive)}
                  estActuel={statut?.a_abonnement_actif && planActuel === plan}
                  onClick={() => handleSelectionnerCarte(plan)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ─────────────────────────────── VUE 2 : DETAIL (moitié vert / moitié blanc) ─────────────────────────────── */}
        {vue === 'detail' && (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="flex h-full w-full flex-col overflow-y-auto md:flex-row md:overflow-hidden"
          >
            {/* Panneau vert (gauche) */}
            <motion.div
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ ...SPRING, delay: 0.05 }}
              style={{ backgroundColor: THEME.bg }}
              className="flex w-full flex-shrink-0 flex-col justify-center px-6 py-10 sm:px-8 md:w-[38%] md:px-12"
            >
              <motion.button
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleRetourBrowse}
                className="mb-10 flex w-fit items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 transition-colors duration-300 hover:text-white/80"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Retour aux formules
              </motion.button>

              <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: THEME.gold }}>
                Votre sélection
              </p>
              <h2 className="mt-3 font-serif text-3xl italic text-white break-words md:text-4xl">
                Formule {planSelectionne === 'premium' ? 'Premium' : 'Basic'}
              </h2>
              <p className="mt-3 font-sans text-sm font-light text-white/40">
                Ajustez la durée et confirmez votre choix dans le panneau ci-contre.
              </p>

              <div className="mt-10 flex flex-col gap-3">
                {['basic', 'premium'].map((plan) => {
                  const tarif = tarifPourPlanEtDuree(plan, dureeActive);
                  const isActive = plan === planSelectionne;
                  return (
                    <motion.button
                      key={plan}
                      onClick={() => setPlanSelectionne(plan)}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center justify-between gap-3 rounded-2xl border px-5 py-3.5 transition-colors duration-300"
                      style={{
                        borderColor: isActive ? 'rgba(201,169,110,0.4)' : 'rgba(255,255,255,0.08)',
                        backgroundColor: isActive ? 'rgba(201,169,110,0.08)' : 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <span
                        className="font-sans text-sm"
                        style={{ color: isActive ? '#f8f9f8' : 'rgba(255,255,255,0.4)' }}
                      >
                        {plan === 'premium' ? 'Premium' : 'Basic'}
                      </span>
                      <span
                        className="font-mono text-xs whitespace-nowrap"
                        style={{ color: isActive ? THEME.gold : 'rgba(255,255,255,0.3)' }}
                      >
                        {tarif ? `${tarif.prix} Ar` : '—'}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Panneau blanc (droite) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
              style={{ backgroundColor: THEME.ivory }}
              className="flex w-full flex-1 items-center justify-center overflow-y-auto px-6 py-14 md:px-12"
            >
              <PanneauDetailFormule
                plan={planSelectionne}
                tarif={tarifPourPlanEtDuree(planSelectionne, dureeActive)}
                dureeActive={dureeActive}
                onChangerDuree={setDureeActive}
                estActuel={statut?.a_abonnement_actif && planActuel === planSelectionne}
                estAdmin={estAdmin}
                estAuthentifie={estAuthentifie}
                chargementAction={chargementAction}
                onSoumettre={handleSouscrire}
              />
            </motion.div>
          </motion.div>
        )}

        {/* ─────────────────────────────── VUE 3 : HISTORIQUE (plein écran blanc) ─────────────────────────────── */}
        {vue === 'historique' && (
          <motion.div
            key="historique"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{ backgroundColor: THEME.ivory }}
            className="flex h-full w-full flex-col items-center overflow-y-auto px-4 py-14 sm:px-6 md:px-12"
          >
            <div className="w-full max-w-2xl">
              <motion.button
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleRetourBrowse}
                className="mb-8 flex w-fit items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal/40 transition-colors duration-300 hover:text-charcoal/70"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Retour aux formules
              </motion.button>

              <h2 className="mb-8 font-serif text-3xl italic text-charcoal">
                Historique des abonnements
              </h2>

              <HistoriqueAbonnements historique={historique} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ModalAnnulationAbonnement
        estOuvert={modalAnnulationOuvert}
        onFermer={() => setModalAnnulationOuvert(false)}
        onConfirmer={handleConfirmerAnnulation}
        chargement={chargementAction}
      />
    </section>
  );
};

export default AbonnementClient;