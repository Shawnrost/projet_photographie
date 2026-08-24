import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CarteUtilisateur = ({ user, index, onUserClick }) => {
  const navigate = useNavigate();

  const getInitiales = () => {
    if (user.prenom && user.nom) {
      return `${user.prenom[0]}${user.nom[0]}`.toUpperCase();
    }
    if (user.prenom) {
      return user.prenom.substring(0, 2).toUpperCase();
    }
    if (user.nom) {
      return user.nom.substring(0, 2).toUpperCase();
    }
    return '?';
  };

  const getRoleLabel = (role) => {
    const roles = {
      photographe: 'Photographe',
      client: 'Client',
      admin: 'Administrateur'
    };
    return roles[role] || role;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleFollow = (e) => {
    e.stopPropagation();
    // TODO: Implémenter la logique de follow/unfollow
    console.log('Follow/Unfollow:', user.id, user.est_suivi);
  };

  const handleCardClick = () => {
    if (onUserClick) {
      onUserClick(user); // Passer l'objet utilisateur complet
    } else {
      navigate(`/profil-utilisateur/${user.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.05,
        type: "spring", 
        stiffness: 300, 
        damping: 25 
      }}
      whileHover={{ y: -2 }}
      onClick={handleCardClick}
      className="group relative flex items-center gap-4 bg-white border border-[#2d3a30]/5 rounded-2xl p-4 cursor-pointer hover:border-[#c9a96e]/20 hover:shadow-lg transition-all duration-300"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {user.photo_profil ? (
          <motion.img 
            src={user.photo_profil} 
            alt={`${user.prenom} ${user.nom}`}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#2d3a30]/5 group-hover:ring-[#c9a96e]/20 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          />
        ) : (
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f8f9f8] to-[#e9ecef] flex items-center justify-center border border-[#2d3a30]/5 ring-2 ring-[#2d3a30]/5 group-hover:ring-[#c9a96e]/20 transition-all duration-300"
          >
            <span className="text-[#2d3a30] font-mono text-sm font-semibold">
              {getInitiales()}
            </span>
          </motion.div>
        )}
        
        {/* Badge rôle */}
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
          className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full font-mono text-[7px] tracking-wider uppercase border ${
            user.role === 'photographe' 
              ? 'bg-[#2d3a30] text-[#aec3b0] border-[#2d3a30]/10' 
              : 'bg-white text-[#2d3a30]/60 border-[#2d3a30]/10'
          }`}
        >
          {getRoleLabel(user.role)}
        </motion.span>
      </div>

      {/* Informations */}
      <div className="flex-1 min-w-0">
        <h4 className="font-serif text-base text-[#2d3a30] leading-tight group-hover:text-[#c9a96e] transition-colors duration-300 truncate">
          {user.prenom} {user.nom}
        </h4>
        
        {user.profil_photographe?.bio && (
          <p className="text-[10px] text-[#2d3a30]/40 mt-0.5 line-clamp-1 italic">
            {user.profil_photographe.bio}
          </p>
        )}
        
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          {user.profil_photographe && (
            <>
              <span className="font-mono text-[8px] text-[#2d3a30]/30 uppercase tracking-wider flex items-center gap-1">
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                </svg>
                {user.profil_photographe.nombre_publications || 0} œuvres
              </span>
            </>
          )}
          
          <span className="font-mono text-[8px] text-[#2d3a30]/30 uppercase tracking-wider flex items-center gap-1">
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            {user.nombre_abonnes || 0} abonnés
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFollow}
          className={`px-3 py-1.5 rounded-full font-mono text-[8px] tracking-wider uppercase border transition-all duration-300 ${
            user.est_suivi
              ? 'bg-[#2d3a30] text-[#aec3b0] border-[#2d3a30]'
              : 'bg-white text-[#2d3a30]/50 border-[#2d3a30]/10 hover:border-[#2d3a30]/30 hover:text-[#2d3a30]'
          }`}
        >
          {user.est_suivi ? 'Suivi' : 'Suivre'}
        </motion.button>
        
        {user.created_at && (
          <span className="font-mono text-[7px] text-[#2d3a30]/20 uppercase tracking-wider">
            Membre depuis {formatDate(user.created_at)}
          </span>
        )}
      </div>

      {/* Flèche discrète */}
      <motion.div
        initial={{ opacity: 0, x: -5 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <svg className="w-4 h-4 text-[#c9a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default CarteUtilisateur;