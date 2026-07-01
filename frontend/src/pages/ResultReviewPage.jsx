import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, HelpCircle, BookOpen, Clock, Award, Percent, AlertCircle, Lock, AlertTriangle, ShieldAlert, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '../components/dashboard/PageHeader';
import StatsCard from '../components/dashboard/StatsCard';
import EmptyState from '../components/dashboard/EmptyState';
import LoadingSkeleton from '../components/dashboard/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';
import { getReview } from '../api/resultReviewApi';



const ResultReviewPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, CORRECT, WRONG, SKIPPED
  const [reviewData, setReviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getReview(attemptId)
      .then((data) => {
        setReviewData(data);
      })
      .catch((err) => {
        console.error("Failed to fetch review from backend:", err);
        const status = err.response?.status;
        const msg = err.response?.data?.message || err.message;
        
        if (status === 401) {
          setError({
            title: "Unauthorized Access",
            message: "Please log in to view this exam review.",
            icon: Lock
          });
        } else if (status === 403) {
          setError({
            title: "Access Denied",
            message: msg || "You are not authorized to view another student's exam review.",
            icon: ShieldAlert
          });
        } else if (status === 404) {
          setError({
            title: "Attempt Not Found",
            message: msg || "The requested exam attempt review does not exist.",
            icon: Search
          });
        } else if (status === 400) {
          setError({
            title: "Incomplete Review Request",
            message: msg || "Review is available only for completed attempts.",
            icon: AlertTriangle
          });
        } else {
          setError({
            title: "Failed to load exam review",
            message: msg || "An unexpected error occurred while loading this review.",
            icon: AlertCircle
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [attemptId]);

  const stats = useMemo(() => {
    if (!reviewData) return { accuracy: 0, correct: 0, wrong: 0, skipped: 0 };
    const accuracy = reviewData.totalMarks > 0 
      ? Math.round((reviewData.obtainedMarks / reviewData.totalMarks) * 100)
      : 0;
    return {
      accuracy,
      correct: reviewData.correctAnswers,
      wrong: reviewData.wrongAnswers,
      skipped: reviewData.skippedAnswers || 0
    };
  }, [reviewData]);

  const filteredQuestions = useMemo(() => {
    if (!reviewData) return [];
    if (activeFilter === 'ALL') return reviewData.questions || [];
    return (reviewData.questions || []).filter(q => q.status === activeFilter);
  }, [reviewData, activeFilter]);

  const backPath = user?.role === 'STUDENT' ? '/student/results' : '/results';

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pt-6">
        <button
          onClick={() => navigate(backPath)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] hover:text-[#2563EB] transition-colors"
        >
          <ArrowLeft size={16} /> Back to Results
        </button>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pt-6">
        <button
          onClick={() => navigate(backPath)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] hover:text-[#2563EB] transition-colors"
        >
          <ArrowLeft size={16} /> Back to Results
        </button>
        <EmptyState
          icon={error.icon}
          title={error.title}
          description={error.message}
          buttonText="Back to Results"
          onAddStudent={() => navigate(backPath)}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto pb-16 space-y-6 font-sans select-none"
    >
      {/* Back navigation link */}
      <button
        onClick={() => navigate(backPath)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] hover:text-[#2563EB] transition-colors"
      >
        <ArrowLeft size={16} /> Back to Results
      </button>

      {/* Header section */}
      <PageHeader
        title="Detailed Answer Review"
        subtitle={`Reviewing responses for ${reviewData.testName}`}
      />

      {/* Result Summary Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-3 mb-4 flex items-center gap-2">
          <Award size={18} className="text-[#2563EB]" />
          Assessment Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">Subject</span>
            <span className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
              <BookOpen size={14} className="text-[#64748B]" />
              {reviewData.subject}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">Score Summary</span>
            <span className="text-sm font-black text-[#2563EB] font-mono">
              {reviewData.obtainedMarks} / {reviewData.totalMarks} Marks
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">Scored Percentage</span>
            <span className={`text-sm font-black font-mono ${reviewData.percentage >= 60 ? 'text-[#16A34A]' : (reviewData.percentage >= 40 ? 'text-[#F59E0B]' : 'text-[#DC2626]')}`}>
              {reviewData.percentage}%
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">Submitted On</span>
            <span className="text-sm font-bold text-[#475569] flex items-center gap-1.5 font-mono text-[11px]">
              <Clock size={13} className="text-[#64748B]" />
              {reviewData.submittedAt ? new Date(reviewData.submittedAt).toLocaleString() : reviewData.submittedTime}
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Section Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard
          icon={CheckCircle2}
          title="Correct Answers"
          value={stats.correct}
          description="Questions scored successfully"
          colorClass="text-[#16A34A]"
          bgClass="bg-[#16A34A]/10"
        />
        <StatsCard
          icon={XCircle}
          title="Wrong Answers"
          value={stats.wrong}
          description="Questions with incorrect answers"
          colorClass="text-[#DC2626]"
          bgClass="bg-[#DC2626]/10"
        />
        <StatsCard
          icon={Percent}
          title="Accuracy Rate"
          value={`${stats.accuracy}%`}
          description="Percentage of obtained marks"
          colorClass="text-[#2563EB]"
          bgClass="bg-[#2563EB]/10"
        />
      </div>

      {/* Filter Tabs Toolbar */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm overflow-hidden p-3.5 flex flex-wrap items-center gap-2">
        {[
          { key: 'ALL', label: 'All Questions', count: reviewData.questions.length, bg: 'bg-[#2563EB]/10 text-[#2563EB]', activeBg: 'bg-[#2563EB] text-white' },
          { key: 'CORRECT', label: 'Correct', count: stats.correct, bg: 'bg-[#16A34A]/10 text-[#16A34A]', activeBg: 'bg-[#16A34A] text-white' },
          { key: 'WRONG', label: 'Wrong', count: stats.wrong, bg: 'bg-[#DC2626]/10 text-[#DC2626]', activeBg: 'bg-[#DC2626] text-white' },
          { key: 'SKIPPED', label: 'Skipped', count: stats.skipped, bg: 'bg-[#64748B]/10 text-[#64748B]', activeBg: 'bg-[#64748B] text-white' }
        ].map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive ? tab.activeBg : 'bg-slate-50 hover:bg-slate-100 text-[#475569] border border-[#E2E8F0]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isActive ? 'bg-white/20 text-white' : tab.bg}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Question Cards List */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <EmptyState
            icon={HelpCircle}
            title={`No ${activeFilter.toLowerCase()} questions`}
            description={`There are no questions in this exam attempt matching the "${activeFilter.toLowerCase()}" filter status.`}
          />
        ) : (
          filteredQuestions.map((q, index) => {
            const isCorrect = q.status === 'CORRECT';
            const isWrong = q.status === 'WRONG';
            const isSkipped = q.status === 'SKIPPED';

            let statusBadge = (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#64748B]/10 text-[#64748B] border border-[#64748B]/20">
                SKIPPED
              </span>
            );
            let highlightBorder = "border-[#E2E8F0]";

            if (isCorrect) {
              statusBadge = (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20">
                  CORRECT
                </span>
              );
              highlightBorder = "border-l-4 border-l-[#16A34A] border-[#E2E8F0]";
            } else if (isWrong) {
              statusBadge = (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20">
                  WRONG
                </span>
              );
              highlightBorder = "border-l-4 border-l-[#DC2626] border-[#E2E8F0]";
            }

            return (
              <div
                key={q.questionId || q.id}
                className={`bg-white border rounded-[16px] p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow duration-200 ${highlightBorder}`}
              >
                {/* Question Info Row */}
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-50 border border-[#E2E8F0] font-black text-xs text-[#0F172A] flex items-center justify-center font-mono">
                      {q.questionNumber || index + 1}
                    </span>
                    <span className="text-[10px] font-black tracking-wider uppercase bg-slate-100 text-[#64748B] px-2 py-0.5 rounded border border-slate-200">
                      {q.questionType}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#64748B]">
                      Marks: <span className={`font-black ${isCorrect ? 'text-[#16A34A]' : (isWrong ? 'text-[#DC2626]' : 'text-[#64748B]')}`}>
                        {isCorrect ? `+${q.marksAwarded}` : q.marksAwarded}
                      </span>{q.maxMarks ? ` / ${q.maxMarks}` : ''}
                    </span>
                    {statusBadge}
                  </div>
                </div>

                {/* Question Text */}
                <p className="text-sm font-semibold text-[#0F172A] leading-relaxed whitespace-pre-wrap">
                  {q.questionText}
                </p>

                {/* MCQ Options Display */}
                {q.questionType === 'MCQ_SINGLE' && q.options && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {q.options.map((opt) => {
                      const isStudentSelected = q.studentAnswer === opt;
                      const isCorrectOpt = q.correctAnswer === opt;
                      
                      let optStyle = "border-[#E2E8F0] bg-white text-[#475569]";
                      let optPrefix = "border-[#CBD5E1] text-[#64748B]";
                      
                      if (isCorrectOpt) {
                        optStyle = "border-[#16A34A] bg-[#16A34A]/5 text-[#16A34A] font-bold";
                        optPrefix = "bg-[#16A34A] border-[#16A34A] text-white";
                      } else if (isStudentSelected && !isCorrectOpt) {
                        optStyle = "border-[#DC2626] bg-[#DC2626]/5 text-[#DC2626] font-bold";
                        optPrefix = "bg-[#DC2626] border-[#DC2626] text-white";
                      }

                      return (
                        <div
                          key={opt}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-xs font-medium ${optStyle}`}
                        >
                          <span className={`w-5 h-5 rounded-full border text-[10px] font-black flex items-center justify-center shrink-0 ${optPrefix}`}>
                            {isCorrectOpt ? '✓' : (isStudentSelected ? '✗' : '')}
                          </span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Answer Comparisons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#F1F5F9] text-xs font-semibold">
                  <div className="p-3.5 bg-slate-50 border border-[#E2E8F0] rounded-xl space-y-1">
                    <span className="text-[#64748B] text-[10px] uppercase tracking-wider font-bold">Response:</span>
                    <span className={`block text-sm font-extrabold ${isCorrect ? 'text-[#16A34A]' : (isWrong ? 'text-[#DC2626]' : 'text-[#64748B] italic')}`}>
                      {isSkipped ? 'No response provided' : q.studentAnswer}
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-[#E2E8F0] rounded-xl space-y-1">
                    <span className="text-[#64748B] text-[10px] uppercase tracking-wider font-bold">Correct Answer:</span>
                    <span className="block text-sm font-extrabold text-[#16A34A]">
                      {q.correctAnswer}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default ResultReviewPage;
