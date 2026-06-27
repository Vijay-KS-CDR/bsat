import React from 'react';
import { ArrowLeft, User, BookOpen, Shield, Calendar, Phone, MapPin, Mail, Key, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import StatusBadge from '../dashboard/StatusBadge';

const TeacherProfile = ({ teacher, onBack, onEdit }) => {
  if (!teacher) return null;

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
          <ArrowLeft size={16} /> Back to Teacher List
        </button>

        <button
          onClick={() => onEdit(teacher.id)}
          className="inline-flex items-center gap-2 px-4.5 py-2.5 bg-[#2563EB] text-white font-semibold text-sm rounded-xl hover:bg-[#1D4ED8] transition-all shadow-2xs cursor-pointer"
        >
          <Edit2 size={16} /> Edit Profile
        </button>
      </div>

      {/* Profile Card Container */}
      <div className="bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm overflow-hidden flex flex-col">
        {/* Top Banner Profile Header */}
        <div className="relative bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] p-8 text-white">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={teacher.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"}
              alt={teacher.name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-lg bg-white shrink-0"
            />
            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{teacher.name}</h2>
                <div className="bg-white/90 px-1 rounded-full">
                  <StatusBadge status={teacher.status} />
                </div>
              </div>
              <p className="text-blue-100 font-mono text-sm tracking-wide">
                Employee ID: {teacher.employeeId} • User ID #{teacher.id}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-2 text-xs text-blue-200">
                <Calendar size={14} /> Created Date: {teacher.createdDate || '2024-01-10'}
              </div>
            </div>
          </div>
        </div>

        {/* Cards Details Grid */}
        <div className="p-8 space-y-6 bg-[#F8FAFC]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Personal Information */}
            <div className="bg-white p-6 rounded-[16px] border border-[#E2E8F0] shadow-2xs space-y-4">
              <h4 className="flex items-center gap-2 text-sm font-bold text-[#2563EB] uppercase tracking-wider pb-3 border-b border-[#E2E8F0]">
                <User size={16} /> Personal Information
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Full Name</span>
                  <span className="font-semibold text-[#0F172A]">{teacher.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Employee ID</span>
                  <span className="font-semibold font-mono text-[#0F172A]">{teacher.employeeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Login ID (Email)</span>
                  <span className="font-semibold font-mono text-[#0F172A]">{teacher.loginId}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Professional Information */}
            <div className="bg-white p-6 rounded-[16px] border border-[#E2E8F0] shadow-2xs space-y-4">
              <h4 className="flex items-center gap-2 text-sm font-bold text-[#2563EB] uppercase tracking-wider pb-3 border-b border-[#E2E8F0]">
                <BookOpen size={16} /> Professional Information
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Qualification</span>
                  <span className="font-bold text-[#0F172A]">{teacher.qualification}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Experience</span>
                  <span className="font-bold text-[#0F172A]">{teacher.experience} Years</span>
                </div>
              </div>
            </div>

            {/* Card 3: Contact Information */}
            <div className="bg-white p-6 rounded-[16px] border border-[#E2E8F0] shadow-2xs space-y-4">
              <h4 className="flex items-center gap-2 text-sm font-bold text-[#2563EB] uppercase tracking-wider pb-3 border-b border-[#E2E8F0]">
                <Phone size={16} /> Contact Information
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B] flex items-center gap-1">
                    <Phone size={14} /> Phone
                  </span>
                  <span className="font-mono font-semibold text-[#0F172A]">{teacher.phone}</span>
                </div>
                <div className="pt-1">
                  <span className="text-[#64748B] block mb-1 flex items-center gap-1">
                    <MapPin size={14} /> Address
                  </span>
                  <span className="text-[#0F172A] block leading-normal">{teacher.address}</span>
                </div>
              </div>
            </div>

            {/* Card 4: Account Information */}
            <div className="bg-white p-6 rounded-[16px] border border-[#E2E8F0] shadow-2xs space-y-4">
              <h4 className="flex items-center gap-2 text-sm font-bold text-[#2563EB] uppercase tracking-wider pb-3 border-b border-[#E2E8F0]">
                <Shield size={16} /> Account Information
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B] flex items-center gap-1">
                    <Mail size={14} /> Login ID
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#0F172A]">{teacher.loginId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B] flex items-center gap-1">
                    <Key size={14} /> Temp Password
                  </span>
                  <span className="font-mono text-xs bg-[#F8FAFC] px-2 py-1 rounded font-bold text-[#0F172A] border border-[#E2E8F0]">
                    {teacher.temporaryPassword || 'Password@123'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[#64748B]">Profile Status</span>
                  <StatusBadge status={teacher.status} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeacherProfile;
