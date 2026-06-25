import React from 'react';
import { Users, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState = ({ onAddStudent }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-[#E2E8F0] rounded-[16px] py-16 px-6 text-center max-w-xl mx-auto my-12 shadow-xs"
    >
      <div className="w-16 h-16 bg-[#2563EB]/10 text-[#2563EB] rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Users size={32} />
      </div>
      <h3 className="text-lg font-bold text-[#0F172A]">No students found</h3>
      <p className="text-sm text-[#64748B] mt-1 max-w-sm mx-auto">
        We couldn't find any students matching your search query or filters. Try adjusting your search or add a new student.
      </p>
      {onAddStudent && (
        <button
          onClick={onAddStudent}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white font-semibold rounded-[16px] hover:bg-[#1D4ED8] transition-colors shadow-xs hover:shadow-md"
        >
          <Plus size={18} />
          Add Student
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
