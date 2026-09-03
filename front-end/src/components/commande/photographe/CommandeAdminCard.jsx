import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../../services/api';

const STATUTS = [
  { value: 'en_attente', label: 'En attente' },
  { value: 'paye', label: 'Payé' },
  { value: 'annule', label: 'Annulé' }
];

const CommandeAdminCard = ({ commande, index, theme, onStatusChange }) => {
  const [updating, setUpdating] = useState(false);
  const [localStatus, setLocalStatus] = useState(commande.status);
  const [errorMsg, setErrorMsg] = useState(null);

  const getStatusColor = (status) => {
    const colors = {
      en_attente: 'text-yellow-600/70 border-yellow-400/25 bg-yellow-400/10',
      paye: 'text-green-600/70 border-green-400/25 bg-green-400/10',
      annule: 'text-red-600/70 border-red-400/25 bg-red-400/10'
    };
    return colors[status] || 'text-[#2d3a30]/40 border-[#2d3a30]/10 bg-[#2d3a30]/5';
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === localStatus || updating) return;
    const previous = localStatus;
    setLocalStatus(newStatus);
    setUpdating(true);
    setErrorMsg(null);

    try {
      const res = await api.patch(`/commandes/admin/${commande.id}/statut/`, {
        status: newStatus
      });
      if (res.data.success) {
        onStatusChange?.(commande.id, newStatus);
      } else {
        throw new Error();
      }
    } catch (err) {
      console.error('Erreur changement de statut:', err);
      setLocalStatus(previous);
      setErrorMsg('Échec de la mise à jour du statut.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 1, 0.5, 1],
        delay: (index % 5) * 0.05
      }}
      className="bg-white border border-[#2d3a30]/5 rounded-2xl p-4 hover:border-[#c9a96e]/20 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#2d3a30]/5">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[#2d3a30]/70 text-xs font-serif italic">
            {commande.client_nom || commande.client_email || `Client #${commande.client_id ?? '—'}`}
          </span>
          <span className="text-[#2d3a30]/30 text-[9px] font-mono tracking-wider">
            {new Date(commande.created_at).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        <div className="text-right">
          <p style={{ color: theme.accentSage }} className="font-serif italic text-lg font-light">
            {parseFloat(commande.prix_a_payer).toFixed(2)} Ar
          </p>
          <span className="text-[#2d3a30]/20 text-[9px] font-mono tracking-wider">
            {commande.articles?.length || 0} article(s)
          </span>
        </div>
      </div>

      {commande.articles && commande.articles.length > 0 && (
        <div className="mt-3 space-y-2">
          {commande.articles.map((article) => (
            <div key={article.id} className="flex items-center gap-3 text-sm">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#2d3a30]/5 flex-shrink-0">
                <img
                  src={article.publication_image}
                  alt={article.publication_titre}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#2d3a30]/80 text-xs font-light truncate">
                  {article.publication_titre}
                </p>
              </div>
              <p className="text-[#2d3a30]/40 text-xs font-mono tabular-nums">
                {parseFloat(article.prix_unitaire).toFixed(2)} Ar
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-[#2d3a30]/5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 flex-wrap">
          {STATUTS.map((s) => (
            <button
              key={s.value}
              onClick={() => handleStatusChange(s.value)}
              disabled={updating}
              className={`text-[9px] px-2.5 py-1 rounded-full border font-mono tracking-wider uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                localStatus === s.value
                  ? getStatusColor(s.value)
                  : 'text-[#2d3a30]/30 border-[#2d3a30]/10 hover:border-[#2d3a30]/25 hover:text-[#2d3a30]/60'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        {updating && (
          <span className="text-[9px] font-mono text-[#2d3a30]/30 tracking-wider uppercase animate-pulse">
            Mise à jour...
          </span>
        )}
      </div>
      {errorMsg && (
        <p className="mt-2 text-[10px] text-red-500/70 font-mono">{errorMsg}</p>
      )}
    </motion.div>
  );
};

export default CommandeAdminCard;