import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

const STATUT_STYLES = {
  active: { label: 'Actif', bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20' },
  expire: { label: 'Expiré', bg: 'bg-charcoal/5', text: 'text-charcoal/40', border: 'border-charcoal/10' },
  annule: { label: 'Annulé', bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20' },
};

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};

const HistoriqueAbonnements = ({ historique }) => {
  if (!historique || historique.length === 0) {
    return (
      <div className="rounded-3xl border border-charcoal/10 bg-white p-10 text-center">
        <p className="font-sans text-sm text-charcoal/40">
          Aucun historique d'abonnement pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-charcoal/10 bg-white overflow-hidden">
      {historique.map((item, i) => {
        const statut = STATUT_STYLES[item.status] || STATUT_STYLES.expire;
        return (
          <motion.div
            key={item.id || i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: EASE }}
            className={`flex items-center justify-between gap-4 px-6 py-4 ${
              i !== historique.length - 1 ? 'border-b border-charcoal/[0.06]' : ''
            }`}
          >
            <div>
              <p className="font-sans text-sm font-medium text-charcoal">
                {item.plan_tarif?.plan_label || item.type}
                <span className="ml-2 text-charcoal/35 font-normal">
                  · {item.plan_tarif?.duree_label || item.duree}
                </span>
              </p>
              <p className="mt-0.5 font-mono text-[10px] text-charcoal/35 tracking-wide">
                {formatDate(item.date_deb)} — {formatDate(item.date_fin)}
              </p>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="font-mono text-xs text-charcoal/50">{item.prix}Ar</span>
              <span className={`rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.15em] ${statut.bg} ${statut.text} ${statut.border}`}>
                {statut.label}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default HistoriqueAbonnements;