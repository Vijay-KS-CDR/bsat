import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { HelpCircle, CheckCircle, PlusCircle, Filter, RotateCcw, Layers, AlignLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

// Shared Components
import StatsCard from '../components/dashboard/StatsCard';
import PageHeader from '../components/dashboard/PageHeader';
import FilterDropdown from '../components/dashboard/FilterDropdown';
import SearchBar from '../components/dashboard/SearchBar';
import Pagination from '../components/dashboard/Pagination';
import LoadingSkeleton from '../components/dashboard/LoadingSkeleton';

// Question Specific Components
import QuestionTable from '../components/questions/QuestionTable';
import QuestionForm from '../components/questions/QuestionForm';
import QuestionDetails from '../components/questions/QuestionDetails';
import DeleteModal from '../components/dashboard/DeleteModal';

// API adapter
import {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  updateQuestionStatus
} from '../api/questionApi';

const QuestionsPage = ({ globalSearch = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Determine current view from URL route
  const view = useMemo(() => {
    const path = location.pathname;
    if (path === '/question-bank/add') return 'add';
    if (path.endsWith('/edit')) return 'edit';
    if (id) return 'details';
    return 'list';
  }, [location, id]);

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeQuestion, setActiveQuestion] = useState(null);

  // Filters state
  const [subjectFilter, setSubjectFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [localSearch, setLocalSearch] = useState('');

  // Sorting state
  const [sortField, setSortField] = useState('subject');
  const [sortDir, setSortDir] = useState('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingQuestion, setDeletingQuestion] = useState(null);

  // Form error mapping state
  const [formErrors, setFormErrors] = useState({});

  // Load all questions
  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const data = await getQuestions();
      setQuestions(data);
    } catch (error) {
      console.error('Failed to load questions:', error);
      toast.error('Failed to load questions repository.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  // Fetch active question details when route contains :id
  useEffect(() => {
    if (id && (view === 'edit' || view === 'details')) {
      const loadActive = async () => {
        try {
          const data = await getQuestionById(id);
          setActiveQuestion(data);
        } catch (error) {
          console.error('Failed to load question:', error);
          toast.error('Question record not found.');
          navigate('/question-bank');
        }
      };
      loadActive();
    } else {
      setActiveQuestion(null);
    }
  }, [id, view, navigate]);

  // Sync global header search
  useEffect(() => {
    if (globalSearch !== undefined) {
      setLocalSearch(globalSearch);
      setCurrentPage(1);
    }
  }, [globalSearch]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = questions.length;
    const active = questions.filter(q => q.status === 'Active').length;
    const mcq = questions.filter(q => q.questionType === 'MCQ_SINGLE').length;
    const numerical = questions.filter(q => q.questionType === 'NUMERICAL').length;
    return { total, active, mcq, numerical };
  }, [questions]);

  // Filtered and sorted questions
  const filteredQuestions = useMemo(() => {
    return questions
      .filter((q) => {
        const query = localSearch.toLowerCase().trim();
        const matchSearch =
          !query ||
          q.questionText.toLowerCase().includes(query) ||
          q.topic.toLowerCase().includes(query) ||
          q.subject.toLowerCase().includes(query);
        const matchSubject = !subjectFilter || q.subject === subjectFilter;
        const matchType = !typeFilter || q.questionType === typeFilter;
        const matchDiff = !difficultyFilter || q.difficulty === difficultyFilter;
        return matchSearch && matchSubject && matchType && matchDiff;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }
        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
  }, [questions, localSearch, subjectFilter, typeFilter, difficultyFilter, sortField, sortDir]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / itemsPerPage));
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredQuestions.slice(start, start + itemsPerPage);
  }, [filteredQuestions, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const resetFilters = () => {
    setSubjectFilter('');
    setTypeFilter('');
    setDifficultyFilter('');
    setLocalSearch('');
    setCurrentPage(1);
  };

  // CRUD handlers
  const handleSaveQuestion = async (formData) => {
    setFormErrors({});
    try {
      if (view === 'edit') {
        await updateQuestion(id, formData);
        toast.success('Question updated successfully');
      } else {
        await createQuestion(formData);
        toast.success('Question added to bank successfully');
      }
      await loadQuestions();
      navigate('/question-bank');
    } catch (error) {
      console.error('Save error:', error);
      if (error.response && error.response.data) {
        const apiData = error.response.data;
        if (apiData.errors) {
          const mappedErrors = {};
          Object.keys(apiData.errors).forEach((key) => {
            if (key === 'optionA') mappedErrors.option_A = apiData.errors.optionA;
            else if (key === 'optionB') mappedErrors.option_B = apiData.errors.optionB;
            else if (key === 'optionC') mappedErrors.option_C = apiData.errors.optionC;
            else if (key === 'optionD') mappedErrors.option_D = apiData.errors.optionD;
            else mappedErrors[key] = apiData.errors[key];
          });
          setFormErrors(mappedErrors);
        } else if (apiData.message) {
          toast.error(apiData.message);
        } else {
          toast.error('Failed to save question');
        }
      } else {
        toast.error(error.message || 'Failed to save question');
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingQuestion) {
      try {
        await deleteQuestion(deletingQuestion.id);
        toast.success('Question deleted successfully');
        await loadQuestions();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.message || 'Failed to delete question');
      }
    }
    setIsDeleteOpen(false);
    setDeletingQuestion(null);
  };

  const handleToggleStatus = async (question) => {
    const newStatus = question.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateQuestionStatus(question.id, newStatus);
      toast.success(`Question status changed to ${newStatus}`);
      await loadQuestions();
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error('Failed to toggle status');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Question Bank Management" subtitle="Loading question repository..." />
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  if (!activeQuestion && (view === 'edit' || view === 'details')) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin"></div>
      </div>
    );
  }

  // 1. ADD QUESTION VIEW
  if (view === 'add') {
    return (
      <div className="max-w-7xl mx-auto pb-12">
        <div className="mb-6">
          <button
            onClick={() => navigate('/question-bank')}
            className="text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center gap-1 cursor-pointer"
          >
            ← Back to Question List
          </button>
        </div>
        <QuestionForm
          onSave={handleSaveQuestion}
          onCancel={() => navigate('/question-bank')}
          apiErrors={formErrors}
        />
      </div>
    );
  }

  // 2. EDIT QUESTION VIEW
  if (view === 'edit') {
    return (
      <div className="max-w-7xl mx-auto pb-12">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/question-bank/${id}`)}
            className="text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center gap-1 cursor-pointer"
          >
            ← Back to Question Details
          </button>
        </div>
        <QuestionForm
          initialData={activeQuestion}
          onSave={handleSaveQuestion}
          onCancel={() => navigate(`/question-bank/${id}`)}
          apiErrors={formErrors}
        />
      </div>
    );
  }

  // 3. QUESTION DETAILS VIEW
  if (view === 'details') {
    return (
      <div className="max-w-7xl mx-auto pb-12">
        <QuestionDetails
          question={activeQuestion}
          onBack={() => navigate('/question-bank')}
          onEdit={(qid) => navigate(`/question-bank/${qid}/edit`)}
        />
      </div>
    );
  }

  // 4. QUESTION LIST VIEW (Default)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-7xl mx-auto pb-12"
    >
      {/* Page Header */}
      <PageHeader
        title="Question Bank Repository"
        subtitle="Manage assessment questions across multiple subjects, difficulty levels, and question types."
        actionButton={
          <button
            onClick={() => navigate('/question-bank/add')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white font-semibold text-sm rounded-[16px] hover:bg-[#1D4ED8] transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <PlusCircle size={18} /> Add Question
          </button>
        }
      />

      {/* Top Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={HelpCircle}
          title="Total Questions"
          value={stats.total}
          description="In question repository"
          colorClass="text-[#2563EB]"
          bgClass="bg-[#2563EB]/10"
        />
        <StatsCard
          icon={CheckCircle}
          title="Active Questions"
          value={stats.active}
          description="Ready for assessments"
          colorClass="text-[#16A34A]"
          bgClass="bg-[#16A34A]/10"
        />
        <StatsCard
          icon={Layers}
          title="MCQ Questions"
          value={stats.mcq}
          description="Single correct choice"
          colorClass="text-[#8B5CF6]"
          bgClass="bg-[#8B5CF6]/10"
        />
        <StatsCard
          icon={AlignLeft}
          title="Numerical Questions"
          value={stats.numerical}
          description="Numeric response type"
          colorClass="text-[#F59E0B]"
          bgClass="bg-[#F59E0B]/10"
        />
      </div>

      {/* Filtering & Search Toolbar */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-4 sm:p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5 mr-1">
            <Filter size={14} /> Filters:
          </span>
          <FilterDropdown
            label="Subjects"
            options={['Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'English', 'Social Science']}
            selectedValue={subjectFilter}
            onChange={(v) => { setSubjectFilter(v); setCurrentPage(1); }}
          />
          <FilterDropdown
            label="Types"
            options={['MCQ_SINGLE', 'NUMERICAL']}
            selectedValue={typeFilter}
            onChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}
          />
          <FilterDropdown
            label="Difficulties"
            options={['Easy', 'Medium', 'Hard']}
            selectedValue={difficultyFilter}
            onChange={(v) => { setDifficultyFilter(v); setCurrentPage(1); }}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <SearchBar
            value={localSearch}
            onChange={(v) => { setLocalSearch(v); setCurrentPage(1); }}
            placeholder="Search questions, topics..."
          />
          {(subjectFilter || typeFilter || difficultyFilter || localSearch) && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#DC2626] bg-[#DC2626]/5 hover:bg-[#DC2626]/10 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw size={14} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Question Table */}
      <QuestionTable
        questions={paginatedQuestions}
        sortField={sortField}
        sortDir={sortDir}
        onSort={handleSort}
        onView={(q) => navigate(`/question-bank/${q.id}`)}
        onEdit={(q) => navigate(`/question-bank/${q.id}/edit`)}
        onDelete={(q) => { setDeletingQuestion(q); setIsDeleteOpen(true); }}
        onAddQuestion={() => navigate('/question-bank/add')}
        onToggleStatus={handleToggleStatus}
      />

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredQuestions.length}
        itemsPerPage={itemsPerPage}
        itemLabel="questions"
      />

      {/* Deletion Dialog */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setDeletingQuestion(null); }}
        onConfirm={handleConfirmDelete}
        title="Delete Question Record"
        description={deletingQuestion ? `Are you sure you want to delete this question?\n\n"${deletingQuestion.questionText}"` : "Are you sure you want to delete this question?"}
        confirmText="Delete"
      />
    </motion.div>
  );
};

export default QuestionsPage;
