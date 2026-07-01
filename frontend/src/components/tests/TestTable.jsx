import React from 'react';
import { Eye, Edit2, Trash2, Send, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import StatusBadge from '../dashboard/StatusBadge';
import EmptyState from '../dashboard/EmptyState';

const TestTable = ({ tests, onView, onEdit, onPublish, onDelete, onAddTest }) => {
  if (!tests || tests.length === 0) {
    return (
      <EmptyState
        onAddStudent={onAddTest}
        title="No tests found"
        description="No assessments match your search or filter. Create a new test to get started."
        buttonText="Create Test"
        icon={FileText}
      />
    );
  }

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm overflow-hidden">
      <div className="overflow-x-auto max-h-[650px] relative">
        <table className="w-full text-left border-collapse min-w-[960px]">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] sticky top-0 z-10 shadow-2xs">
            <tr>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B]">Test Name</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B]">Class</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B]">Subject</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B]">Duration</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B]">Questions</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B]">Total Marks</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B]">Status</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-sm">
            {tests.map((t, idx) => (
              <motion.tr
                key={t.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: idx * 0.02 }}
                className="hover:bg-[#F8FAFC] transition-colors duration-150 group"
              >
                <td className="py-4 px-5 font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors max-w-[260px] truncate">
                  {t.testName}
                </td>
                <td className="py-4 px-5 text-[#475569] font-semibold">
                  Class {t.className}{t.section ? ` – ${t.section}` : ''}
                </td>
                <td className="py-4 px-5 text-[#475569] font-semibold">
                  {t.subjectName}
                </td>
                <td className="py-4 px-5 text-[#475569] font-medium font-mono">
                  {t.durationMinutes} mins
                </td>
                <td className="py-4 px-5 text-[#475569] font-semibold font-mono">
                  {t.totalQuestions} {t.totalQuestions === 1 ? 'q' : 'qs'}
                </td>
                <td className="py-4 px-5 font-mono font-bold text-[#0F172A]">
                  {t.totalMarks} pts
                </td>
                <td className="py-4 px-5">
                  <StatusBadge status={t.status} />
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onView(t)} title="View Details"
                      className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-[#2563EB]/10 rounded-lg transition-colors cursor-pointer">
                      <Eye size={16} />
                    </button>
                    {t.status === 'DRAFT' && (
                      <>
                        <button onClick={() => onEdit(t)} title="Edit Test"
                          className="p-1.5 text-[#64748B] hover:text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded-lg transition-colors cursor-pointer">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => onPublish(t)} title="Publish Test"
                          className="p-1.5 text-[#64748B] hover:text-[#16A34A] hover:bg-[#16A34A]/10 rounded-lg transition-colors cursor-pointer">
                          <Send size={16} />
                        </button>
                      </>
                    )}
                    <button onClick={() => onDelete(t)} title="Delete Test"
                      className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-[#DC2626]/10 rounded-lg transition-colors cursor-pointer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestTable;
