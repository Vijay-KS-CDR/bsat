import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, BookOpen, Users, X, Save, AlertCircle } from 'lucide-react';

const StudentForm = ({ isOpen, onClose, onSave, initialData, apiErrors }) => {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: '',
    admissionNumber: '',
    loginId: '',
    temporaryPassword: '',
    gender: 'Boy',
    dob: '',
    class: '10',
    section: 'A',
    parentName: '',
    parentPhone: '',
    address: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        admissionNumber: `ADM-2024-0${Math.floor(100 + Math.random() * 900)}`,
        loginId: '',
        temporaryPassword: 'Password@123',
        gender: 'Boy',
        dob: '2008-01-01',
        class: '10',
        section: 'A',
        parentName: '',
        parentPhone: '+91 ',
        address: '',
        status: 'Active'
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  useEffect(() => {
    if (apiErrors && Object.keys(apiErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...apiErrors }));
    }
  }, [apiErrors]);

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: val };
      if (field === 'name' && !isEditing) {
        next.loginId = `${val.toLowerCase().replace(/\s+/g, '.')}@bsat.edu`;
      }
      return next;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErr = {};
    if (!formData.name.trim()) newErr.name = 'Student name is required';
    if (!formData.admissionNumber.trim()) newErr.admissionNumber = 'Admission No is required';
    if (!formData.loginId.trim()) newErr.loginId = 'Login ID is required';
    if (!formData.temporaryPassword.trim()) newErr.temporaryPassword = 'Password is required';
    if (!formData.dob) newErr.dob = 'Date of birth is required';
    if (!formData.parentName.trim()) newErr.parentName = 'Parent name is required';
    if (!formData.parentPhone.trim() || formData.parentPhone.length < 8) newErr.parentPhone = 'Valid parent phone required';
    if (!formData.address.trim()) newErr.address = 'Residential address is required';

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white border border-[#E2E8F0] rounded-[24px] max-w-4xl w-full my-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="px-8 py-6 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">
                {isEditing ? 'Edit Student Record' : 'Enroll New Student'}
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                Fill out the two-column modern form below. All fields are prepped for API validation.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/50 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* Section 1: Personal Information */}
            <div>
              <div className="flex items-center gap-2 pb-3 mb-5 border-b border-[#E2E8F0] text-sm font-bold text-[#2563EB] tracking-wide uppercase">
                <User size={18} /> Personal Information
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Student Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g. Ishant Sharma"
                    className={`w-full px-4 py-2.5 bg-white border ${errors.name ? 'border-[#DC2626] ring-1 ring-[#DC2626]' : 'border-[#E2E8F0]'} rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all`}
                  />
                  {errors.name && <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Admission Number *</label>
                  <input
                    type="text"
                    value={formData.admissionNumber}
                    onChange={(e) => handleChange('admissionNumber', e.target.value)}
                    className={`w-full px-4 py-2.5 bg-[#F8FAFC] font-mono border ${errors.admissionNumber ? 'border-[#DC2626] ring-1 ring-[#DC2626]' : 'border-[#E2E8F0]'} rounded-[16px] text-sm focus:outline-none`}
                  />
                  {errors.admissionNumber && <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.admissionNumber}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Login ID (Email) *</label>
                  <input
                    type="email"
                    value={formData.loginId}
                    onChange={(e) => handleChange('loginId', e.target.value)}
                    placeholder="student@bsat.edu"
                    className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                  {errors.loginId && <p className="text-xs text-[#DC2626] mt-1">{errors.loginId}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Temporary Password *</label>
                  <input
                    type="text"
                    value={formData.temporaryPassword}
                    onChange={(e) => handleChange('temporaryPassword', e.target.value)}
                    className={`w-full px-4 py-2.5 bg-white border ${errors.temporaryPassword ? 'border-[#DC2626] ring-1 ring-[#DC2626]' : 'border-[#E2E8F0]'} font-mono rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB]`}
                  />
                  {errors.temporaryPassword && <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.temporaryPassword}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="Boy">Boy</option>
                    <option value="Girl">Girl</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleChange('dob', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                  {errors.dob && <p className="text-xs text-[#DC2626] mt-1">{errors.dob}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Academic Information */}
            <div>
              <div className="flex items-center gap-2 pb-3 mb-5 border-b border-[#E2E8F0] text-sm font-bold text-[#2563EB] tracking-wide uppercase">
                <BookOpen size={18} /> Academic Information
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Class *</label>
                  <select
                    value={formData.class}
                    onChange={(e) => handleChange('class', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB]"
                  >
                    {['9', '10', '11', '12'].map(c => <option key={c} value={c}>Class {c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Section *</label>
                  <select
                    value={formData.section}
                    onChange={(e) => handleChange('section', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB]"
                  >
                    {['A', 'B', 'C'].map(s => <option key={s} value={s}>Section {s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Parent Information */}
            <div>
              <div className="flex items-center gap-2 pb-3 mb-5 border-b border-[#E2E8F0] text-sm font-bold text-[#2563EB] tracking-wide uppercase">
                <Users size={18} /> Parent Information
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => handleChange('parentName', e.target.value)}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                  {errors.parentName && <p className="text-xs text-[#DC2626] mt-1">{errors.parentName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Parent Phone Number *</label>
                  <input
                    type="text"
                    value={formData.parentPhone}
                    onChange={(e) => handleChange('parentPhone', e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-2.5 bg-white font-mono border border-[#E2E8F0] rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                  {errors.parentPhone && <p className="text-xs text-[#DC2626] mt-1">{errors.parentPhone}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Residential Address *</label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="House No, Street, City, State..."
                    className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                  {errors.address && <p className="text-xs text-[#DC2626] mt-1">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#E2E8F0] sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#64748B] bg-[#F8FAFC] hover:bg-slate-200/60 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-sm hover:shadow-md transition-all"
              >
                <Save size={16} />
                {isEditing ? 'Update Student' : 'Save Student'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StudentForm;
