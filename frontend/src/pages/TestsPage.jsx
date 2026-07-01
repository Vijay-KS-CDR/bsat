import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { FileText, PlusCircle, Filter, RotateCcw, Award, Layers, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

// Shared Components
import StatsCard from '../components/dashboard/StatsCard';
import PageHeader from '../components/dashboard/PageHeader';
import FilterDropdown from '../components/dashboard/FilterDropdown';
import SearchBar from '../components/dashboard/SearchBar';
import Pagination from '../components/dashboard/Pagination';
import LoadingSkeleton from '../components/dashboard/LoadingSkeleton';
import DeleteModal from '../components/dashboard/DeleteModal';

// Test Specific Components
import TestTable from '../components/tests/TestTable';
import TestForm from '../components/tests/TestForm';
import TestDetails from '../components/tests/TestDetails';

// API adapter
import { getTests, getTestById, createTest, updateTest, deleteTest, publishTest } from '../api/testApi';

const TestsPage = ({ globalSearch = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Derive view from current URL path
  const view = useMemo(() => {
    const path = location.pathname;
    if (path === '/tests/add') return 'add';
    if (path.endsWith('/edit')) return 'edit';
    if (id) return 'details';
    return 'list';
  }, [location, id]);

  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTest, setActiveTest] = useState(null);

  const [statusFilter, setStatusFilter] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingTest, setDeletingTest] = useState(null);

  const loadTests = async () => {
    setIsLoading(true);
    try {
      const data = await getTests();
      setTests(data);
    } catch (error) {
      console.error('Failed to load tests:', error);
      toast.error('Failed to load assessment tests.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
  }, []);

  // Load active test for edit/detail views
  useEffect(() => {
    if (id && (view === 'edit' || view === 'details')) {
      const loadActive = async () => {
        try {
          const data = await getTestById(id);
          setActiveTest(data);
        } catch {
          toast.error('Test not found.');
          navigate('/tests');
        }
      };
      loadActive();
    } else {
      setActiveTest(null);
    }
  }, [id, view, navigate]);

  // Sync global search from navbar
  useEffect(() => {
    if (globalSearch !== undefined) {
      setLocalSearch(globalSearch);
      setCurrentPage(1);
    }
  }, [globalSearch]);

  // Statistics
  const stats = useMemo(() => ({
    total: tests.length,
    draft: tests.filter(t => t.status === 'DRAFT').length,
    published: tests.filter(t => t.status === 'PUBLISHED').length,
    completed: tests.filter(t => t.status === 'COMPLETED').length,
  }), [tests]);

  // Filter + sort
  const filteredTests = useMemo(() => {
    return tests
      .filter(t => {
        const q = localSearch.toLowerCase().trim();
        const matchSearch = !q ||
          (t.testName || '').toLowerCase().includes(q) ||
          (t.subjectName || '').toLowerCase().includes(q) ||
          (t.className || '').toLowerCase().includes(q);
        const matchStatus = !statusFilter || t.status === statusFilter;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => Number(b.id) - Number(a.id));
  }, [tests, localSearch, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTests.length / itemsPerPage));
  const paginatedTests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTests.slice(start, start + itemsPerPage);
  }, [filteredTests, currentPage]);

  const resetFilters = () => { setStatusFilter(''); setLocalSearch(''); setCurrentPage(1); };

  // ── CRUD Handlers ────────────────────────────────────────────────────────────

  const handleSaveTest = async (formData) => {
    try {
      if (view === 'edit') {
        await updateTest(id, formData);
        toast.success('Test updated successfully');
      } else {
        await createTest(formData);
        toast.success('New assessment test created as DRAFT');
      }
      await loadTests();
      navigate('/tests');
    } catch (error) {
      console.error('Save test error:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to save test';
      toast.error(msg);
    }
  };

  const handlePublishTest = async (testToPublish) => {
    try {
      await publishTest(testToPublish.id);
      toast.success(`"${testToPublish.testName}" published successfully!`);
      await loadTests();
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to publish test';
      toast.error(msg);
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingTest) {
      try {
        await deleteTest(deletingTest.id);
        toast.success('Test deleted successfully');
        await loadTests();
      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Failed to delete test';
        toast.error(msg);
      }
    }
    setIsDeleteOpen(false);
    setDeletingTest(null);
  };

  // ── Render Guards ────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Assessment Tests" subtitle="Loading..." />
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  if (!activeTest && (view === 'edit' || view === 'details')) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin" />
      </div>
    );
  }

  // ── Views ────────────────────────────────────────────────────────────────────

  if (view === 'add') {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button onClick={() => navigate('/tests')}
            className="text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center gap-1 cursor-pointer">
            ← Back to Tests
          </button>
        </div>
        <TestForm onSave={handleSaveTest} onCancel={() => navigate('/tests')} />
      </div>
    );
  }

  if (view === 'edit') {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button onClick={() => navigate(`/tests/${id}`)}
            className="text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center gap-1 cursor-pointer">
            ← Back to Test Details
          </button>
        </div>
        <TestForm initialData={activeTest} onSave={handleSaveTest} onCancel={() => navigate(`/tests/${id}`)} />
      </div>
    );
  }

  if (view === 'details') {
    return (
      <div className="max-w-7xl mx-auto">
        <TestDetails test={activeTest} onBack={() => navigate('/tests')} onEdit={(tid) => navigate(`/tests/${tid}/edit`)} />
      </div>
    );
  }

  // Default: LIST VIEW
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
      className="space-y-8 max-w-7xl mx-auto pb-12">

      <PageHeader
        title="Assessment Test Repository"
        subtitle="Create class-wise assessment tests with direct inline question authoring."
        actionButton={
          <button onClick={() => navigate('/tests/add')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white font-semibold text-sm rounded-[16px] hover:bg-[#1D4ED8] transition-all shadow-sm hover:shadow-md cursor-pointer">
            <PlusCircle size={18} /> Create Test
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon={FileText} title="Total Tests" value={stats.total} description="In repository" colorClass="text-[#2563EB]" bgClass="bg-[#2563EB]/10" />
        <StatsCard icon={Layers} title="Draft Tests" value={stats.draft} description="Pending review" colorClass="text-[#8B5CF6]" bgClass="bg-[#8B5CF6]/10" />
        <StatsCard icon={Send} title="Published" value={stats.published} description="Active for students" colorClass="text-[#16A34A]" bgClass="bg-[#16A34A]/10" />
        <StatsCard icon={Award} title="Completed" value={stats.completed} description="Evaluations finished" colorClass="text-[#F59E0B]" bgClass="bg-[#F59E0B]/10" />
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
            <Filter size={14} /> Filters:
          </span>
          <FilterDropdown label="Status" options={['DRAFT', 'PUBLISHED', 'COMPLETED']} selectedValue={statusFilter}
            onChange={v => { setStatusFilter(v); setCurrentPage(1); }} />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <SearchBar value={localSearch} onChange={v => { setLocalSearch(v); setCurrentPage(1); }}
            placeholder="Search by name, subject, class..." />
          {(statusFilter || localSearch) && (
            <button onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#DC2626] bg-[#DC2626]/5 hover:bg-[#DC2626]/10 rounded-xl transition-colors cursor-pointer shrink-0">
              <RotateCcw size={14} /> Reset
            </button>
          )}
        </div>
      </div>

      <TestTable
        tests={paginatedTests}
        onView={t => navigate(`/tests/${t.id}`)}
        onEdit={t => navigate(`/tests/${t.id}/edit`)}
        onPublish={handlePublishTest}
        onDelete={t => { setDeletingTest(t); setIsDeleteOpen(true); }}
        onAddTest={() => navigate('/tests/add')}
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}
        totalItems={filteredTests.length} itemsPerPage={itemsPerPage} itemLabel="tests" />

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setDeletingTest(null); }}
        onConfirm={handleConfirmDelete}
        title="Delete Assessment Test"
        description={deletingTest
          ? `Are you sure you want to delete "${deletingTest.testName}"?\n\nThis will permanently delete the test and all its questions. This action cannot be undone.`
          : 'Are you sure you want to delete this test?'}
        confirmText="Delete Test"
      />
    </motion.div>
  );
};

export default TestsPage;
