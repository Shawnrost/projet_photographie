import { motion } from 'framer-motion';

const CommandeSkeleton = ({ theme }) => {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex justify-between items-baseline border-b border-[#2d3a30]/10 pb-4 mb-6">
        <div className="h-8 bg-[#2d3a30]/5 rounded-lg animate-pulse w-40" />
        <div className="h-4 bg-[#2d3a30]/5 rounded-lg animate-pulse w-20" />
      </div>

      {/* Cards skeleton */}
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-4 p-4 border border-[#2d3a30]/5 rounded-2xl bg-white"
        >
          <div className="w-20 h-20 rounded-xl bg-[#2d3a30]/5 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[#2d3a30]/5 rounded-lg animate-pulse w-3/4" />
            <div className="h-3 bg-[#2d3a30]/5 rounded-lg animate-pulse w-1/2" />
          </div>
          <div className="flex-shrink-0">
            <div className="h-6 bg-[#2d3a30]/5 rounded-lg animate-pulse w-20" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CommandeSkeleton;