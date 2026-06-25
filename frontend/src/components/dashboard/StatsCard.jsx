import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, title, value, description, colorClass = "text-[#2563EB]", bgClass = "bg-[#2563EB]/10" }) => {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#64748B] tracking-wide">{title}</p>
          <h3 className="text-3xl font-bold text-[#0F172A] mt-2 font-mono tracking-tight">{value}</h3>
          {description && (
            <p className="text-xs font-medium text-[#64748B] mt-1.5 flex items-center gap-1">
              {description}
            </p>
          )}
        </div>
        <div className={`p-3.5 rounded-xl ${bgClass} ${colorClass}`}>
          {Icon && <Icon size={24} />}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
