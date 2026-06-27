import React from 'react';
import { Eye, Edit2, Trash2, ArrowUpDown, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import StatusBadge from '../dashboard/StatusBadge';
import EmptyState from '../dashboard/EmptyState';

const SubjectTable = ({ 
  subjects, 
  onView, 
  onEdit, 
  onDelete, 
  sortField, 
  sortDir, 
  onSort,
  onAddSubject,
  onToggleStatus 
}) => {
  if (!subjects || subjects.length === 0) {
    return (
      <EmptyState 
        onAddStudent={onAddSubject} 
        title="No subjects found"
        description="We couldn't find any subjects matching your search query or filters. Try adjusting your search or add a new subject."
        buttonText="Add Subject"
        icon={BookOpen}
      />
    );
  }

  const renderSortIcon = (field) => {
    return (
      <button 
        onClick={(e) => {
          e.stopPropagation();
          if (onSort) {
            onSort(field);
          }
        }} 
        className="inline-flex items-center gap-1 group-hover:text-[#0F172A] transition-colors cursor-pointer"
      >
        <ArrowUpDown 
          size={14} 
          className={`transition-transform duration-200 ${
            sortField === field ? 'text-[#2563EB]' : 'text-slate-300'
          } ${
            sortField === field && sortDir === 'desc' ? 'rotate-180' : ''
          }`} 
        />
      </button>
    );
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm overflow-hidden">
      <div className="overflow-x-auto max-h-[600px] relative">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] sticky top-0 z-10 shadow-2xs">
            <tr>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B]">
                <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => onSort('subjectCode')}>
                  Subject Code {renderSortIcon('subjectCode')}
                </div>
              </th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B]">
                <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => onSort('name')}>
                  Subject Name {renderSortIcon('name')}
                </div>
              </th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B]">Description</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B]">Status</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-sm">
            {subjects.map((subject, idx) => (
              <motion.tr
                key={subject.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: idx * 0.02 }}
                className="hover:bg-[#F8FAFC] transition-colors duration-150 group"
              >
                <td className="py-4 px-5 font-mono text-xs font-semibold text-[#2563EB]">
                  {subject.subjectCode}
                </td>
                <td className="py-4 px-5 font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                  {subject.name}
                </td>
                <td className="py-4 px-5 text-[#64748B] max-w-sm truncate">
                  {subject.description}
                </td>
                <td className="py-4 px-5">
                  <button
                    onClick={() => onToggleStatus && onToggleStatus(subject)}
                    className="cursor-pointer focus:outline-none hover:scale-105 active:scale-95 transition-transform"
                    title="Click to toggle status"
                  >
                    <StatusBadge status={subject.status} />
                  </button>
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(subject)}
                      className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-[#2563EB]/10 rounded-lg transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(subject)}
                      className="p-1.5 text-[#64748B] hover:text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded-lg transition-colors cursor-pointer"
                      title="Edit Subject"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(subject)}
                      className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-[#DC2626]/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete Subject"
                    >
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

export default SubjectTable;
