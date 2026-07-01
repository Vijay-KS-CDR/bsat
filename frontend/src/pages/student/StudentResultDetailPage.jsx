import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, CheckCircle2, XCircle, Clock, Percent } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PageHeader from '../../components/dashboard/PageHeader';
import LoadingSkeleton from '../../components/dashboard/LoadingSkeleton';
import { getStudentResultById } from '../../api/studentPortalApi';

const StudentResultDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStudentResultById(id)
      .then(setResult)
      .catch(() => {
        toast.error('Result not found.');
        navigate('/student/results');
      })
      .finally(() => setIsLoading(false));
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded-md animate-pulse" />
        <LoadingSkeleton />
      </div>
    );
  }

  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto pb-12 space-y-6"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate('/student/results')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] hover:text-[#2563EB] transition-colors"
      >
        <ArrowLeft size={16} /> Back to My Results
      </button>

      {/* Page Header */}
      <PageHeader
        title="Result Performance Details"
        subtitle={`Detailed breakdown for ${result.testName}`}
      />

      {/* Main Score Card & Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Circle Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-4">Your Score</span>
          <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-8 border-[#F8FAFC]">
            {/* Simple colored ring wrapper depending on performance */}
            <div className="absolute inset-0 rounded-full border-8 border-t-[#2563EB] border-r-[#2563EB] border-b-[#E2E8F0] border-l-[#E2E8F0]" />
            <div className="text-center z-10">
              <span className="text-4xl font-extrabold text-[#0F172A] font-mono">{result.marksObtained}</span>
              <span className="text-sm text-[#64748B] block mt-0.5">/ {result.totalMarks} Marks</span>
            </div>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mt-6 bg-[#2563EB]/10 text-[#2563EB]`}>
            Grade {result.grade}
          </span>
        </div>

        {/* Detailed Stats Cards */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Percentage Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-5 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-[#2563EB]/10 text-[#2563EB] rounded-xl">
              <Percent size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Percentage</span>
              <h4 className="text-2xl font-bold text-[#0F172A] mt-1 font-mono">{result.percentage.toFixed(1)}%</h4>
              <p className="text-xs text-[#64748B] mt-1">Accuracy level achieved in test</p>
            </div>
          </div>

          {/* Correct Answers Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-5 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-[#16A34A]/10 text-[#16A34A] rounded-xl">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Correct Answers</span>
              <h4 className="text-2xl font-bold text-[#16A34A] mt-1 font-mono">{result.correctAnswers}</h4>
              <p className="text-xs text-[#64748B] mt-1">Total correct questions</p>
            </div>
          </div>

          {/* Wrong Answers Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-5 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-[#DC2626]/10 text-[#DC2626] rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Wrong Answers</span>
              <h4 className="text-2xl font-bold text-[#DC2626] mt-1 font-mono">{result.wrongAnswers}</h4>
              <p className="text-xs text-[#64748B] mt-1">Incorrectly answered questions</p>
            </div>
          </div>

          {/* Time Taken Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-5 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-[#F59E0B]/10 text-[#F59E0B] rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Time Taken</span>
              <h4 className="text-2xl font-bold text-[#0F172A] mt-1 font-mono">{result.timeTaken} min</h4>
              <p className="text-xs text-[#64748B] mt-1">Total time spent solving the test</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Section Score Breakdown */}
      {result.subjectBreakdown && Object.keys(result.subjectBreakdown).length > 0 && (
        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#0F172A] mb-4">Subject-wise Performance Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(result.subjectBreakdown).map(([subjectName, score]) => (
              <div key={subjectName} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 text-center">
                <span className="block text-xs font-bold text-[#64748B] uppercase tracking-wider">{subjectName}</span>
                <span className="block text-2xl font-black text-[#2563EB] font-mono mt-1.5">{score}</span>
                <span className="block text-[10px] font-semibold text-[#64748B] mt-0.5">Marks Obtained</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional details */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#0F172A] mb-4">Test Performance Overview</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-[#F1F5F9]">
            <span className="text-sm text-[#64748B] font-medium">Subject</span>
            <span className="text-sm font-semibold text-[#0F172A]">{result.subject}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#F1F5F9]">
            <span className="text-sm text-[#64748B] font-medium">Completion Date</span>
            <span className="text-sm font-semibold text-[#0F172A]">{result.completedDate}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#F1F5F9]">
            <span className="text-sm text-[#64748B] font-medium">Unattempted Questions</span>
            <span className="text-sm font-semibold text-[#0F172A]">{result.unattempted}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => navigate(`/student/results/${result.attemptId}/review`)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-[16px] hover:bg-[#1D4ED8] transition-all shadow-sm hover:shadow-md cursor-pointer text-sm"
        >
          View Detailed Answer Review
        </button>
      </div>
    </motion.div>
  );
};

export default StudentResultDetailPage;
