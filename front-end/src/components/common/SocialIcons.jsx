import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SOCIALS = [FaInstagram, FaTwitter, FaFacebook];

export const SocialIcons = ({ size = 14, className = '' }) => (
  <div className={`flex gap-3 ${className}`}>
    {SOCIALS.map((Icon, i) => (
      <motion.button
        key={i}
        whileHover={{ scale: 1.2, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="w-10 h-10 rounded-full border border-ivory/10 bg-black/20 backdrop-blur-sm 
                   flex items-center justify-center text-ivory/60 hover:text-gold 
                   hover:border-gold/30 transition-all duration-300"
      >
        <Icon size={size} />
      </motion.button>
    ))}
  </div>
);