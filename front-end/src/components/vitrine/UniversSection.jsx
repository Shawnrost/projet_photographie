// UniversSection.jsx
import useRevealOnScroll from '../hooks/useRevealOnScroll';

const STATS = [
  { label: 'Expositions', value: '12' },
  { label: 'Depuis', value: '2019' },
  { label: 'Médium', value: 'Argentique & numérique' },
];

const UniversSection = () => {
  const { ref, revealed } = useRevealOnScroll(2, { stagger: 220 });

  return (
    <section id="univers" ref={ref} className="w-full bg-charcoal px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto grid max-w-screen-xl gap-12 md:grid-cols-2 md:gap-20">
        {/* IMAGE */}
        <div
          className={`relative aspect-[4/5] w-full overflow-hidden rounded-sm transition-all duration-[900ms] ease-out ${
            revealed[0] ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
          }`}
        >
          <img src="/images/4.jpeg" alt="Portrait de l'artiste" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-sauge/10" />
        </div>

        {/* TEXTE */}
        <div
          className={`flex flex-col justify-center transition-all duration-[900ms] ease-out ${
            revealed[1] ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
          }`}
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="font-mono text-[10px] text-gold/70">02</span>
            <h2 className="font-display text-4xl italic text-ivory md:text-5xl">L&rsquo;univers</h2>
          </div>

          <p className="font-display text-2xl italic leading-relaxed text-ivory/90 md:text-3xl">
            &laquo; Je cherche la seconde où la lumière raconte quelque chose que les mots ne disent pas. &raquo;
          </p>

          <p className="mt-6 max-w-md font-sans text-sm font-light leading-relaxed text-ivory/60">
            Chaque série naît d&rsquo;une observation simple : un visage, un silence, une texture de lumière.
            Le travail se construit lentement, entre studio et extérieur, entre argentique et numérique.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-ivory/10 pt-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="font-display text-xl text-gold-light">{stat.value}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-ivory/40">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniversSection;