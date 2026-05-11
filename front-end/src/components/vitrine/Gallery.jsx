import { motion } from 'framer-motion';
import { useState } from 'react';
import { Eye, Heart, ShoppingBag } from 'lucide-react';

const artworks = [
  { url: "https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80&w=1000", author: "Rakoto Andriantsoa", title: "Golden Hour, Nosy Be",       price: "120 000 Ar", likes: 842,  views: "12K",  category: "Paysage",     col: "md:col-span-2 md:row-span-2" },
  { url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000", author: "Vola Ramiandrisoa",    title: "Studio Light",            price: "85 000 Ar",  likes: 623,  views: "8.4K", category: "Portrait",    col: "" },
  { url: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80&w=1000", author: "Jean-Luc R.",          title: "The Decisive Moment",     price: "200 000 Ar", likes: 1204, views: "21K",  category: "Fine Art",    col: "" },
  { url: "https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?auto=format&fit=crop&q=80&w=1000", author: "Miora Randriamanantsoa",title: "Baobab Twilight",         price: "350 000 Ar", likes: 2310, views: "45K",  category: "Patrimoine",  col: "" },
  { url: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&q=80&w=1000", author: "Fidy Razakarivony",    title: "Architecture Minimaliste",price: "145 000 Ar", likes: 930,  views: "15K",  category: "Architecture",col: "" },
];

const ArtCard = ({ art, i }) => {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl bg-slate-900 cursor-pointer ${art.col}`}
      style={{ minHeight: art.col.includes('row-span-2') ? 500 : 240, willChange: 'transform' }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: i * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Image — CSS transition for scale, no framer overhead */}
      <img
        src={art.url}
        alt={art.title}
        className="w-full h-full object-cover transition-transform duration-700 ease-out"
        style={{ transform: hov ? 'scale(1.07)' : 'scale(1)', filter: hov ? 'brightness(0.65)' : 'brightness(0.85)' }}
      />

      {/* Category */}
      <span className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white/80 text-xs font-mono tracking-widest px-3 py-1 rounded-full border border-white/10">
        {art.category}
      </span>

      {/* Views */}
      <div className={`absolute top-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full transition-opacity duration-300 ${hov ? 'opacity-100' : 'opacity-0'}`}>
        <Eye size={11} className="text-white/60" />
        <span className="text-white/80 text-xs font-mono">{art.views}</span>
      </div>

      {/* Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent flex flex-col justify-end p-5 transition-opacity duration-300 ${hov ? 'opacity-100' : 'opacity-70'}`}>
        <p className={`text-white/50 text-xs font-mono tracking-widest uppercase mb-1 transition-all duration-300 ${hov ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          par {art.author}
        </p>
        <h3 className="text-white text-xl font-bold tracking-tight leading-tight mb-3">{art.title}</h3>
        <div className={`flex items-center justify-between transition-all duration-300 ${hov ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <span className="text-sky-400 font-bold">{art.price}</span>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-red-500/30 transition-colors">
              <Heart size={13} className="text-white" />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500 text-white text-xs font-bold hover:bg-sky-400 transition-colors">
              <ShoppingBag size={12} /> Acheter
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Gallery = () => (
  <section className="bg-[#06090f] py-28" id="galerie">
    <div className="container mx-auto px-6">
      <motion.div
        className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <p className="font-mono text-pink-400 text-xs tracking-[0.5em] uppercase mb-3">✦ Galerie ✦</p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-none">
            LES PLUS<br /><span className="font-light italic text-pink-400">belles œuvres</span>
          </h2>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-sm max-w-xs leading-relaxed">Explorez des milliers de photos signées par les meilleurs photographes malgaches.</p>
          <button className="mt-3 text-white/50 hover:text-sky-400 text-sm font-mono tracking-widest underline underline-offset-4 transition-colors">Voir tout →</button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ gridAutoRows: '240px' }}>
        {artworks.map((art, i) => <ArtCard key={i} art={art} i={i} />)}
      </div>
    </div>
  </section>
);

export default Gallery;
