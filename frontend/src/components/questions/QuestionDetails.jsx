import React from 'react';
import { ArrowLeft, HelpCircle, Calendar, Edit2, CheckCircle2, Award, BookOpen, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import StatusBadge from '../dashboard/StatusBadge';

const QuestionDetails = ({ question, onBack, onEdit }) => {
  if (!question) return null;

  const getTypeLabel = (type) => {
    switch (type) {
      case 'MCQ': return 'Multiple Choice Question';
      case 'ONE_WORD': return 'One Word Answer';
      case 'NUMERICAL': return 'Numerical Value Answer';
      case 'DESCRIPTIVE': return 'Descriptive Question';
      default: return type || 'N/A';
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy': return 'bg-emerald-500 text-white';
      case 'Medium': return 'bg-amber-500 text-white';
      case 'Hard': return 'bg-rose-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Back Control bar */}
      <div className="flex items-center justify-between pb-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Question Bank
        </button>

        <button
          onClick={() => onEdit(question.id)}
          className="inline-flex items-center gap-2 px-4.5 py-2.5 bg-[#2563EB] text-white font-semibold text-sm rounded-xl hover:bg-[#1D4ED8] transition-all shadow-2xs cursor-pointer"
        >
          <Edit2 size={16} /> Edit Question
        </button>
      </div>

      {/* Profile Card Container */}
      <div className="bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm overflow-hidden flex flex-col">
        {/* Top Banner Header */}
        <div className="relative bg-gradient-to-r from-[#2563EB] to-[#1E40AF] p-8 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/10 text-white border border-white/20 flex items-center justify-center shrink-0">
                <HelpCircle size={36} className="stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs">
                    {question.subject}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                  <div className="bg-white/90 px-1 rounded-full">
                    <StatusBadge status={question.status} />
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">{question.topic}</h2>
                <p className="text-blue-100 text-xs flex items-center gap-2 pt-1">
                  <Calendar size={13} /> Created Date: {question.createdDate || '2024-01-15'} • ID #{question.id}
                </p>
              </div>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center min-w-[120px]">
              <span className="block text-xs uppercase tracking-wider text-blue-200 font-semibold">Marks</span>
              <span className="text-3xl font-black text-white font-mono mt-0.5 block">{question.marks}</span>
            </div>
          </div>
        </div>

        {/* Question Details Body */}
        <div className="p-8 space-y-8 bg-[#F8FAFC]">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs flex items-center gap-3.5">
              <div className="p-3 bg-blue-50 text-[#2563EB] rounded-xl shrink-0">
                <BookOpen size={20} />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#64748B] block uppercase tracking-wider">Subject</span>
                <span className="text-sm font-bold text-[#0F172A]">{question.subject}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs flex items-center gap-3.5">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                <Layers size={20} />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#64748B] block uppercase tracking-wider">Question Type</span>
                <span className="text-sm font-bold text-[#0F172A]">{getTypeLabel(question.questionType)}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs flex items-center gap-3.5">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                <Award size={20} />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#64748B] block uppercase tracking-wider">Assigned Marks</span>
                <span className="text-sm font-bold text-[#0F172A] font-mono">{question.marks} Points</span>
              </div>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Question Statement</h3>
            <p className="text-base sm:text-lg font-medium text-[#0F172A] leading-relaxed whitespace-pre-wrap">
              {question.questionText}
            </p>
          </div>

          {/* Options Section if MCQ */}
          {question.questionType === 'MCQ' && question.options && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Multiple Choice Options</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['A', 'B', 'C', 'D'].map((opt) => {
                  const isCorrect = question.correctAnswer === opt;
                  return (
                    <div
                      key={opt}
                      className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                        isCorrect
                          ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-lg font-mono font-bold text-sm flex items-center justify-center shrink-0 ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-white text-[#64748B] border border-slate-300'
                          }`}
                        >
                          {opt}
                        </span>
                        <span className={`text-sm font-medium ${isCorrect ? 'text-emerald-950 font-bold' : 'text-[#0F172A]'}`}>
                          {question.options[opt]}
                        </span>
                      </div>
                      {isCorrect && (
                        <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md shrink-0">
                          <CheckCircle2 size={14} /> Correct Answer
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Correct Answer Section for ONE_WORD or NUMERICAL */}
          {(question.questionType === 'ONE_WORD' || question.questionType === 'NUMERICAL') && (
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 shadow-2xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-emerald-600 text-white rounded-xl shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                    Expected {question.questionType === 'NUMERICAL' ? 'Numerical' : 'One Word'} Correct Answer
                  </span>
                  <span className="text-xl font-extrabold text-emerald-950 font-mono mt-0.5 block">
                    {question.correctAnswer}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Descriptive Note */}
          {question.questionType === 'DESCRIPTIVE' && (
            <div className="bg-violet-50 p-6 rounded-2xl border border-violet-200 shadow-2xs flex items-center gap-4 text-violet-900">
              <HelpCircle size={24} className="text-violet-600 shrink-0" />
              <div className="text-sm leading-relaxed">
                <strong className="font-bold block mb-0.5">Descriptive Evaluation Rule</strong>
                This question requires manual grading by the teacher or evaluator during assessment scoring. No automated exact-match answer key is assigned.
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionDetails;
