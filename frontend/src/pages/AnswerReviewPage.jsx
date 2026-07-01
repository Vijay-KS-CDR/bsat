import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, XCircle, AlertCircle, Save, Check, Award, 
  HelpCircle, MessageSquare, BookOpen, User 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import LoadingSkeleton from '../components/dashboard/LoadingSkeleton';
import { getEvaluationsByAttempt, evaluateDescriptiveAnswer, finalizeAttempt } from '../api/evaluationApi';

const AnswerReviewPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);
  
  // Scoring state for selected descriptive question
  const [scoreInput, setScoreInput] = useState('');
  const [remarksInput, setRemarksInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAnswers = async () => {
    setIsLoading(true);
    try {
      const data = await getEvaluationsByAttempt(attemptId);
      setAnswers(data || []);
      if (data && data.length > 0) {
        setSelectedIdx(0);
      }
    } catch (error) {
      console.error('Failed to load attempt answers:', error);
      toast.error('Failed to load student responses.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnswers();
  }, [attemptId]);

  const selectedAnswer = answers[selectedIdx];

  // Sync inputs when selected question changes
  useEffect(() => {
    if (selectedAnswer) {
      setScoreInput(selectedAnswer.marksAwarded !== null ? String(selectedAnswer.marksAwarded) : '');
      setRemarksInput(selectedAnswer.remarks || '');
    }
  }, [selectedAnswer]);

  const isFinalized = useMemo(() => {
    // If we can check if results has COMPLETED, or if all items are EVALUATED
    // We will check if the finalize endpoint fails or succeeds, but we can verify if any pending items exist
    return false; // Dynamic calculation done by backend
  }, [answers]);

  const pendingDescriptiveCount = useMemo(() => {
    return answers.filter(ans => ans.questionType === 'DESCRIPTIVE' && ans.status === 'PENDING_REVIEW').length;
  }, [answers]);

  const handleSaveScore = async () => {
    if (!selectedAnswer) return;
    
    const parsedScore = parseFloat(scoreInput);
    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > selectedAnswer.maxMarks) {
      toast.error(`Please award a score between 0 and maximum marks: ${selectedAnswer.maxMarks}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await evaluateDescriptiveAnswer(selectedAnswer.id, parsedScore, remarksInput);
      toast.success('Response score recorded successfully.');
      
      // Update local answers list
      setAnswers(prev => prev.map(ans => ans.id === selectedAnswer.id ? updated : ans));
    } catch (error) {
      console.error('Failed to save manual evaluation:', error);
      toast.error(error.response?.data || 'Failed to record manual evaluation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalize = async () => {
    if (pendingDescriptiveCount > 0) {
      toast.error(`Cannot finalize. ${pendingDescriptiveCount} descriptive response(s) are still pending evaluation.`);
      return;
    }

    try {
      await finalizeAttempt(attemptId);
      toast.success('Attempt evaluation finalized successfully!');
      navigate('/evaluations');
    } catch (error) {
      console.error('Failed to finalize attempt evaluation:', error);
      toast.error(error.response?.data || 'Failed to finalize evaluation.');
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  if (answers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center px-4">
        <AlertCircle size={48} className="text-[#DC2626] mb-4" />
        <h3 className="text-xl font-bold text-[#0F172A]">No submissions found</h3>
        <p className="text-sm text-[#64748B] mt-2">Could not find any student answers for this attempt ID.</p>
        <button onClick={() => navigate('/evaluations')} className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] px-4 py-2 rounded-xl transition-colors cursor-pointer">
          <ArrowLeft size={14} /> Back to dashboard
        </button>
      </div>
    );
  }

  // Student and Test Meta
  const studentName = answers[0]?.studentName || 'Student';
  const testName = answers[0]?.testName || 'Test Assessment';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none h-[calc(100vh-140px)] flex flex-col">
      {/* Upper header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 shrink-0 bg-white p-5 border border-[#E2E8F0] rounded-[16px] shadow-2xs">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/evaluations')}
            className="p-2 border border-[#E2E8F0] hover:bg-slate-50 text-[#64748B] hover:text-[#0F172A] rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-lg font-black text-[#0F172A] tracking-tight">{testName}</h2>
            <p className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5">
              <User size={12} className="text-[#2563EB]" /> Evaluated Candidate: <span className="font-semibold text-[#0F172A]">{studentName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {pendingDescriptiveCount > 0 ? (
            <span className="text-xs font-semibold text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20 px-3 py-1.5 rounded-full flex items-center gap-1">
              <AlertCircle size={12} /> {pendingDescriptiveCount} Pending Question{pendingDescriptiveCount !== 1 ? 's' : ''}
            </span>
          ) : (
            <span className="text-xs font-semibold text-[#16A34A] bg-[#16A34A]/10 border border-[#16A34A]/20 px-3 py-1.5 rounded-full flex items-center gap-1">
              <CheckCircle size={12} /> Ready to Finalize
            </span>
          )}

          <button
            onClick={handleFinalize}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl transition-colors cursor-pointer shadow-xs ${
              pendingDescriptiveCount > 0
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-[#16A34A] hover:bg-[#15803D]'
            }`}
            disabled={pendingDescriptiveCount > 0}
          >
            <Check size={14} /> Finalize Results
          </button>
        </div>
      </div>

      {/* Main split viewport container */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        
        {/* Left Side: Question List Navigation */}
        <div className="w-80 shrink-0 bg-white border border-[#E2E8F0] rounded-[16px] flex flex-col overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Exam Submissions</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {answers.map((ans, idx) => {
              const isSelected = selectedIdx === idx;
              const isDescriptive = ans.questionType === 'DESCRIPTIVE';
              const isPending = isDescriptive && ans.status === 'PENDING_REVIEW';
              
              return (
                <button
                  key={ans.id}
                  onClick={() => setSelectedIdx(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
                    isSelected 
                      ? 'bg-[#2563EB]/10 border-[#2563EB] text-[#2563EB]'
                      : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569]'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-bold tracking-tight text-[#64748B]">Q. {idx + 1}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isPending 
                        ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20'
                        : isDescriptive
                        ? 'bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20'
                        : ans.isCorrect
                        ? 'bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20'
                        : 'bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20'
                    }`}>
                      {isPending ? 'Pending' : isDescriptive ? `${ans.marksAwarded}/${ans.maxMarks} M` : ans.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  
                  <p className="text-xs line-clamp-2 leading-relaxed text-[#0F172A] font-medium">
                    {ans.questionText}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detailed Question Review & Grade Panel */}
        <div className="flex-1 bg-white border border-[#E2E8F0] rounded-[16px] flex flex-col overflow-hidden shadow-2xs p-6 overflow-y-auto space-y-6">
          {selectedAnswer && (
            <>
              {/* Question Header Card */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                    <BookOpen size={14} className="text-[#2563EB]" /> Question Details ({selectedAnswer.questionType})
                  </span>
                  <span className="text-xs font-extrabold text-[#0F172A]">
                    Maximum Marks: <span className="text-[#2563EB]">{selectedAnswer.maxMarks}</span>
                  </span>
                </div>
                
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4.5">
                  <p className="text-sm font-semibold text-[#0F172A] whitespace-pre-wrap leading-relaxed select-text">
                    {selectedAnswer.questionText}
                  </p>
                </div>
              </div>

              {/* Student Response Card */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Student Answer</h4>
                <div className="bg-[#2563EB]/5 border border-[#2563EB]/15 rounded-xl p-4.5">
                  <p className="text-sm text-[#0F172A] whitespace-pre-wrap leading-relaxed font-mono select-text">
                    {selectedAnswer.studentAnswer || <span className="italic text-[#64748B]">No response submitted</span>}
                  </p>
                </div>
              </div>

              {/* Model Answer Keys (Standard solutions) */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1">
                  <HelpCircle size={13} /> Model / Correct Answer Key
                </h4>
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4.5">
                  <p className="text-sm text-emerald-800 whitespace-pre-wrap leading-relaxed font-semibold font-mono select-text">
                    {selectedAnswer.correctAnswer || <span className="italic text-emerald-600">Model answer key not loaded</span>}
                  </p>
                </div>
              </div>

              {/* Marks assignment panel */}
              {selectedAnswer.questionType === 'DESCRIPTIVE' ? (
                <div className="bg-slate-50 border border-[#E2E8F0] rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5 pb-2 border-b border-[#E2E8F0]">
                    <Award size={14} className="text-[#2563EB]" /> Manual Grading Scorecard
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#64748B] uppercase mb-1.5">Award Marks *</label>
                      <input 
                        type="number"
                        step="0.5"
                        min="0"
                        max={selectedAnswer.maxMarks}
                        value={scoreInput}
                        onChange={(e) => setScoreInput(e.target.value)}
                        placeholder={`Award score (0 - ${selectedAnswer.maxMarks})`}
                        className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#2563EB] font-bold font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#64748B] uppercase mb-1.5">Teacher Remarks</label>
                      <input 
                        type="text"
                        value={remarksInput}
                        onChange={(e) => setRemarksInput(e.target.value)}
                        placeholder="Add feedback remarks..."
                        className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSaveScore}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <Save size={13} /> {isSubmitting ? 'Saving...' : 'Record Evaluation'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Auto-evaluated read-only details */
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedAnswer.isCorrect ? (
                      <CheckCircle size={36} className="text-[#16A34A] shrink-0" />
                    ) : (
                      <XCircle size={36} className="text-[#DC2626] shrink-0" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A]">Automatically Evaluated</h4>
                      <p className="text-xs text-[#64748B]">This question type is auto-scored by the evaluation engine.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold block ${selectedAnswer.isCorrect ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                      {selectedAnswer.isCorrect ? 'Awarded Full Marks' : 'Awarded Zero Marks'}
                    </span>
                    <span className="text-xs font-extrabold text-[#0F172A] mt-0.5 block font-mono">
                      {selectedAnswer.marksAwarded} / {selectedAnswer.maxMarks} Marks
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default AnswerReviewPage;
