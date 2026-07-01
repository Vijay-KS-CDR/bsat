import React, { useState, useEffect, useMemo } from 'react';
import { Save, AlertCircle, Calendar, Clock, Layers, PlusCircle, Trash2, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSubjects } from '../../api/subjectApi';

const FALLBACK_SUBJECTS = ['Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'English', 'Social Science'];
const QUESTION_TYPES = ['MCQ_SINGLE', 'NUMERICAL'];
const CLASS_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const SECTION_OPTIONS = ['A', 'B', 'C', 'D', 'E'];

const emptyQuestion = (type = 'MCQ_SINGLE', defaultSubjectId = '') => ({
  _id: Date.now() + Math.random(),
  questionType: type,
  questionText: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctAnswer: '',
  marks: 1,
  subjectId: defaultSubjectId,
  _expanded: true,
});

const QuestionCard = ({ question, index, onChange, onRemove, onDuplicate, subjectsList, mainSubjectId }) => {
  const toggle = () => onChange(index, { ...question, _expanded: !question._expanded });

  const updateField = (field, value) => onChange(index, { ...question, [field]: value });

  const isMCQ = question.questionType === 'MCQ_SINGLE';
  const currentSubjectId = question.subjectId || mainSubjectId || '';

  const diffBadge = {
    MCQ_SINGLE: 'bg-blue-50 text-blue-700',
    NUMERICAL: 'bg-violet-50 text-violet-700'
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
      className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">

      {/* Question Card Header */}
      <div className="flex items-center gap-3 px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] cursor-pointer" onClick={toggle}>
        <span className="w-7 h-7 rounded-lg bg-[#2563EB]/10 text-[#2563EB] font-black text-xs flex items-center justify-center shrink-0">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold mr-2 ${diffBadge[question.questionType] || 'bg-slate-50 text-slate-700'}`}>
            {question.questionType}
          </span>
          <span className="text-sm font-semibold text-[#0F172A] truncate">
            {question.questionText || <span className="text-[#94A3B8] italic">Question text not entered yet...</span>}
          </span>
        </div>
        <span className="text-xs font-bold text-[#64748B] shrink-0">{question.marks} {question.marks === 1 ? 'pt' : 'pts'}</span>
        <div className="flex items-center gap-1 shrink-0">
          <button type="button" onClick={(e) => { e.stopPropagation(); onDuplicate(index); }}
            className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-[#2563EB]/10 rounded-lg transition-colors" title="Duplicate">
            <Copy size={14} />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(index); }}
            className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-[#DC2626]/10 rounded-lg transition-colors" title="Remove">
            <Trash2 size={14} />
          </button>
          {question._expanded ? <ChevronUp size={16} className="text-[#64748B]" /> : <ChevronDown size={16} className="text-[#64748B]" />}
        </div>
      </div>

      {/* Question Card Body */}
      <AnimatePresence>
        {question._expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="p-5 space-y-4">
              {/* Type + Marks Row */}
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">Question Type</label>
                  <select value={question.questionType} onChange={(e) => updateField('questionType', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-white text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20">
                    {QUESTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                
                {/* Subject Section selector */}
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">Subject Section</label>
                  <select value={currentSubjectId} onChange={(e) => updateField('subjectId', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-white text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20">
                    {subjectsList.map(s => <option key={s.id} value={s.id}>{s.name || s.subjectName}</option>)}
                  </select>
                </div>

                <div className="w-28">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">Marks <span className="text-[#DC2626]">*</span></label>
                  <input type="number" min="1" max="100" value={question.marks}
                    onChange={(e) => updateField('marks', Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" />
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">Question Text <span className="text-[#DC2626]">*</span></label>
                <textarea rows={isMCQ ? 2 : 3} value={question.questionText}
                  onChange={(e) => updateField('questionText', e.target.value)}
                  placeholder="Enter the full question here..."
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-sm font-medium text-[#0F172A] placeholder-[#94A3B8] resize-y focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" />
              </div>

              {/* MCQ Options */}
              {isMCQ && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['A', 'B', 'C', 'D'].map(opt => (
                    <div key={opt}>
                      <label className="block text-xs font-bold text-[#475569] mb-1">Option {opt}</label>
                      <input type="text" value={question[`option${opt}`] || ''}
                        onChange={(e) => updateField(`option${opt}`, e.target.value)}
                        placeholder={`Option ${opt} text`}
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-sm font-medium text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#475569] mb-1">Correct Answer <span className="text-[#DC2626]">*</span></label>
                    <select value={question.correctAnswer || ''}
                      onChange={(e) => updateField('correctAnswer', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-white text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20">
                      <option value="">Select correct option</option>
                      {['A', 'B', 'C', 'D'].map(opt => (
                        <option key={opt} value={question[`option${opt}`] || opt}>{`Option ${opt}: ${question[`option${opt}`] || ''}`}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* NUMERICAL Answer */}
              {question.questionType === 'NUMERICAL' && (
                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1.5">Correct Answer <span className="text-[#DC2626]">*</span></label>
                  <input type="number"
                    value={question.correctAnswer || ''}
                    onChange={(e) => updateField('correctAnswer', e.target.value)}
                    placeholder="Enter numerical answer"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-sm font-medium text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const TestForm = ({ initialData, onSave, onCancel }) => {
  const isEditing = Boolean(initialData);
  const [subjectsList, setSubjectsList] = useState([]);

  // Basic form fields
  const [name, setName] = useState('');
  const [className, setClassName] = useState('6');
  const [section, setSection] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [duration, setDuration] = useState(60);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [instructions, setInstructions] = useState('');

  // Inline questions list
  const [questions, setQuestions] = useState([]);
  const [errors, setErrors] = useState({});

  // Fetch Subjects
  useEffect(() => {
    getSubjects()
      .then((data) => {
        if (data && data.length > 0) {
          setSubjectsList(data);
          setSubjectId(prev => {
            if (!prev) return String(data[0].id);
            const hasValidSubject = data.some(s => String(s.id) === prev);
            return hasValidSubject ? prev : String(data[0].id);
          });
        }
      })
      .catch((err) => console.error('Failed to load subjects:', err));
  }, []);

  const displaySubjects = useMemo(() => {
    return subjectsList.length > 0 ? subjectsList : FALLBACK_SUBJECTS.map((s, i) => ({ id: i + 1, subjectName: s }));
  }, [subjectsList]);

  // Populate form when editing or init new
  useEffect(() => {
    if (initialData) {
      setName(initialData.testName || '');
      setClassName(initialData.className || '6');
      setSection(initialData.section || '');
      setSubjectId(String(initialData.subjectId || ''));
      setDuration(Number(initialData.durationMinutes || 60));
      
      const formatDateTimeLocal = (val) => {
        if (!val) return '';
        return val.length > 16 ? val.substring(0, 16) : val;
      };
      setStartDate(formatDateTimeLocal(initialData.startTime || initialData.startDate || ''));
      setEndDate(formatDateTimeLocal(initialData.endTime || initialData.endDate || ''));
      setInstructions(initialData.instructions || '');

      if (initialData.questions && initialData.questions.length > 0) {
        setQuestions(initialData.questions.map((q) => ({
          _id: q.id || Date.now() + Math.random(),
          questionType: q.questionType || 'MCQ_SINGLE',
          questionText: q.questionText || '',
          optionA: q.optionA || '',
          optionB: q.optionB || '',
          optionC: q.optionC || '',
          optionD: q.optionD || '',
          correctAnswer: q.correctAnswer || '',
          marks: q.marks || 1,
          subjectId: q.subjectId || '',
          _expanded: false,
        })));
      }
    } else {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      const fmt = (d) => d.toISOString().slice(0, 16);
      const start = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
      setStartDate(fmt(start));
      setEndDate(fmt(end));
      setQuestions([emptyQuestion('MCQ_SINGLE', subjectId)]);
    }
    setErrors({});
  }, [initialData, subjectId]);

  // Auto-select first subject when list loads and no valid subject is selected
  useEffect(() => {
    if (subjectsList.length > 0) {
      const hasValidSubject = subjectsList.some(s => String(s.id) === subjectId);
      if (!hasValidSubject) {
        setSubjectId(String(subjectsList[0].id));
      }
    } else if (!subjectId && displaySubjects.length > 0) {
      const first = displaySubjects[0];
      setSubjectId(String(first.id));
    }
  }, [subjectsList, subjectId, displaySubjects]);

  // Running totals
  const stats = useMemo(() => ({
    count: questions.length,
    totalMarks: questions.reduce((sum, q) => sum + (Number(q.marks) || 1), 0),
  }), [questions]);

  // Question CRUD handlers
  const handleAddQuestion = (type = 'MCQ_SINGLE') => {
    setQuestions(prev => [...prev, emptyQuestion(type, subjectId)]);
  };

  const handleUpdateQuestion = (index, updated) => {
    setQuestions(prev => prev.map((q, i) => i === index ? updated : q));
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(prev => {
      const next = prev.filter((_, i) => i !== index);
      return next.length === 0 ? [emptyQuestion('MCQ_SINGLE', subjectId)] : next;
    });
  };

  const handleDuplicateQuestion = (index) => {
    setQuestions(prev => {
      const copy = { ...prev[index], _id: Date.now() + Math.random(), _expanded: true };
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      return next;
    });
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Test Name is required';
    else if (name.trim().length < 3 || name.trim().length > 150) errs.name = 'Test Name must be 3–150 characters';
    if (!className) errs.className = 'Class is required';
    if (!subjectId) errs.subjectId = 'Subject is required';
    if (!duration || duration < 1) errs.duration = 'Duration must be at least 1 minute';
    if (!startDate) errs.startDate = 'Start Date & Time is required';
    if (!endDate) errs.endDate = 'End Date & Time is required';
    else if (startDate && new Date(endDate) <= new Date(startDate)) errs.endDate = 'End time must be after start time';

    // Validate questions
    questions.forEach((q, i) => {
      const isMCQ = q.questionType === 'MCQ_SINGLE';
      const isNumerical = q.questionType === 'NUMERICAL';

      if (!q.questionText.trim()) errs[`q_text_${i}`] = `Question ${i + 1}: text is required`;
      if (isMCQ) {
        if (!q.optionA.trim() || !q.optionB.trim()) errs[`q_options_${i}`] = `Question ${i + 1}: at least Option A and B are required for MCQ`;
        if (!q.correctAnswer) errs[`q_answer_${i}`] = `Question ${i + 1}: correct answer is required for MCQ`;
      }
      if (isNumerical && !q.correctAnswer.trim()) {
        errs[`q_answer_${i}`] = `Question ${i + 1}: correct answer is required`;
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const payload = {
      testName: name.trim(),
      className,
      section: section || null,
      subjectId: Number(subjectId),
      durationMinutes: Number(duration),
      instructions: instructions.trim() || null,
      startTime: startDate,
      endTime: endDate,
      questions: questions.map(q => ({
        questionType: q.questionType,
        questionText: q.questionText.trim(),
        optionA: q.optionA || null,
        optionB: q.optionB || null,
        optionC: q.optionC || null,
        optionD: q.optionD || null,
        correctAnswer: q.correctAnswer || null,
        marks: Number(q.marks) || 1,
        subjectId: q.subjectId ? Number(q.subjectId) : Number(subjectId)
      })),
    };

    onSave(payload);
  };

  const formErrors = Object.entries(errors).filter(([k]) => !k.startsWith('q_'));
  const questionErrors = Object.entries(errors).filter(([k]) => k.startsWith('q_'));

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto space-y-8 pb-12">
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Global Errors */}
        {formErrors.length > 0 && (
          <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-2xl p-4 space-y-1">
            {formErrors.map(([k, msg]) => (
              <p key={k} className="flex items-center gap-2 text-xs text-[#DC2626] font-semibold">
                <AlertCircle size={13} /> {msg}
              </p>
            ))}
          </div>
        )}

        {/* ── Section 1: Test Information ─────────────────────────────────── */}
        <div className="bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm overflow-hidden">
          <div className="bg-[#F8FAFC] px-7 py-5 border-b border-[#E2E8F0] flex items-center gap-3">
            <div className="p-2.5 bg-[#2563EB]/10 text-[#2563EB] rounded-xl"><Calendar size={20} /></div>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">{isEditing ? 'Edit Test Configuration' : 'New Assessment Test'}</h2>
              <p className="text-xs text-[#64748B] mt-0.5">Configure name, class, subject, duration, and scheduling.</p>
            </div>
          </div>

          <div className="p-7 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Test Name */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">Test Name <span className="text-[#DC2626]">*</span></label>
                <input type="text" placeholder="e.g. Midterm Algebra Assessment" value={name} onChange={e => setName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 transition-all ${errors.name ? 'border-[#DC2626] focus:ring-[#DC2626]/20' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/20'}`} />
              </div>

              {/* Class */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">Class <span className="text-[#DC2626]">*</span></label>
                <select value={className} onChange={e => setClassName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all">
                  {CLASS_OPTIONS.map(c => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>

              {/* Section */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">Section <span className="text-[#94A3B8] font-normal">(Optional)</span></label>
                <select value={section} onChange={e => setSection(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all">
                  <option value="">All Sections</option>
                  {SECTION_OPTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">Subject <span className="text-[#DC2626]">*</span></label>
                <select value={subjectId} onChange={e => setSubjectId(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border bg-white text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-2 transition-all ${errors.subjectId ? 'border-[#DC2626] focus:ring-[#DC2626]/20' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/20'}`}>
                  {displaySubjects.map(s => <option key={s.id} value={String(s.id)}>{s.name || s.subjectName}</option>)}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">Duration (Minutes) <span className="text-[#DC2626]">*</span></label>
                <div className="relative flex items-center">
                  <Clock className="absolute left-3.5 text-[#64748B]" size={16} />
                  <input type="number" min="1" max="600" value={duration} onChange={e => setDuration(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 transition-all ${errors.duration ? 'border-[#DC2626] focus:ring-[#DC2626]/20' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/20'}`} />
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">Start Date & Time <span className="text-[#DC2626]">*</span></label>
                <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 transition-all ${errors.startDate ? 'border-[#DC2626] focus:ring-[#DC2626]/20' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/20'}`} />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">End Date & Time <span className="text-[#DC2626]">*</span></label>
                <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 transition-all ${errors.endDate ? 'border-[#DC2626] focus:ring-[#DC2626]/20' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/20'}`} />
              </div>

              {/* Instructions */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">Test Instructions <span className="text-[#94A3B8] font-normal">(Optional)</span></label>
                <textarea rows={3} value={instructions} onChange={e => setInstructions(e.target.value)}
                  placeholder="Enter any instructions for students (e.g. No calculators, Read carefully...)"
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-sm font-medium text-[#0F172A] placeholder-[#94A3B8] resize-y focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 2: Inline Questions ──────────────────────────────────── */}
        <div className="bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm overflow-hidden">
          <div className="bg-[#F8FAFC] px-7 py-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-xl"><Layers size={20} /></div>
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">Assessment Questions</h2>
                <p className="text-xs text-[#64748B] mt-0.5">Add, edit, remove, and duplicate questions directly.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-[#2563EB]/10 border border-[#2563EB]/20 px-4 py-2 rounded-2xl text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">Questions</span>
                <span className="text-lg font-black text-[#2563EB] font-mono leading-tight mt-0.5 block">{stats.count}</span>
              </div>
              <div className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 px-4 py-2 rounded-2xl text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8B5CF6]">Total Marks</span>
                <span className="text-lg font-black text-[#8B5CF6] font-mono leading-tight mt-0.5 block">{stats.totalMarks} pts</span>
              </div>
            </div>
          </div>

          <div className="p-7 space-y-4">
            {/* Question Error Summary */}
            {questionErrors.length > 0 && (
              <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-2xl p-4 space-y-1">
                {questionErrors.map(([k, msg]) => (
                  <p key={k} className="flex items-center gap-2 text-xs text-[#DC2626] font-semibold">
                    <AlertCircle size={13} /> {msg}
                  </p>
                ))}
              </div>
            )}

            {/* Question Cards */}
            <AnimatePresence mode="popLayout">
              {questions.map((q, i) => (
                <QuestionCard key={q._id} question={q} index={i}
                  onChange={handleUpdateQuestion}
                  onRemove={handleRemoveQuestion}
                  onDuplicate={handleDuplicateQuestion}
                  subjectsList={displaySubjects}
                  mainSubjectId={subjectId} />
              ))}
            </AnimatePresence>

            {/* Add Question Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-bold text-[#64748B] mr-1">Add Question:</span>
              {QUESTION_TYPES.map(type => (
                <button key={type} type="button" onClick={() => handleAddQuestion(type)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-[#E2E8F0] text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-[#2563EB]/5 transition-all cursor-pointer">
                  <PlusCircle size={13} /> {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Action Bar ───────────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 bg-white p-6 border border-[#E2E8F0] rounded-[24px] shadow-xs">
          <button type="button" onClick={onCancel}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-[#64748B] bg-[#F8FAFC] hover:bg-slate-200/60 transition-colors cursor-pointer">
            Cancel
          </button>
          <button type="submit"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#2563EB] text-white font-semibold text-sm rounded-xl hover:bg-[#1D4ED8] transition-all shadow-sm hover:shadow-md cursor-pointer">
            <Save size={16} /> {isEditing ? 'Save Changes' : 'Create Assessment Test'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TestForm;
