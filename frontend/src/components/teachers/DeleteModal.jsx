import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, teacherName }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 max-w-md w-full shadow-2xl overflow-hidden"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#DC2626]/10 text-[#DC2626] rounded-2xl shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">Delete Teacher Record</h3>
              <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
                Are you sure you want to delete <strong className="text-[#0F172A]">{teacherName || 'this teacher'}</strong>? This action cannot be undone and will permanently remove their teaching profile and related credentials from the system.
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-[#64748B] bg-[#F8FAFC] hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#DC2626] hover:bg-[#b91c1c] shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              Delete Teacher
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteModal;
