// FormulesSection.jsx
import useRevealOnScroll from '../hooks/useRevealOnScroll';

const ABONNEMENTS = [
  {
    nom: 'Essentiel',
    prix: '30 000 Ar / mois',
    pour: 'Pour démarrer sereinement',
    fonctionnalites: [
      'Jusqu\u2019à 1 galerie active',
      '20 photos publiées maximum',
      'Profil public avec badge photographe',
      'Messagerie avec les clients',
      'Support par email',
    ],
    mise_en_avant: false,
  },
  {
    nom: 'Professionnel',
    prix: '75 000 Ar / mois',
    pour: 'Pour les photographes actifs',
    fonctionnalites: [
      'Galeries et photos illimitées',
      'Mise en avant dans les recherches',
      'Statistiques de vues et d\u2019engagement',
      'Messagerie et prise de rendez-vous illimitées',
      'Support prioritaire',
    ],
    mise_en_avant: true,
  },
  {
    nom: 'Studio',
    prix: 'sur devis',
    pour: 'Pour les studios et équipes',
    fonctionnalites: [
      'Tout le plan Professionnel, inclus',
      'Plusieurs comptes membres d\u2019équipe',
      'Mise en avant sur la page d\u2019accueil',
      'Export et intégration API',
      'Accompagnement dédié',
    ],
    mise_en_avant: false,
  },
];

const IconCheck = (props) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const FormulesSection = () => {
  const { ref, revealed } = useRevealOnScroll(ABONNEMENTS.length + 1, { stagger: 150 });

  return (
    <section id="formules" ref={ref} className="w-full bg-ivory px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto mb-10 flex items-start gap-3 md:mb-4">
        <span className="mt-1 font-mono text-[10px] text-gold/70">03</span>
        <h2 className="font-display text-4xl italic text-charcoal md:text-5xl">Formules</h2>
      </div>

      {/* Explication de l'accès gratuit puis des abonnements photographes */}
      <div
        className={`mx-auto mb-16 max-w-screen-xl transition-all duration-700 ease-out md:mb-24 ${
          revealed[0] ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        <p className="max-w-2xl font-sans text-sm font-light leading-relaxed text-charcoal/60 md:text-base">
          À la création de votre compte photographe, vous profitez d&rsquo;un accès complet et{' '}
          <span className="font-medium text-charcoal">gratuit pendant 1 mois</span>, sans engagement, pour
          découvrir la plateforme et publier vos premières séries. Passé ce délai, choisissez l&rsquo;abonnement
          qui correspond à votre pratique : chaque formule donne accès à un ensemble de fonctionnalités qui lui
          est propre.
        </p>

        <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-gold/10 px-4 py-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal/70">
            1 mois offert à l&rsquo;inscription — sans carte bancaire
          </span>
        </div>
      </div>

      <div className="mx-auto grid max-w-screen-xl gap-6 md:grid-cols-3">
        {ABONNEMENTS.map((offre, i) => (
          <div
            key={offre.nom}
            className={`flex flex-col justify-between rounded-2xl border p-8 transition-all duration-700 ease-out md:p-10 ${
              offre.mise_en_avant
                ? 'border-gold/40 bg-charcoal text-ivory shadow-[0_30px_60px_rgba(28,33,25,0.15)] md:-translate-y-4'
                : 'border-charcoal/10 bg-white text-charcoal'
            } ${revealed[i + 1] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${
              offre.mise_en_avant && revealed[i + 1] ? 'md:-translate-y-4' : ''
            }`}
          >
            <div>
              <span
                className={`font-mono text-[9px] uppercase tracking-[0.3em] ${
                  offre.mise_en_avant ? 'text-gold/70' : 'text-charcoal/40'
                }`}
              >
                {offre.mise_en_avant ? 'Recommandée' : 'Abonnement'}
              </span>
              <h3 className="mt-3 font-display text-3xl italic">{offre.nom}</h3>
              <p
                className={`mt-2 font-sans text-sm font-light ${
                  offre.mise_en_avant ? 'text-ivory/60' : 'text-charcoal/50'
                }`}
              >
                {offre.pour}
              </p>

              <ul className="mt-6 flex flex-col gap-3 border-t border-current/10 pt-6">
                {offre.fonctionnalites.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <IconCheck
                      className={`mt-0.5 shrink-0 ${offre.mise_en_avant ? 'text-gold' : 'text-charcoal/40'}`}
                    />
                    <span
                      className={`font-sans text-sm font-light leading-relaxed ${
                        offre.mise_en_avant ? 'text-ivory/80' : 'text-charcoal/70'
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-current/10 pt-6">
              <span className="font-mono text-xs">{offre.prix}</span>
              <button
                className={`rounded-full px-5 py-2 font-mono text-[10px] uppercase tracking-[0.25em] transition-all duration-300 ${
                  offre.mise_en_avant
                    ? 'bg-gold text-charcoal hover:bg-gold-light'
                    : 'border border-charcoal/20 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-ivory'
                }`}
              >
                Choisir cette offre
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-screen-xl font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal/35">
        Changement ou résiliation possible à tout moment depuis votre espace photographe.
      </p>
    </section>
  );
};

export default FormulesSection;