import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  FileQuestion,
  Star,
  BookOpen,
  PlayCircle,
  Info,
  CalendarDays,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { getStudentTestById } from '../../api/studentPortalApi';

const DetailRow = ({ icon: Icon, label, value }) => (
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

const StudentTestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStudentTestById(id)
      .then(setTest)
      .catch(() => {
        toast.error('Test not found.');
        navigate('/student/tests');
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 rounded-md" />
        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!test) return null;

  const isAssigned = test.status === 'ASSIGNED';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto pb-12 space-y-6"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate('/student/tests')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] hover:text-[#2563EB] transition-colors"
      >
        <ArrowLeft size={16} /> Back to My Tests
      </button>

      {/* Header Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-[#0F172A] leading-tight">{test.testName}</h1>
            <p className="text-sm text-[#64748B] mt-1">{test.subject}</p>
          </div>
          <StatusBadge status={test.status} />
        </div>

        {/* Detail Rows */}
        <div className="mt-6">
          <DetailRow icon={BookOpen} label="Subject" value={test.subject} />
          <DetailRow icon={Clock} label="Duration" value={`${test.duration} minutes`} />
          <DetailRow icon={FileQuestion} label="Total Questions" value={test.totalQuestions} />
          <DetailRow icon={Star} label="Total Marks" value={test.totalMarks} />
          <DetailRow icon={CalendarDays} label="Due Date" value={test.dueDate} />
          {test.completedDate && (
            <DetailRow icon={CalendarDays} label="Completed On" value={test.completedDate} />
          )}
        </div>
      </div>

      {/* Instructions Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm">
        <h2 className="text-base font-bold text-[#0F172A] mb-4 flex items-center gap-2">
          <Info size={18} className="text-[#2563EB]" /> Instructions
        </h2>
        <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]">
          <p className="text-sm text-[#64748B] leading-relaxed">{test.instructions}</p>
        </div>

        {/* General Guidelines */}
        <ul className="mt-4 space-y-2">
          {[
            'Ensure you have a stable internet connection before starting.',
            'Do not refresh or navigate away during the test.',
            'Each question must be answered before moving to the next.',
            'The test will auto-submit when the time expires.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-[#64748B]">
              <span className="mt-0.5 w-4 h-4 rounded-full bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center text-[10px] font-bold shrink-0">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Start Test Button (only for ASSIGNED) */}
      {isAssigned && (
        <div className="flex justify-end">
          <button
            onClick={() => navigate(`/student/tests/${id}/instructions`)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-[16px] hover:bg-[#1D4ED8] transition-all shadow-sm hover:shadow-md"
          >
            <PlayCircle size={20} /> Start Test
          </button>
        </div>
      )}

      {test.status === 'COMPLETED' && (
        <div className="flex justify-end">
          <button
            onClick={() => navigate(`/student/results/${id}`)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#16A34A] text-white font-semibold rounded-[16px] hover:bg-[#15803D] transition-all shadow-sm hover:shadow-md"
          >
            View Result
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default StudentTestDetailPage;
