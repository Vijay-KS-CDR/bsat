import React, { useState, useEffect } from 'react';
import { BookOpen, HelpCircle, Save, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const SubjectForm = ({ initialData, onSave, onCancel, apiErrors }) => {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    subjectCode: '',
    name: '',
    description: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        subjectCode: '',
        name: '',
        description: '',
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
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErr = {};
    if (!formData.subjectCode.trim()) {
      newErr.subjectCode = 'Subject Code is required';
    } else if (!/^[A-Z]{3,4}\d{3}$/.test(formData.subjectCode.trim())) {
      newErr.subjectCode = 'Subject Code must be alphanumeric (e.g. MAT101, PHYS101)';
    }

    if (!formData.name.trim()) {
      newErr.name = 'Subject Name is required';
    } else if (formData.name.length < 3 || formData.name.length > 100) {
      newErr.name = 'Subject Name must be between 3 and 100 characters';
    }

    if (!formData.description.trim()) {
      newErr.description = 'Description is required';
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
            {isEditing ? 'Edit Subject Details' : 'Register New Subject'}
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Specify the educational details, subject code and active status.
          </p>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Section 1: Subject Details */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-[#E2E8F0] text-sm font-bold text-[#2563EB] tracking-wide uppercase">
            <BookOpen size={18} /> Subject Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Subject Code *</label>
              <input
                type="text"
                value={formData.subjectCode}
                disabled={isEditing}
                placeholder="e.g. MAT101"
                onChange={(e) => handleChange('subjectCode', e.target.value.toUpperCase())}
                className={`w-full px-4 py-2.5 font-mono border ${
                  errors.subjectCode ? 'border-[#DC2626] ring-1 ring-[#DC2626]' : 'border-[#E2E8F0]'
                } rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all ${
                  isEditing ? 'bg-[#F8FAFC] text-[#64748B] cursor-not-allowed' : 'bg-white'
                }`}
              />
              {errors.subjectCode && (
                <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.subjectCode}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Subject Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Mathematics"
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
          </div>
        </div>

        {/* Section 2: Course Information */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-[#E2E8F0] text-sm font-bold text-[#2563EB] tracking-wide uppercase">
            <HelpCircle size={18} /> Additional Information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <label className="block text-xs font-bold text-[#0F172A] uppercase mb-2">Description / Syllabus Overview *</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Brief summary of syllabus contents and class distribution..."
                className={`w-full px-4 py-2.5 bg-white border ${
                  errors.description ? 'border-[#DC2626] ring-1 ring-[#DC2626]' : 'border-[#E2E8F0]'
                } rounded-[16px] text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all`}
              />
              {errors.description && (
                <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.description}
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
            {isEditing ? 'Update Subject' : 'Save Subject'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default SubjectForm;
