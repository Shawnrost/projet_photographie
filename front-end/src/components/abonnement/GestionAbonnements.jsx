// src/components/abonnement/GestionAbonnements.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PanneauCatalogue from './PanneauCatalogue';
import ListeAbonnes from './ListeAbonnes';
import ModalTarif from './ModalTarif';
import ModalConfirmation from './ModalConfirmation';
import { 
  getTarifs, 
  getAdminTarifs,
  getStatutAbonnement, 
  getHistoriqueAbonnements,
  getAbonnesUtilisateur,
  souscrireAbonnement, 
  annulerAbonnement,
  creerTarif,
  modifierTarif,
  supprimerTarif
} from '../../services/abonnementService';

const CONFIG_THEME = {
  bg: '#2d3a30',
  bgCard: '#38483c',
  bgDeep: '#1f2922',
  accentSage: '#aec3b0',
  ivory: '#f8f9f8',
  gold: '#c9a96e'
};

const triggerNotification = (message, type = 'success', details = '') => {
  const event = new CustomEvent('trigger-island-notification', {
    detail: { message, type, details }
  });
  window.dispatchEvent(event);
};

// Données dummy pour fallback
const getDummyAbonnes = () => {
  return [
    { 
      id: 1, 
      nom: "Ando RAKOTOMALALA", 
      typePlan: "Premium", 
      statut: "Actif", 
      email: "ando.rak@gmail.com", 
      dateFin: "12 Déc 2026" 
    },
    { 
      id: 2, 
      nom: "Ofélia RAJAOMAHANDRY", 
      typePlan: "Pro", 
      statut: "Actif", 
      email: "ofelia.raj@gmail.com", 
      dateFin: "05 Juin 2027" 
    },
    { 
      id: 3, 
      nom: "Ny Lahatra R.", 
      typePlan: "Standard", 
      statut: "Actif", 
      email: "rakotolahatra7@gmail.com", 
      dateFin: "18 Fév 2027" 
    },
    { 
      id: 4, 
      nom: "Miora RABEARISOA", 
      typePlan: "Premium", 
      statut: "Expiré", 
      email: "miora.rabearisoa@gmail.com", 
      dateFin: "15 Mars 2026" 
    },
    { 
      id: 5, 
      nom: "Tiana RANDRIANARIVO", 
      typePlan: "Basic", 
      statut: "Actif", 
      email: "tiana.randria@gmail.com", 
      dateFin: "20 Avr 2027" 
    },
  ];
};

