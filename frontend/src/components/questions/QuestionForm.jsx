import React, { useState, useEffect } from 'react';
import { HelpCircle, Save, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSubjects } from '../../api/subjectApi';

const FALLBACK_SUBJECTS = [
  { id: 1, name: 'Mathematics' },
  { id: 2, name: 'Science' },
  { id: 3, name: 'Physics' },
  { id: 4, name: 'Chemistry' },
  { id: 5, name: 'Biology' },
  { id: 6, name: 'English' },
  { id: 7, name: 'Social Science' }
];

const QUESTION_TYPES = [
  { value: 'MCQ_SINGLE', label: 'Multiple Choice Question (MCQ)' },
  { value: 'NUMERICAL', label: 'Numerical Value Answer' }
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const QuestionForm = ({ initialData, onSave, onCancel, apiErrors }) => {
  const isEditing = Boolean(initialData);
  const [subjectsList, setSubjectsList] = useState([]);

  useEffect(() => {
    getSubjects()
      .then((data) => {
        if (data && data.length > 0) {
          setSubjectsList(data);
          if (!isEditing) {
            setFormData((prev) => ({
              ...prev,
              subjectId: Number(data[0].id),
              subject: data[0].name
            }));
          }
        }
      })
      .catch((err) => console.error('Failed to load subjects for form:', err));
  }, [isEditing]);

  const displaySubjects = subjectsList.length > 0 ? subjectsList : FALLBACK_SUBJECTS;

  const [formData, setFormData] = useState({
    subjectId: 1,
    subject: 'Mathematics',
    topic: '',
    questionType: 'MCQ_SINGLE',
    difficulty: 'Medium',
    questionText: '',
    marks: 1,
    status: 'Active',
    options: {
      A: '',
      B: '',
      C: '',
      D: ''
    },
    correctAnswer: 'A'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        subjectId: Number(initialData.subjectId || 1),
        subject: initialData.subject || 'Mathematics',
        topic: initialData.topic || '',
        questionType: initialData.questionType || 'MCQ_SINGLE',
        difficulty: initialData.difficulty || 'Medium',
        questionText: initialData.questionText || '',
        marks: Number(initialData.marks) || 1,
        status: initialData.status || 'Active',
        options: {
          A: initialData.options?.A || '',
          B: initialData.options?.B || '',
          C: initialData.options?.C || '',
          D: initialData.options?.D || ''
        },
        correctAnswer: initialData.correctAnswer || (initialData.questionType === 'MCQ_SINGLE' ? 'A' : '')
      });
    } else {
      setFormData({
        subjectId: 1,
        subject: 'Mathematics',
        topic: '',
        questionType: 'MCQ_SINGLE',
        difficulty: 'Medium',
        questionText: '',
        marks: 1,
        status: 'Active',
        options: {
          A: '',
          B: '',
          C: '',
          D: ''
        },
        correctAnswer: 'A'
      });
    }
    setErrors({});
  }, [initialData]);

  useEffect(() => {
    if (apiErrors && Object.keys(apiErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...apiErrors }));
    }
  }, [apiErrors]);

  const handleChange = (field, val) => {
    if (field === 'subjectId') {
      const numId = Number(val);
      const found = displaySubjects.find((s) => Number(s.id) === numId);
      setFormData((prev) => ({
        ...prev,
        subjectId: numId,
        subject: found ? found.name : prev.subject
      }));
      if (errors.subject) setErrors((prev) => ({ ...prev, subject: null }));
      return;
    }

    setFormData((prev) => {
      const updated = { ...prev, [field]: val };
      if (field === 'questionType') {
        if (val === 'MCQ_SINGLE') {
          updated.correctAnswer = 'A';
        } else {
          updated.correctAnswer = '';
        }
      }
      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleOptionChange = (optionKey, val) => {
    setFormData((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        [optionKey]: val
      }
    }));
    if (errors[`option_${optionKey}`]) {
      setErrors((prev) => ({ ...prev, [`option_${optionKey}`]: null }));
    }
  };

  const validate = () => {
    const newErr = {};

    if (!formData.subject.trim()) {
      newErr.subject = 'Subject is required';
    }
    if (!formData.topic.trim()) {
      newErr.topic = 'Topic is required';
    }
    if (!formData.questionText.trim()) {
      newErr.questionText = 'Question Text is required';
    }
    if (!formData.marks || formData.marks < 1) {
      newErr.marks = 'Marks must be at least 1';
    }

    if (formData.questionType === 'MCQ_SINGLE') {
      if (!formData.options.A.trim()) newErr.option_A = 'Option A is required';
      if (!formData.options.B.trim()) newErr.option_B = 'Option B is required';
      if (!formData.options.C.trim()) newErr.option_C = 'Option C is required';
      if (!formData.options.D.trim()) newErr.option_D = 'Option D is required';
      if (!formData.correctAnswer) newErr.correctAnswer = 'Please select the correct option';
    } else if (formData.questionType === 'NUMERICAL') {
      if (!formData.correctAnswer || !String(formData.correctAnswer).trim()) {
        newErr.correctAnswer = 'Correct Answer is required';
      }
    }

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Clean up payload based on type
      const payload = {
        ...formData,
        marks: Number(formData.marks)
      };
      if (formData.questionType !== 'MCQ_SINGLE') {
        delete payload.options;
      }
      onSave(payload);
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
      <div className="bg-[#F8FAFC] px-8 py-6 border-b border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#2563EB]/10 text-[#2563EB] rounded-xl">
            <HelpCircle size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">
              {isEditing ? 'Edit Question' : 'Add New Question'}
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              {isEditing
                ? 'Update question details, options, and marking scheme.'
                : 'Configure a new examination question for the assessment bank.'}
            </p>
          </div>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subject Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
              Subject <span className="text-[#DC2626]">*</span>
            </label>
            <select
              value={formData.subjectId}
              onChange={(e) => handleChange('subjectId', e.target.value)}
              disabled={isEditing}
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 transition-all ${
                isEditing
                  ? 'bg-slate-50 border-[#E2E8F0] text-[#64748B] cursor-not-allowed'
                  : 'bg-white border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/20'
              } ${
                errors.subject ? 'border-[#DC2626] focus:ring-[#DC2626]/20' : ''
              }`}
            >
              {displaySubjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className="flex items-center gap-1 text-xs text-[#DC2626] mt-1.5 font-medium">
                <AlertCircle size={12} /> {errors.subject}
              </p>
            )}
          </div>

          {/* Topic */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
              Topic / Chapter <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Calculus, Solar System, Kinematics"
              value={formData.topic}
              onChange={(e) => handleChange('topic', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 transition-all ${
                errors.topic
                  ? 'border-[#DC2626] focus:ring-[#DC2626]/20'
                  : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/20'
              }`}
            />
            {errors.topic && (
              <p className="flex items-center gap-1 text-xs text-[#DC2626] mt-1.5 font-medium">
                <AlertCircle size={12} /> {errors.topic}
              </p>
            )}
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
              Question Type <span className="text-[#DC2626]">*</span>
            </label>
            <select
              value={formData.questionType}
              onChange={(e) => handleChange('questionType', e.target.value)}
              disabled={isEditing}
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 transition-all ${
                isEditing
                  ? 'bg-slate-50 border-[#E2E8F0] text-[#64748B] cursor-not-allowed'
                  : 'border-[#CBD5E1] bg-white focus:border-[#2563EB] focus:ring-[#2563EB]/20'
              }`}
            >
              {QUESTION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
              Difficulty <span className="text-[#DC2626]">*</span>
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => handleChange('difficulty', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-sm font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
            >
              {DIFFICULTIES.map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>

          {/* Marks */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
              Marks Assigned <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.marks}
              onChange={(e) => handleChange('marks', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 transition-all ${
                errors.marks
                  ? 'border-[#DC2626] focus:ring-[#DC2626]/20'
                  : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/20'
              }`}
            />
            {errors.marks && (
              <p className="flex items-center gap-1 text-xs text-[#DC2626] mt-1.5 font-medium">
                <AlertCircle size={12} /> {errors.marks}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
              Status <span className="text-[#DC2626]">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-sm font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Question Text */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
            Question Text <span className="text-[#DC2626]">*</span>
          </label>
          <textarea
            rows="3"
            placeholder="Enter the complete prompt or problem statement here..."
            value={formData.questionText}
            onChange={(e) => handleChange('questionText', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 transition-all ${
              errors.questionText
                ? 'border-[#DC2626] focus:ring-[#DC2626]/20'
                : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/20'
            }`}
          />
          {errors.questionText && (
            <p className="flex items-center gap-1 text-xs text-[#DC2626] mt-1.5 font-medium">
              <AlertCircle size={12} /> {errors.questionText}
            </p>
          )}
        </div>

        {/* Dynamic Section based on Question Type */}
        <div className="pt-4 border-t border-[#E2E8F0]">
          <h3 className="text-sm font-bold text-[#0F172A] mb-4">
            {formData.questionType === 'MCQ_SINGLE' && 'Multiple Choice Options & Correct Answer'}
            {formData.questionType === 'NUMERICAL' && 'Numerical Value Expected Answer'}
          </h3>

          {/* If MCQ_SINGLE */}
          {formData.questionType === 'MCQ_SINGLE' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['A', 'B', 'C', 'D'].map((opt) => (
                  <div key={opt}>
                    <label className="block text-xs font-semibold text-[#64748B] mb-1.5">
                      Option {opt} <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={`Enter option ${opt} text`}
                      value={formData.options[opt]}
                      onChange={(e) => handleOptionChange(opt, e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 transition-all ${
                        errors[`option_${opt}`]
                          ? 'border-[#DC2626] focus:ring-[#DC2626]/20'
                          : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/20'
                      }`}
                    />
                    {errors[`option_${opt}`] && (
                      <p className="flex items-center gap-1 text-xs text-[#DC2626] mt-1 font-medium">
                        <AlertCircle size={12} /> {errors[`option_${opt}`]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
                  Select Correct Option <span className="text-[#DC2626]">*</span>
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  {['A', 'B', 'C', 'D'].map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border cursor-pointer font-semibold text-sm transition-all ${
                        formData.correctAnswer === opt
                          ? 'bg-[#2563EB]/10 border-[#2563EB] text-[#2563EB]'
                          : 'bg-slate-50 border-[#CBD5E1] text-[#64748B] hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="correctAnswer"
                        value={opt}
                        checked={formData.correctAnswer === opt}
                        onChange={(e) => handleChange('correctAnswer', e.target.value)}
                        className="hidden"
                      />
                      Option {opt}
                    </label>
                  ))}
                </div>
                {errors.correctAnswer && (
                  <p className="flex items-center gap-1 text-xs text-[#DC2626] mt-1.5 font-medium">
                    <AlertCircle size={12} /> {errors.correctAnswer}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* If NUMERICAL */}
          {formData.questionType === 'NUMERICAL' && (
            <div className="max-w-md">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
                Correct Answer <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 150 or 0.33"
                value={formData.correctAnswer}
                onChange={(e) => handleChange('correctAnswer', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 transition-all ${
                  errors.correctAnswer
                    ? 'border-[#DC2626] focus:ring-[#DC2626]/20'
                    : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/20'
                }`}
              />
              {errors.correctAnswer && (
                <p className="flex items-center gap-1 text-xs text-[#DC2626] mt-1.5 font-medium">
                  <AlertCircle size={12} /> {errors.correctAnswer}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="pt-6 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#64748B] bg-[#F8FAFC] hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2563EB] text-white font-semibold text-sm rounded-xl hover:bg-[#1D4ED8] transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Save size={16} /> Save Question
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default QuestionForm;
