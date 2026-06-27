import React, { useState, useEffect } from 'react';
import { User, BookOpen, Key, Phone, Save, X, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const TeacherForm = ({ initialData, onSave, onCancel, apiErrors }) => {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    loginId: '',
    temporaryPassword: '',
    qualification: '',
    experience: '',
    phone: '',
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
        employeeId: `TCH-${Math.floor(100 + Math.random() * 900)}`,
        loginId: '',
        temporaryPassword: 'Password@123',
        qualification: '',
        experience: '',
        phone: '',
        address: '',
        status: 'Active'
      });
    }
    setErrors({});
  }, [initialData]);

  useEffect(() => {
    if (apiErrors && Object.keys(apiErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...apiErrors }));
    }
  }, [apiErrors]);

  const handleChange = (field, val) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: val };
      if (field === 'name' && !isEditing) {
        next.loginId = `${val.toLowerCase().trim().replace(/\s+/g, '.')}@bsat.edu`;
      }
      return next;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErr = {};
    if (!formData.name.trim()) {
      newErr.name = 'Teacher name is required';
    } else if (formData.name.length < 3 || formData.name.length > 100) {
      newErr.name = 'Teacher name must be between 3 and 100 characters';
    }

    if (!formData.employeeId.trim()) {
      newErr.employeeId = 'Employee ID is required';
    }

    if (!formData.loginId.trim()) {
      newErr.loginId = 'Login ID is required';
    }

    if (!isEditing) {
      if (!formData.temporaryPassword.trim()) {
        newErr.temporaryPassword = 'Temporary password is required';
      } else if (formData.temporaryPassword.length < 8) {
        newErr.temporaryPassword = 'Password must be at least 8 characters';
      }
    }

    if (!formData.phone.trim()) {
      newErr.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErr.phone = 'Phone must be exactly 10 digits';
    }

    if (!formData.qualification.trim()) {
      newErr.qualification = 'Qualification is required';
    } else if (formData.qualification.length > 150) {
      newErr.qualification = 'Qualification must not exceed 150 characters';
    }

    if (formData.experience === '' || formData.experience === null || formData.experience === undefined) {
      newErr.experience = 'Experience is required';
    } else {
      const exp = Number(formData.experience);
      if (isNaN(exp) || exp < 0 || exp > 50) {
        newErr.experience = 'Experience must be between 0 and 50 years';
      }
    }

    if (!formData.address.trim()) {
      newErr.address = 'Residential address is required';
    }

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
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-[#E2E8F0] rounded-[24px] max-w-4xl mx-auto shadow-sm overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="px-8 py-6 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">
            {isEditing ? 'Edit Teacher Profile' : 'Register New Teacher'}
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Provide the administrative, credentials, and professional contact data below.
          </p>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Section 1: Personal Information */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-[#E2E8F0] text-sm font-bold text-[#2563EB] tracking-wide uppercase">
            <User size={18} /> Personal Information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Teacher Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Arun Kumar"
                className={`w-full px-4 py-2.5 bg-white border ${
                  errors.name ? 'border-[#DC2626] ring-1 ring-[#DC2626]' : 'border-[#E2E8F0]'
                } rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all`}
              />
              {errors.name && (
                <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Employee ID *</label>
              <input
                type="text"
                value={formData.employeeId}
                disabled={isEditing}
                onChange={(e) => handleChange('employeeId', e.target.value)}
                className={`w-full px-4 py-2.5 font-mono border ${
                  errors.employeeId ? 'border-[#DC2626] ring-1 ring-[#DC2626]' : 'border-[#E2E8F0]'
                } rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB] ${
                  isEditing ? 'bg-[#F8FAFC] text-[#64748B] cursor-not-allowed' : 'bg-white'
                }`}
              />
              {errors.employeeId && (
                <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.employeeId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Login ID (Email) *</label>
              <input
                type="email"
                value={formData.loginId}
                disabled={isEditing}
                onChange={(e) => handleChange('loginId', e.target.value)}
                placeholder="teacher@bsat.edu"
                className={`w-full px-4 py-2.5 border ${
                  errors.loginId ? 'border-[#DC2626] ring-1 ring-[#DC2626]' : 'border-[#E2E8F0]'
                } rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB] ${
                  isEditing ? 'bg-[#F8FAFC] text-[#64748B] cursor-not-allowed' : 'bg-white'
                }`}
              />
              {errors.loginId && (
                <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.loginId}
                </p>
              )}
            </div>

            {!isEditing && (
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Temporary Password *</label>
                <input
                  type="text"
                  value={formData.temporaryPassword}
                  onChange={(e) => handleChange('temporaryPassword', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-white border ${
                    errors.temporaryPassword ? 'border-[#DC2626] ring-1 ring-[#DC2626]' : 'border-[#E2E8F0]'
                  } font-mono rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB]`}
                />
                {errors.temporaryPassword && (
                  <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.temporaryPassword}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Professional Information */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-[#E2E8F0] text-sm font-bold text-[#2563EB] tracking-wide uppercase">
            <BookOpen size={18} /> Professional Information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Qualification *</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => handleChange('qualification', e.target.value)}
                placeholder="e.g. M.Sc Mathematics"
                className={`w-full px-4 py-2.5 bg-white border ${
                  errors.qualification ? 'border-[#DC2626] ring-1 ring-[#DC2626]' : 'border-[#E2E8F0]'
                } rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all`}
              />
              {errors.qualification && (
                <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.qualification}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Years of Experience *</label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) => handleChange('experience', e.target.value)}
                placeholder="e.g. 5"
                min="0"
                max="50"
                className={`w-full px-4 py-2.5 bg-white border ${
                  errors.experience ? 'border-[#DC2626] ring-1 ring-[#DC2626]' : 'border-[#E2E8F0]'
                } rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all`}
              />
              {errors.experience && (
                <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.experience}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Contact & Account Status */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-[#E2E8F0] text-sm font-bold text-[#2563EB] tracking-wide uppercase">
            <Phone size={18} /> Contact & Account Status
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Phone Number *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="e.g. 9876543210"
                className={`w-full px-4 py-2.5 bg-white border ${
                  errors.phone ? 'border-[#DC2626] ring-1 ring-[#DC2626]' : 'border-[#E2E8F0]'
                } font-mono rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all`}
              />
              {errors.phone && (
                <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Account Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Residential Address *</label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Full address..."
                className={`w-full px-4 py-2.5 bg-white border ${
                  errors.address ? 'border-[#DC2626] ring-1 ring-[#DC2626]' : 'border-[#E2E8F0]'
                } rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all`}
              />
              {errors.address && (
                <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.address}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#64748B] bg-[#F8FAFC] hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Save size={16} />
            {isEditing ? 'Update Teacher' : 'Save Teacher'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TeacherForm;
