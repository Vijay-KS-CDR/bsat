import React from 'react';
import { Eye, Edit2, Trash2, ArrowUpDown, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import StatusBadge from '../dashboard/StatusBadge';
import EmptyState from '../dashboard/EmptyState';

const getDifficultyBadge = (difficulty) => {
  switch (difficulty) {
    case 'Easy':
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Easy
        </span>
      );
    case 'Medium':
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          Medium
        </span>
      );
    case 'Hard':
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          Hard
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          {difficulty || 'N/A'}
        </span>
      );
  }
};

const getTypeBadge = (type) => {
  switch (type) {
    case 'MCQ_SINGLE':
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
          MCQ
        </span>
      );
    case 'NUMERICAL':
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          NUMERICAL
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
          {type || 'N/A'}
        </span>
      );
  }
};

const QuestionTable = ({
  questions,
  onView,
  onEdit,
  onDelete,
  sortField,
  sortDir,
  onSort,
  onAddQuestion,
  onToggleStatus
}) => {
  if (!questions || questions.length === 0) {
    return (
      <EmptyState
        onAddStudent={onAddQuestion}
        title="No questions found"
        description="We couldn't find any questions matching your search query or filters. Try adjusting your search or add a new question to the bank."
        buttonText="Add Question"
        icon={HelpCircle}
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
      <div className="overflow-x-auto max-h-[650px] relative">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] sticky top-0 z-10 shadow-2xs">
            <tr>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B]">
                <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => onSort('subject')}>
                  Subject {renderSortIcon('subject')}
                </div>
              </th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B]">
                <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => onSort('topic')}>
                  Topic {renderSortIcon('topic')}
                </div>
              </th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B]">
                <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => onSort('questionType')}>
                  Question Type {renderSortIcon('questionType')}
                </div>
              </th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B]">
                <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => onSort('difficulty')}>
                  Difficulty {renderSortIcon('difficulty')}
                </div>
              </th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B]">
                <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => onSort('marks')}>
                  Marks {renderSortIcon('marks')}
                </div>
              </th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B]">Status</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#64748B] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-sm">
            {questions.map((q, idx) => (
              <motion.tr
                key={q.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: idx * 0.02 }}
                className="hover:bg-[#F8FAFC] transition-colors duration-150 group"
              >
                <td className="py-4 px-5 font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                  {q.subject}
                </td>
                <td className="py-4 px-5 text-[#475569] font-medium max-w-[200px] truncate">
                  {q.topic}
                  <div className="text-xs text-[#94A3B8] truncate mt-0.5" title={q.questionText}>
                    {q.questionText}
                  </div>
                </td>
                <td className="py-4 px-5">
                  {getTypeBadge(q.questionType)}
                </td>
                <td className="py-4 px-5">
                  {getDifficultyBadge(q.difficulty)}
                </td>
                <td className="py-4 px-5 font-mono font-semibold text-[#0F172A]">
                  {q.marks} {q.marks === 1 ? 'pt' : 'pts'}
                </td>
                <td className="py-4 px-5">
                  <button
                    onClick={() => onToggleStatus && onToggleStatus(q)}
                    className="cursor-pointer focus:outline-none hover:scale-105 active:scale-95 transition-transform"
                    title="Click to toggle status"
                  >
                    <StatusBadge status={q.status} />
                  </button>
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(q)}
                      className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-[#2563EB]/10 rounded-lg transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(q)}
                      className="p-1.5 text-[#64748B] hover:text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded-lg transition-colors cursor-pointer"
                      title="Edit Question"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(q)}
                      className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-[#DC2626]/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete Question"
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

export default QuestionTable;
