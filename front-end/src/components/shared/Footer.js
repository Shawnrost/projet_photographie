import { motion } from 'framer-motion';
import { Camera, Share2, Globe, AtSign, ArrowRight, Mail } from 'lucide-react';
import { useState } from 'react';

const footerLinks = {
  Plateforme: ["Galerie", "Photographes", "Missions Flash", "Marketplace"],
  Compte: ["Connexion", "Créer un compte", "Abonnements", "Tableau de bord"],
  Légal: ["Conditions d'utilisation", "Confidentialité", "Droits d'auteur", "Cookies"],
  Société: ["À propos", "Blog", "Presse", "Contact"]
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (email) { setSent(true); setEmail(''); }
  };

  return (
    <footer className="bg-[#020508] border-t border-white/5 overflow-hidden">

      {/* Top CTA strip */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(ellipse at 50% 100%, #0c4a6e, transparent 70%)" }}
        />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-sky-400 text-xs tracking-[0.5em] uppercase mb-4"
          >
            ✦ Rejoignez-nous ✦
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6"
          >
            Votre art mérite d'être
            <br />
            <span className="font-light italic text-sky-400">vu par le monde entier</span>
          </motion.h2>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto mt-10"
          >
            {!sent ? (
              <div className="flex gap-2 p-2 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 flex-1 pl-3">
                  <Mail size={16} className="text-white/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    className="bg-transparent text-white placeholder-white/30 text-sm flex-1 outline-none"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-5 py-3 bg-sky-500 text-white rounded-xl text-sm font-bold"
                >
                  S'inscrire <ArrowRight size={14} />
                </motion.button>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-4 text-sky-400 font-mono text-sm tracking-widest"
              >
                ✦ Bienvenue dans la communauté e-Sary !
              </motion.div>
            )}
            <p className="text-white/20 text-xs mt-3">
              Recevez les meilleures photos et opportunités chaque semaine.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand column */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center">
                <Camera size={18} className="text-white" />
              </div>
              <span className="font-black text-2xl text-white tracking-tighter">
                e<span className="text-sky-400">-</span>Sary
              </span>
            </div>
            <p className="text-white/30 text-sm leading-relaxed mb-8 max-w-xs">
              La première plateforme sociale et marketplace pour les photographes professionnels malgaches.
            </p>

            {/* Socials */}
            <div className="flex gap-3">
              {[Share2, Globe, AtSign].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-sky-400 hover:border-sky-400/30 transition-colors"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links], ci) => (
            <div key={ci} className="md:col-span-2">
              <h4 className="text-white/60 font-mono text-xs tracking-[0.3em] uppercase mb-6">{category}</h4>
              <ul className="space-y-3">
                {links.map((link, li) => (
                  <motion.li key={li} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                    <a href="#" className="text-white/30 hover:text-white text-sm transition-colors">
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/20 text-xs font-mono">
            © 2026 e-Sary · Antananarivo, Madagascar · Tous droits réservés
          </p>
          <motion.p
            className="text-white/10 text-xs font-mono tracking-widest"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            ✦ FABRIQUÉ AVEC ♥ POUR LES PHOTOGRAPHES MALGACHES ✦
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;