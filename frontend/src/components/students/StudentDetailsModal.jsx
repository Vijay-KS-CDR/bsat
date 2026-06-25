import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, BookOpen, Users, Shield, Calendar, Phone, MapPin, Mail, Key } from 'lucide-react';
import StatusBadge from '../dashboard/StatusBadge';

const StudentDetailsModal = ({ student, isOpen, onClose, onEdit }) => {
  if (!isOpen || !student) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[24px] max-w-4xl w-full my-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Top Banner Profile Header */}
          <div className="relative bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] p-8 text-white shrink-0">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <img
                src={student.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                alt={student.name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-lg bg-white shrink-0"
              />
              <div className="text-center sm:text-left space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{student.name}</h2>
                  <div className="bg-white/90 px-1 rounded-full"><StatusBadge status={student.status} /></div>
                </div>
                <p className="text-blue-100 font-mono text-sm tracking-wide">
                  ADM: {student.admissionNumber} • User ID #{student.id}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-2 text-xs text-blue-200">
                  <Calendar size={14} /> Created Date: {student.createdDate || '2024-01-10'}
                </div>
              </div>
            </div>
          </div>

          {/* Cards Body */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Personal Information */}
              <div className="bg-white p-6 rounded-[16px] border border-[#E2E8F0] shadow-2xs space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-[#2563EB] uppercase tracking-wider pb-3 border-b border-[#E2E8F0]">
                  <User size={16} /> Personal Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Full Name</span>
                    <span className="font-semibold text-[#0F172A]">{student.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Gender</span>
                    <span className="font-semibold text-[#0F172A]">{student.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Date of Birth</span>
                    <span className="font-semibold font-mono text-[#0F172A]">{student.dob}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Academic Information */}
              <div className="bg-white p-6 rounded-[16px] border border-[#E2E8F0] shadow-2xs space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-[#2563EB] uppercase tracking-wider pb-3 border-b border-[#E2E8F0]">
                  <BookOpen size={16} /> Academic Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Current Class</span>
                    <span className="font-bold text-[#0F172A]">Class {student.class}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Section</span>
                    <span className="font-bold text-[#0F172A]">Section {student.section}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Admission No</span>
                    <span className="font-mono font-semibold text-[#0F172A]">{student.admissionNumber}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Parent Information */}
              <div className="bg-white p-6 rounded-[16px] border border-[#E2E8F0] shadow-2xs space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-[#2563EB] uppercase tracking-wider pb-3 border-b border-[#E2E8F0]">
                  <Users size={16} /> Parent Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Parent Name</span>
                    <span className="font-semibold text-[#0F172A]">{student.parentName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B] flex items-center gap-1"><Phone size={14} /> Phone</span>
                    <span className="font-mono font-semibold text-[#0F172A]">{student.parentPhone}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-[#64748B] block mb-1 flex items-center gap-1"><MapPin size={14} /> Address</span>
                    <span className="text-[#0F172A] block leading-normal">{student.address}</span>
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
                    <span className="text-[#64748B] flex items-center gap-1"><Mail size={14} /> Login ID</span>
                    <span className="font-mono text-xs font-semibold text-[#0F172A]">{student.loginId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B] flex items-center gap-1"><Key size={14} /> Temp Password</span>
                    <span className="font-mono text-xs bg-[#F8FAFC] px-2 py-1 rounded font-bold text-[#0F172A] border border-[#E2E8F0]">{student.temporaryPassword}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[#64748B]">Profile Status</span>
                    <StatusBadge status={student.status} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="px-8 py-4 bg-white border-t border-[#E2E8F0] flex justify-end gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-[#64748B] bg-[#F8FAFC] hover:bg-slate-200/60 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => { onClose(); onEdit(student); }}
              className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-xs transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StudentDetailsModal;
