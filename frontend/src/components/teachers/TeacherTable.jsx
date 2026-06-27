import React from 'react';
import { Eye, Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import StatusBadge from '../dashboard/StatusBadge';
import EmptyState from '../dashboard/EmptyState';

const TeacherTable = ({ 
  teachers, 
  onView, 
  onEdit, 
  onDelete, 
  sortField, 
  sortDir, 
  onSort,
  onAddTeacher,
  onToggleStatus 
}) => {
  if (!teachers || teachers.length === 0) {
    return <EmptyState onAddStudent={onAddTeacher} />;
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
                <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => onSort('employeeId')}>
                  Employee ID {renderSortIcon('employeeId')}
                </div>
              </th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B]">
                <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => onSort('name')}>
                  Teacher Name {renderSortIcon('name')}
                </div>
              </th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B]">Phone</th>
              <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-[#64748B]">
                <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => onSort('qualification')}>
                  Qualification {renderSortIcon('qualification')}
                </div>
              </th>
              <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-[#64748B]">
                <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => onSort('experience')}>
                  Experience {renderSortIcon('experience')}
                </div>
              </th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B]">Status</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-sm">
            {teachers.map((teacher, idx) => (
              <motion.tr
                key={teacher.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: idx * 0.02 }}
                className="hover:bg-[#F8FAFC] transition-colors duration-150 group"
              >
                <td className="py-4 px-5 font-mono text-xs font-semibold text-[#64748B]">
                  {teacher.employeeId}
                </td>
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={teacher.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"}
                      alt={teacher.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#E2E8F0] shrink-0"
                    />
                    <div>
                      <div className="font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                        {teacher.name}
                      </div>
                      <div className="text-xs text-[#64748B]">{teacher.loginId}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-5 font-mono text-xs text-[#64748B]">{teacher.phone}</td>
                <td className="py-4 px-4 font-semibold text-[#0F172A]">{teacher.qualification}</td>
                <td className="py-4 px-4 text-[#64748B] font-medium">{teacher.experience} Years</td>
                <td className="py-4 px-5">
                  <button
                    onClick={() => onToggleStatus && onToggleStatus(teacher)}
                    className="cursor-pointer focus:outline-none hover:scale-105 active:scale-95 transition-transform"
                    title="Click to toggle status"
                  >
                    <StatusBadge status={teacher.status} />
                  </button>
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(teacher)}
                      className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-[#2563EB]/10 rounded-lg transition-colors cursor-pointer"
                      title="View Profile"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(teacher)}
                      className="p-1.5 text-[#64748B] hover:text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded-lg transition-colors cursor-pointer"
                      title="Edit Record"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(teacher)}
                      className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-[#DC2626]/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete Record"
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

export default TeacherTable;
