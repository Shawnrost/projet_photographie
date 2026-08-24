// Vitrine.jsx
// L'en-tête (EnTete) n'est plus importé ici : il est désormais rendu directement
// dans AppShell (App.jsx), en dehors du motion.div animé de PageWrapper.
// Raison : un ancêtre avec `transform` (y) ou `filter` actif devient un
// containing block CSS, ce qui casse le `position: fixed` de la nav.
import HeroSection from './HeroSection';
import GallerySection from './GallerySection';
import UniversSection from './UniversSection';
import FormulesSection from './FormulesSection';
import Footer from './Footer';

const Vitrine = () => {
  return (
    <div className="vitrine-container bg-ivory">
      <HeroSection />
      <GallerySection />
      <UniversSection />
      <FormulesSection />
      <Footer />
    </div>
  );
};

export default Vitrine;