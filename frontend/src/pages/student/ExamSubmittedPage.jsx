import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, LayoutDashboard, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ExamSubmittedPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Get current timestamp formatted nicely
  const submissionTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }) + ' on ' + new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
        className="max-w-md w-full bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-md text-center space-y-6"
      >
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center p-4 bg-[#16A34A]/10 text-[#16A34A] rounded-full">
          <CheckCircle2 size={48} className="stroke-[1.5]" />
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Exam Submitted!</h1>
          <p className="text-sm text-[#64748B]">Your answers have been securely submitted and logged in the system.</p>
        </div>

        {/* Metadata Details Box */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 text-left text-xs space-y-2.5 font-medium">
          <div className="flex justify-between border-b border-[#F1F5F9] pb-2">
            <span className="text-[#64748B]">Assessment:</span>
            <span className="text-[#0F172A] font-bold">Online Test #{id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Submission Time:</span>
            <span className="text-[#0f172a] font-bold font-mono text-[10px]">{submissionTime}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm rounded-xl transition-all shadow-xs hover:shadow-sm cursor-pointer"
          >
            <LayoutDashboard size={16} /> Go to Dashboard <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ExamSubmittedPage;
