import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, FileQuestion, Star, BookOpen, PlayCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getStudentTestById } from '../../api/studentPortalApi';

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 py-3 border-b border-[#F1F5F9] last:border-0">
    <div className="p-2 bg-[#F8FAFC] rounded-lg shrink-0">
      <Icon size={16} className="text-[#2563EB]" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-[#64748B] font-medium">{label}</p>
      <p className="text-sm font-semibold text-[#0F172A] mt-0.5">{value}</p>
    </div>
  </div>
);

const ExamInstructionsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStudentTestById(id)
      .then((data) => {
        if (data.status === 'COMPLETED') {
          toast.warning('You have already completed this exam.');
          navigate(`/student/tests/${id}`);
          return;
        }
        setTest(data);
      })
      .catch(() => {
        toast.error('Test details could not be loaded.');
        navigate('/student/tests');
      })
      .finally(() => setIsLoading(false));
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 rounded-md" />
        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!test) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto pb-12 space-y-6 font-sans"
    >
      {/* Back Link */}
      <button
        onClick={() => navigate(`/student/tests/${id}`)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] hover:text-[#2563EB] transition-colors"
      >
        <ArrowLeft size={16} /> Back to Test Details
      </button>

      {/* Summary Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#0F172A] leading-tight">{test.testName}</h1>
        <p className="text-sm text-[#64748B] mt-1">{test.subject}</p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <DetailItem icon={BookOpen} label="Subject" value={test.subject} />
          <DetailItem icon={Clock} label="Duration" value={`${test.duration} min`} />
          <DetailItem icon={FileQuestion} label="Questions" value={test.totalQuestions} />
          <DetailItem icon={Star} label="Total Marks" value={test.totalMarks} />
        </div>
      </div>

      {/* Instructions Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm">
        <h2 className="text-base font-bold text-[#0F172A] mb-4 flex items-center gap-2">
          <Info size={18} className="text-[#2563EB]" /> Exam Instructions
        </h2>
        <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] text-sm text-[#475569] leading-relaxed whitespace-pre-wrap">
          {test.instructions || 'No specific instructions provided for this test.'}
        </div>

        {/* Dynamic Guidelines List */}
        <div className="mt-6">
          <h3 className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-3">General Rules:</h3>
          <ul className="space-y-3">
            {[
              'Once you click "Start Exam", the countdown timer will begin immediately.',
              'Ensure you have a reliable network connection. Do not refresh or exit the browser tab.',
              'Make sure to click "Save Answer" for every question you answer or edit.',
              'The exam will automatically submit the moment the countdown timer reaches zero.',
            ].map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-[#64748B]">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center text-[10px] font-bold shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-normal">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => navigate(`/student/tests/${id}/exam`)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-[16px] hover:bg-[#1D4ED8] transition-all shadow-sm hover:shadow-md cursor-pointer"
        >
          <PlayCircle size={20} /> Start Exam
        </button>
      </div>
    </motion.div>
  );
};

export default ExamInstructionsPage;
