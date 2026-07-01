import React, { useState } from 'react';
import { ArrowLeft, Edit2, Calendar, Clock, Layers, CheckCircle2, List, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import StatusBadge from '../dashboard/StatusBadge';

const TestDetails = ({ test, onBack, onEdit }) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  if (!test) return null;

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      return new Date(isoString).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
      return isoString;
    }
  };

  const typeColor = {
    MCQ_SINGLE: 'bg-blue-50 text-blue-700 border-blue-200',
    NUMERICAL: 'bg-violet-50 text-violet-700 border-violet-200',
  };

  const questions = test.questions || [];

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="space-y-6 max-w-5xl mx-auto">

      {/* Back + Edit Bar */}
      <div className="flex items-center justify-between pb-1">
        <button onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer">
          <ArrowLeft size={16} /> Back to Test Listings
        </button>
        {test.status === 'DRAFT' && (
          <button onClick={() => onEdit(test.id)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white font-semibold text-sm rounded-xl hover:bg-[#1D4ED8] transition-all shadow-sm cursor-pointer">
            <Edit2 size={16} /> Edit Test
          </button>
        )}
      </div>

      {/* Hero Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm overflow-hidden">
        <div className="relative bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <List size={34} className="stroke-[1.5]" />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs">
                    {test.subjectName}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-xs">
                    Class {test.className}{test.section ? ` – ${test.section}` : ''}
                  </span>
                  <div className="bg-white/90 px-1.5 py-0.5 rounded-full">
                    <StatusBadge status={test.status} />
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{test.testName}</h2>
                <p className="text-purple-200 text-xs">ID #{test.id} · Created {test.createdAt ? formatDate(test.createdAt) : 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
              <div className="bg-white/10 border border-white/25 rounded-2xl p-4 text-center min-w-[90px]">
                <span className="block text-[10px] uppercase tracking-wider text-purple-200 font-bold">Questions</span>
                <span className="text-2xl font-black text-white font-mono mt-0.5 block">{test.totalQuestions}</span>
              </div>
              <div className="bg-white/10 border border-white/25 rounded-2xl p-4 text-center min-w-[90px]">
                <span className="block text-[10px] uppercase tracking-wider text-purple-200 font-bold">Total Marks</span>
                <span className="text-2xl font-black text-white font-mono mt-0.5 block">{test.totalMarks}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="p-7 space-y-7 bg-[#F8FAFC]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-[#2563EB] rounded-xl shrink-0"><Clock size={20} /></div>
              <div>
                <span className="text-xs font-bold text-[#64748B] block uppercase tracking-wider">Duration</span>
                <span className="text-sm font-bold text-[#0F172A] font-mono">{test.durationMinutes} Minutes</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-[#F59E0B] rounded-xl shrink-0"><Calendar size={20} /></div>
              <div>
                <span className="text-xs font-bold text-[#64748B] block uppercase tracking-wider">Start Time</span>
                <span className="text-sm font-bold text-[#0F172A]">{formatDate(test.startTime)}</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs flex items-center gap-4">
              <div className="p-3 bg-rose-50 text-[#DC2626] rounded-xl shrink-0"><Calendar size={20} /></div>
              <div>
                <span className="text-xs font-bold text-[#64748B] block uppercase tracking-wider">End Time</span>
                <span className="text-sm font-bold text-[#0F172A]">{formatDate(test.endTime)}</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          {test.instructions && (
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] mb-3 flex items-center gap-1.5">
                <AlertCircle size={14} /> Test Instructions
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-wrap">{test.instructions}</p>
            </div>
          )}

          {/* Questions List */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5 mb-4">
              <Layers size={15} /> Questions ({questions.length})
            </h3>

            {questions.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-[#E2E8F0] text-center text-sm text-[#64748B]">
                No questions found for this test.
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((q, idx) => {
                  const isOpen = expandedQuestion === idx;
                  const isMCQ = q.questionType === 'MCQ_SINGLE';
                  const hasAnswer = q.questionType === 'NUMERICAL';

                  return (
                    <div key={q.id || idx} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
                      {/* Question row header */}
                      <button type="button" onClick={() => setExpandedQuestion(isOpen ? null : idx)}
                        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#F8FAFC] transition-colors">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 text-[#475569] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${typeColor[q.questionType] || 'bg-slate-50 text-slate-700'}`}>
                          {q.questionType}
                        </span>
                        <span className="flex-1 text-sm font-semibold text-[#0F172A] truncate">{q.questionText}</span>
                        <span className="text-xs font-bold text-[#64748B] shrink-0 font-mono">{q.marks} pts</span>
                      </button>

                      {/* Expanded content */}
                      {isOpen && (
                        <div className="px-5 pb-5 space-y-3 border-t border-[#F1F5F9]">
                          <p className="text-sm font-medium text-[#0F172A] leading-relaxed pt-3 whitespace-pre-wrap">{q.questionText}</p>

                          {isMCQ && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {['A', 'B', 'C', 'D'].filter(opt => q[`option${opt}`]).map(opt => {
                                const isCorrect = q.correctAnswer === q[`option${opt}`] || q.correctAnswer === opt;
                                return (
                                  <div key={opt} className={`flex items-start gap-2 px-3 py-2 rounded-xl text-sm border ${isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold' : 'border-[#E2E8F0] text-[#475569]'}`}>
                                    <span className={`shrink-0 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>{opt}</span>
                                    {q[`option${opt}`]}
                                    {isCorrect && <CheckCircle2 size={14} className="ml-auto text-emerald-500 shrink-0 mt-0.5" />}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {hasAnswer && !isMCQ && q.correctAnswer && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                              <span className="text-xs font-bold text-emerald-700 block mb-0.5">
                                {q.questionType === 'DESCRIPTIVE' ? 'Model Answer' : 'Correct Answer'}
                              </span>
                              <span className="text-sm text-emerald-800 font-semibold">{q.correctAnswer}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TestDetails;