const GestionAbonnements = () => {
  const [recherche, setRecherche] = useState("");
  const [chargement, setChargement] = useState(true);
  const [tarifs, setTarifs] = useState([]);
  const [statutAbonnement, setStatutAbonnement] = useState(null);
  const [historique, setHistorique] = useState([]);
  const [abonnes, setAbonnes] = useState([]);
  const [estAuthentifie, setEstAuthentifie] = useState(false);
  const [estAdmin, setEstAdmin] = useState(false);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [tarifEnEdition, setTarifEnEdition] = useState(null);
  const [vueActive, setVueActive] = useState('catalogue');
  const [userId, setUserId] = useState(null);
  
  // État pour le modal de confirmation
  const [confirmationModal, setConfirmationModal] = useState({
    ouvert: false,
    titre: '',
    message: '',
    action: null,
    elementId: null,
    elementNom: ''
  });

  // Récupérer l'utilisateur et les droits
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userProfile = localStorage.getItem('user_profile');
    
    if (token) {
      setEstAuthentifie(true);
      if (userProfile) {
        try {
          const user = JSON.parse(userProfile);
          setEstAdmin(user.role === 'admin' || user.is_superuser === true);
          setUserId(user.id || user.user_id || null);
        } catch (e) {
          console.error('Erreur parsing user_profile:', e);
        }
      }
    }
  }, []);

  // Charger toutes les données
  useEffect(() => {
    const chargerDonnees = async () => {
      setChargement(true);
      
      try {
        // 1. Charger les tarifs
        let tarifsResponse;
        if (estAdmin) {
          tarifsResponse = await getAdminTarifs();
        } else {
          tarifsResponse = await getTarifs();
        }
        
        if (tarifsResponse.success) {
          setTarifs(tarifsResponse.data);
        }

        // 2. Charger le statut d'abonnement (pour les photographes)
        if (estAuthentifie && !estAdmin) {
          try {
            const statutResponse = await getStatutAbonnement();
            if (statutResponse.success) {
              setStatutAbonnement(statutResponse.data);
            }
          } catch (statutErr) {
            console.log('Pas de statut d\'abonnement disponible');
          }

          // 3. Charger l'historique
          try {
            const historiqueResponse = await getHistoriqueAbonnements();
            if (historiqueResponse.success) {
              setHistorique(historiqueResponse.data);
            }
          } catch (histErr) {
            console.log('Pas d\'historique disponible');
          }
        } else {
          setStatutAbonnement(null);
        }

        // 4. Charger la liste des abonnés (followers)
        if (estAuthentifie) {
          try {
            const abonnesResponse = await getAbonnesUtilisateur(userId);
            if (abonnesResponse.success && abonnesResponse.data && abonnesResponse.data.length > 0) {
              // Transformer les données de l'API en format compatible avec CarteAbonne
              const abonnesFormatted = abonnesResponse.data.map((user, index) => ({
                id: user.id || index + 1,
                nom: user.prenom && user.nom ? `${user.prenom} ${user.nom}` : user.username || `Utilisateur ${index + 1}`,
                username: user.username,
                email: user.email || 'Email non disponible',
                typePlan: user.abonnement_actif?.type || user.type_plan || 'Standard',
                statut: user.abonnement_actif?.status || user.statut || 'Actif',
                dateFin: user.abonnement_actif?.date_fin || user.date_fin || 'N/A',
                plan: user.abonnement_actif?.type || user.plan || 'Standard',
                status: user.abonnement_actif?.status || user.status || 'active',
                date_fin: user.abonnement_actif?.date_fin || user.date_fin || null,
                avatar: user.avatar || null,
                // Conserver les données brutes pour référence
                _raw: user
              }));
              setAbonnes(abonnesFormatted);
            } else {
              // Pas d'abonnés trouvés ou erreur, utiliser des données dummy
              console.log('Aucun abonné trouvé via API, utilisation des données dummy');
              setAbonnes(getDummyAbonnes());
            }
          } catch (err) {
            console.warn('Erreur lors du chargement des abonnés:', err);
            // En cas d'erreur, utiliser des données dummy
            setAbonnes(getDummyAbonnes());
          }
        } else {
          // Utilisateur non authentifié, données dummy
          setAbonnes(getDummyAbonnes());
        }
      } catch (err) {
        triggerNotification('Erreur lors du chargement des données', 'error', err.message);
        console.error('Erreur chargement:', err);
        // En cas d'erreur globale, utiliser des données dummy
        setAbonnes(getDummyAbonnes());
      } finally {
        setChargement(false);
      }
    };

    chargerDonnees();
  }, [estAuthentifie, estAdmin, userId]);

  // Recharger les tarifs
  const rechargerTarifs = async () => {
    try {
      let tarifsResponse;
      if (estAdmin) {
        tarifsResponse = await getAdminTarifs();
      } else {
        tarifsResponse = await getTarifs();
      }
      if (tarifsResponse.success) {
        setTarifs(tarifsResponse.data);
      }
    } catch (err) {
      console.error('Erreur rechargement tarifs:', err);
    }
  };

  // Souscrire à un abonnement
  const handleSouscrire = async (type, duree) => {
    if (estAdmin) {
      triggerNotification('Les admins ne peuvent pas souscrire à des abonnements', 'error');
      return;
    }

    if (!estAuthentifie) {
      triggerNotification('Veuillez vous connecter pour souscrire à un abonnement', 'error');
      return;
    }
    
    try {
      const response = await souscrireAbonnement(type, duree);
      if (response.success) {
        triggerNotification('Abonnement souscrit avec succès !', 'success', `Plan ${type} - ${duree}`);
        setStatutAbonnement(response.data);
        await rechargerTarifs();
      }
    } catch (err) {
      triggerNotification('Erreur lors de la souscription', 'error', err.message);
    }
  };

  // Annuler un abonnement
  const handleAnnuler = async (abonnementId) => {
    if (estAdmin) {
      triggerNotification('Les admins ne peuvent pas annuler des abonnements', 'error');
      return;
    }

    if (!estAuthentifie) {
      triggerNotification('Veuillez vous connecter pour annuler un abonnement', 'error');
      return;
    }

    setConfirmationModal({
      ouvert: true,
      titre: 'Annuler votre abonnement ?',
      message: 'Cette action est irréversible. Vous perdrez tous les avantages de votre abonnement.',
      action: async () => {
        try {
          const response = await annulerAbonnement(abonnementId);
          if (response.success) {
            triggerNotification('Abonnement annulé avec succès', 'success');
            try {
              const statutResponse = await getStatutAbonnement();
              if (statutResponse.success) {
                setStatutAbonnement(statutResponse.data);
              }
            } catch (statutErr) {
              console.log('Pas de statut disponible');
            }
            await rechargerTarifs();
          }
        } catch (err) {
          triggerNotification('Erreur lors de l\'annulation', 'error', err.message);
        }
        setConfirmationModal({ ...confirmationModal, ouvert: false });
      }
    });
  };

  // Créer un tarif (admin)
  const handleCreerTarif = async (tarifData) => {
    if (!estAdmin) {
      triggerNotification('Accès non autorisé - réservé aux admins', 'error');
      return;
    }

    try {
      const response = await creerTarif(tarifData);
      if (response.success) {
        triggerNotification('Tarif créé avec succès !', 'success', `${tarifData.plan} - ${tarifData.duree}`);
        await rechargerTarifs();
        setModalOuvert(false);
      }
    } catch (err) {
      if (err.message.includes('unique set') || err.message.includes('existe déjà')) {
        triggerNotification(
          `La combinaison "${tarifData.plan} + ${tarifData.duree}" existe déjà`,
          'error',
          'Choisissez une autre combinaison'
        );
      } else {
        triggerNotification('Erreur lors de la création du tarif', 'error', err.message);
      }
    }
  };

  // Modifier un tarif (admin)
  const handleModifierTarif = async (tarifId, tarifData) => {
    if (!estAdmin) {
      triggerNotification('Accès non autorisé - réservé aux admins', 'error');
      return;
    }

    try {
      const response = await modifierTarif(tarifId, tarifData);
      if (response.success) {
        triggerNotification('Tarif modifié avec succès !', 'success', `${tarifData.plan} - ${tarifData.duree}`);
        await rechargerTarifs();
        setModalOuvert(false);
        setTarifEnEdition(null);
      }
    } catch (err) {
      if (err.message.includes('unique set') || err.message.includes('existe déjà')) {
        triggerNotification(
          `La combinaison "${tarifData.plan} + ${tarifData.duree}" existe déjà`,
          'error',
          'Choisissez une autre combinaison'
        );
      } else {
        triggerNotification('Erreur lors de la modification du tarif', 'error', err.message);
      }
    }
  };

  // Supprimer un tarif (admin)
  const handleSupprimerTarif = (tarifId, tarifNom) => {
    setConfirmationModal({
      ouvert: true,
      titre: 'Supprimer ce tarif ?',
      message: `Êtes-vous sûr de vouloir supprimer le tarif "${tarifNom}" ? Cette action est irréversible.`,
      action: async () => {
        try {
          const response = await supprimerTarif(tarifId);
          if (response.success) {
            triggerNotification('Tarif supprimé avec succès !', 'success');
            await rechargerTarifs();
          }
        } catch (err) {
          if (err.message.includes('abonnement(s) actif(s)')) {
            triggerNotification(
              'Impossible de supprimer ce tarif',
              'error',
              'Des abonnements actifs l\'utilisent. Désactivez-le plutôt.'
            );
          } else {
            triggerNotification('Erreur lors de la suppression du tarif', 'error', err.message);
          }
        }
        setConfirmationModal({ ...confirmationModal, ouvert: false });
      }
    });
  };

  // Ouvrir modal de modification
  const ouvrirModalModification = (tarif) => {
    setTarifEnEdition(tarif);
    setModalOuvert(true);
  };

  // Ouvrir modal de création
  const ouvrirModalCreation = () => {
    setTarifEnEdition(null);
    setModalOuvert(true);
  };

  // Filtrer les abonnés par recherche
  const rechercheActive = recherche.trim() !== "";
  const abonnesFiltres = rechercheActive
    ? abonnes.filter(item => 
        item.nom?.toLowerCase().includes(recherche.toLowerCase()) || 
        item.email?.toLowerCase().includes(recherche.toLowerCase())
      )
    : abonnes;

  // Écran de chargement
  if (chargement) {
    return (
      <div style={{ backgroundColor: CONFIG_THEME.bg }}
        className="min-h-screen flex flex-col items-center justify-center"
      >
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          style={{ color: CONFIG_THEME.gold }}
          className="text-4xl mb-6 font-serif italic"
        >
          e<span style={{ color: CONFIG_THEME.accentSage }}>.</span>Sary
        </motion.div>
        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-[#aec3b0] animate-spin" />
        <p className="mt-6 text-white/30 text-[10px] font-mono tracking-[0.4em] uppercase">
          Chargement de la console...
        </p>
      </div>
    );
  }

  return (
    <div 
      style={{ backgroundColor: CONFIG_THEME.bg }} 
      className="min-h-screen w-full font-sans text-[#f8f9f8] selection:bg-[#aec3b0]/20 selection:text-white overflow-y-auto"
    >
      <main className="pt-28 sm:pt-32 pb-8 px-4 sm:px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto min-h-screen">
        
        {/* En-tête artistique */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6 md:mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-[#aec3b0] to-transparent rounded-full flex-shrink-0" />
                <h1 className="font-serif italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white tracking-wide leading-[1.1]">
                  Console <span style={{ color: CONFIG_THEME.gold }}>d'Abonnement</span>
                </h1>
              </div>
              <p className="text-white/30 text-[9px] sm:text-[10px] md:text-[11px] font-mono tracking-[0.25em] sm:tracking-[0.3em] uppercase pl-4">
                Gestion des formules et des abonnés
              </p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {estAdmin && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/20 text-emerald-300 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[6px] sm:text-[8px] font-mono uppercase tracking-widest border border-emerald-500/30 flex items-center gap-1.5 sm:gap-2"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Admin
                </motion.span>
              )}
              
              <div className="flex bg-white/5 rounded-2xl p-1 backdrop-blur-sm border border-white/5">
                {['catalogue', 'abonnes'].map((vue) => (
                  <button
                    key={vue}
                    onClick={() => setVueActive(vue)}
                    className={`px-2.5 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-xl text-[7px] sm:text-[8px] md:text-[9px] font-mono uppercase tracking-wider transition-all duration-500 ${
                      vueActive === vue
                        ? 'bg-[#aec3b0] text-[#1f2922] shadow-lg shadow-[#aec3b0]/20'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                    }`}
                  >
                    {vue === 'catalogue' ? '📋 Catalogue' : '👥 Abonnés'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-[-8px] left-0 right-0 h-[1px] bg-gradient-to-r from-[#aec3b0]/40 via-[#aec3b0]/10 to-transparent origin-left"
          />
        </motion.div>

        {/* Contenu principal */}
        <div className="mt-6 md:mt-8">
          <AnimatePresence mode="wait">
            {vueActive === 'catalogue' ? (
              <motion.div
                key="catalogue"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                <PanneauCatalogue 
                  tarifs={tarifs}
                  chargement={chargement}
                  recherche={recherche}
                  onChangementRecherche={setRecherche}
                  statutAbonnement={statutAbonnement}
                  onSouscrire={handleSouscrire}
                  onAnnuler={handleAnnuler}
                  onModifierTarif={ouvrirModalModification}
                  onSupprimerTarif={handleSupprimerTarif}
                  onAjouterTarif={ouvrirModalCreation}
                  estAuthentifie={estAuthentifie}
                  estAdmin={estAdmin}
                  theme={CONFIG_THEME}
                />
              </motion.div>
            ) : (
              <motion.div
                key="abonnes"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full bg-white/5 backdrop-blur-xl rounded-3xl border border-white/5 p-4 sm:p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3 md:pb-4 mb-4 md:mb-6">
                  <div>
                    <h2 className="font-serif text-lg sm:text-xl md:text-2xl italic text-white">
                      {!rechercheActive ? "Exploration des abonnés" : "Résultats de recherche"}
                    </h2>
                    <p className="text-white/30 text-[8px] sm:text-[9px] font-mono tracking-widest mt-0.5">
                      {abonnesFiltres.length} {abonnesFiltres.length > 1 ? 'utilisateurs trouvés' : 'utilisateur trouvé'}
                    </p>
                  </div>
                  <div className="text-white/20 text-[7px] sm:text-[8px] font-mono tracking-[0.3em] uppercase">
                    {rechercheActive ? `🔍 "${recherche}"` : '✧ Recherche active'}
                  </div>
                </div>

                <ListeAbonnes 
                  abonnes={abonnesFiltres} 
                  rechercheActive={rechercheActive} 
                  theme={CONFIG_THEME} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pied de page */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12 md:mt-16 lg:mt-20 text-center pb-4"
        >
          <div className="flex items-center justify-center gap-3 sm:gap-6 mb-4 md:mb-6">
            <div className="h-[1px] w-6 sm:w-12 md:w-16 bg-gradient-to-r from-transparent to-white/10" />
            <div className="w-1 h-1 rounded-full bg-[#aec3b0]/30" />
            <div className="h-[1px] w-6 sm:w-12 md:w-16 bg-gradient-to-l from-transparent to-white/10" />
          </div>
          <p className="font-mono text-[6px] sm:text-[7px] md:text-[8px] text-white/20 uppercase tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.5em]">
            e.Sary Studio — Gestion des Abonnements
          </p>
        </motion.div>
      </main>

      {/* Modals */}
      <ModalTarif
        estOuvert={modalOuvert}
        onFermer={() => {
          setModalOuvert(false);
          setTarifEnEdition(null);
        }}
        onSoumettre={tarifEnEdition ? handleModifierTarif : handleCreerTarif}
        tarifExistant={tarifEnEdition}
        estAdmin={estAdmin}
        theme={CONFIG_THEME}
      />

      <ModalConfirmation
        estOuvert={confirmationModal.ouvert}
        onFermer={() => setConfirmationModal({ ...confirmationModal, ouvert: false })}
        titre={confirmationModal.titre}
        message={confirmationModal.message}
        onConfirmer={confirmationModal.action}
        theme={CONFIG_THEME}
      />
    </div>
  );
};

export default GestionAbonnements;