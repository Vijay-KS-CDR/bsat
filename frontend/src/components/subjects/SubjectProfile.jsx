import React from 'react';
import { ArrowLeft, BookOpen, Shield, Calendar, Edit2, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import StatusBadge from '../dashboard/StatusBadge';

const SubjectProfile = ({ subject, onBack, onEdit }) => {
  if (!subject) return null;

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
          <ArrowLeft size={16} /> Back to Subject List
        </button>

        <button
          onClick={() => onEdit(subject.id)}
          className="inline-flex items-center gap-2 px-4.5 py-2.5 bg-[#2563EB] text-white font-semibold text-sm rounded-xl hover:bg-[#1D4ED8] transition-all shadow-2xs cursor-pointer"
        >
          <Edit2 size={16} /> Edit Subject
        </button>
      </div>

      {/* Profile Card Container */}
      <div className="bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm overflow-hidden flex flex-col">
        {/* Top Banner Profile Header */}
        <div className="relative bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] p-8 text-white">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/10 text-white border border-white/20 flex items-center justify-center shrink-0">
              <Bookmark size={40} className="stroke-[1.5]" />
            </div>
            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{subject.name}</h2>
                <div className="bg-white/90 px-1 rounded-full">
                  <StatusBadge status={subject.status} />
                </div>
              </div>
              <p className="text-blue-100 font-mono text-sm tracking-wide">
                Subject Code: {subject.subjectCode} • ID #{subject.id}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-2 text-xs text-blue-200">
                <Calendar size={14} /> Created Date: {subject.createdDate || '2024-01-10'}
              </div>
            </div>
          </div>
        </div>

        {/* Cards Details Grid */}
        <div className="p-8 space-y-6 bg-[#F8FAFC]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Subject Information */}
            <div className="bg-white p-6 rounded-[16px] border border-[#E2E8F0] shadow-2xs space-y-4 md:col-span-2">
              <h4 className="flex items-center gap-2 text-sm font-bold text-[#2563EB] uppercase tracking-wider pb-3 border-b border-[#E2E8F0]">
                <BookOpen size={16} /> Subject Information
              </h4>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between md:block md:space-y-1">
                    <span className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">Subject Name</span>
                    <span className="font-bold text-[#0F172A] block text-base">{subject.name}</span>
                  </div>
                  <div className="flex justify-between md:block md:space-y-1">
                    <span className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">Subject Code</span>
                    <span className="font-mono font-bold text-[#2563EB] block text-base">{subject.subjectCode}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <span className="text-[#64748B] text-xs font-semibold uppercase tracking-wider block mb-1">Description / Syllabus</span>
                  <span className="text-[#0F172A] block leading-relaxed bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl font-medium">
                    {subject.description}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Account Information */}
            <div className="bg-white p-6 rounded-[16px] border border-[#E2E8F0] shadow-2xs space-y-4 md:col-span-2">
              <h4 className="flex items-center gap-2 text-sm font-bold text-[#2563EB] uppercase tracking-wider pb-3 border-b border-[#E2E8F0]">
                <Shield size={16} /> Status & History
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Active Status</span>
                  <StatusBadge status={subject.status} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Creation Date</span>
                  <span className="font-semibold text-[#0F172A] font-mono">{subject.createdDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SubjectProfile;
