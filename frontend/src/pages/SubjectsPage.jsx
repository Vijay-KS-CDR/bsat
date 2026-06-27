import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, AlertTriangle, Clock, PlusCircle, Filter, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

// Shared Components
import StatsCard from '../components/dashboard/StatsCard';
import PageHeader from '../components/dashboard/PageHeader';
import FilterDropdown from '../components/dashboard/FilterDropdown';
import SearchBar from '../components/dashboard/SearchBar';
import Pagination from '../components/dashboard/Pagination';
import LoadingSkeleton from '../components/dashboard/LoadingSkeleton';

// Subject Specific Components
import SubjectTable from '../components/subjects/SubjectTable';
import SubjectForm from '../components/subjects/SubjectForm';
import SubjectProfile from '../components/subjects/SubjectProfile';
import DeleteModal from '../components/subjects/DeleteModal';

// Mock API
import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  updateSubjectStatus
} from '../api/subjectApi';

const SubjectsPage = ({ globalSearch = '', onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Determine current view from URL route
  const view = useMemo(() => {
    const path = location.pathname;
    if (path === '/subjects/add') return 'add';
    if (path.endsWith('/edit')) return 'edit';
    if (id) return 'details';
    return 'list';
  }, [location, id]);

  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState(null);

  // Filters state (only applicable in list view)
  const [statusFilter, setStatusFilter] = useState('');
  const [localSearch, setLocalSearch] = useState('');

  // Sorting state
  const [sortField, setSortField] = useState('subjectCode');
  const [sortDir, setSortDir] = useState('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingSubject, setDeletingSubject] = useState(null);

  // Form error mapping state
  const [formErrors, setFormErrors] = useState({});



  // Load all subjects
  const loadSubjects = async () => {
    setIsLoading(true);
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Failed to load subjects:', error);
      toast.error('Failed to load subjects.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  // Fetch subject details when route contains :id for details or edit view
  useEffect(() => {
    if (id && (view === 'edit' || view === 'details')) {
      const loadActiveSubject = async () => {
        try {
          const data = await getSubjectById(id);
          setActiveSubject(data);
        } catch (error) {
          console.error('Failed to load subject:', error);
          toast.error('Subject not found.');
          navigate('/subjects');
        }
      };
      loadActiveSubject();
    } else {
      setActiveSubject(null);
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
    const total = subjects.length;
    const active = subjects.filter(s => s.status === 'Active').length;
    const inactive = subjects.filter(s => s.status === 'Inactive').length;
    
    // Count subjects created in last 180 days (as mock has dates from Jan/Feb 2024, let's treat anything as recent, or say last 180 days)
    const recentlyAdded = subjects.filter(s => {
      const created = new Date(s.createdDate);
      const diffTime = Math.abs(new Date() - created);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 180; // In standard apps, this is usually 7 or 30 days
    }).length;

    return { total, active, inactive, recentlyAdded };
  }, [subjects]);

  // Filtered and sorted subjects
  const filteredSubjects = useMemo(() => {
    return subjects
      .filter((s) => {
        const q = localSearch.toLowerCase().trim();
        const matchSearch =
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.subjectCode.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q);
        const matchStatus = !statusFilter || s.status === statusFilter;
        return matchSearch && matchStatus;
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
  }, [subjects, localSearch, statusFilter, sortField, sortDir]);

  // Paginated array
  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
  const paginatedSubjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSubjects.slice(start, start + itemsPerPage);
  }, [filteredSubjects, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const resetFilters = () => {
    setStatusFilter('');
    setLocalSearch('');
    setCurrentPage(1);
  };

  // Error handling utility matching student/teacher page
  const handleApiError = (error, setFieldErrors, defaultMessage) => {
    console.error("API Error details:", error);
    const responseData = error.response?.data;
    if (!responseData) {
      toast.error(error.message || defaultMessage);
      return;
    }

    if (error.response?.status === 400 && typeof responseData === 'string') {
      if (responseData.toLowerCase().includes("subject code")) {
        setFieldErrors({ subjectCode: responseData });
      }
      toast.error(responseData);
      return;
    }

    toast.error(responseData.message || defaultMessage);
  };

  // CRUD actions
  const handleSaveSubject = async (formData) => {
    setFormErrors({});
    try {
      if (view === 'edit') {
        const updated = await updateSubject(id, formData);
        setSubjects(prev => prev.map(s => String(s.id) === String(id) ? updated : s));
        toast.success('Subject updated successfully');
      } else {
        const created = await createSubject(formData);
        setSubjects(prev => [created, ...prev]);
        toast.success('Subject registered successfully');
      }
      navigate('/subjects');
    } catch (error) {
      handleApiError(error, setFormErrors, view === 'edit' ? 'Failed to update subject profile' : 'Failed to save subject');
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingSubject) {
      try {
        await deleteSubject(deletingSubject.id);
        setSubjects(prev => prev.filter(s => String(s.id) !== String(deletingSubject.id)));
        toast.success('Subject deleted successfully');
      } catch (error) {
        console.error('Failed to delete subject:', error);
        toast.error(error.message || 'Failed to delete subject');
      }
    }
    setIsDeleteOpen(false);
    setDeletingSubject(null);
  };

  const handleToggleStatus = async (subject) => {
    const newStatus = subject.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const updated = await updateSubjectStatus(subject.id, newStatus);
      setSubjects(prev => prev.map(s => String(s.id) === String(subject.id) ? updated : s));
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to toggle status:', error);
      toast.error(error.message || 'Failed to update status');
    }
  };

  // Loading skeleton while data is fetching
  if (isLoading && view === 'list') {
    return <LoadingSkeleton />;
  }

  // Edit/Details view loading states
  if (!activeSubject && (view === 'edit' || view === 'details')) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin"></div>
      </div>
    );
  }

  // 1. ADD SUBJECT VIEW
  if (view === 'add') {
    return (
      <div className="max-w-7xl mx-auto pb-12">
        <div className="mb-6">
          <button
            onClick={() => navigate('/subjects')}
            className="text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center gap-1"
          >
            ← Back to Subject List
          </button>
        </div>
        <SubjectForm
          onSave={handleSaveSubject}
          onCancel={() => navigate('/subjects')}
          apiErrors={formErrors}
        />
      </div>
    );
  }

  // 2. EDIT SUBJECT VIEW
  if (view === 'edit') {
    return (
      <div className="max-w-7xl mx-auto pb-12">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/subjects/${id}`)}
            className="text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center gap-1"
          >
            ← Back to Details
          </button>
        </div>
        <SubjectForm
          initialData={activeSubject}
          onSave={handleSaveSubject}
          onCancel={() => navigate(`/subjects/${id}`)}
          apiErrors={formErrors}
        />
      </div>
    );
  }

  // 3. SUBJECT DETAILS VIEW
  if (view === 'details') {
    return (
      <div className="max-w-7xl mx-auto pb-12">
        <SubjectProfile
          subject={activeSubject}
          onBack={() => navigate('/subjects')}
          onEdit={(sid) => navigate(`/subjects/${sid}/edit`)}
        />
      </div>
    );
  }

  // 4. SUBJECT LIST VIEW (Default)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-7xl mx-auto pb-12"
    >
      {/* Page Header */}
      <PageHeader
        title="Subject Management Dashboard"
        subtitle="Configure curriculum details, subject codes, descriptions, and active status settings."
        actionButton={
          <button
            onClick={() => navigate('/subjects/add')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white font-semibold text-sm rounded-[16px] hover:bg-[#1D4ED8] transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <PlusCircle size={18} /> Add Subject
          </button>
        }
      />

      {/* Top Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={BookOpen}
          title="Total Subjects"
          value={stats.total}
          description="Registered subjects"
          colorClass="text-[#2563EB]"
          bgClass="bg-[#2563EB]/10"
        />
        <StatsCard
          icon={CheckCircle}
          title="Active Subjects"
          value={stats.active}
          description={`${stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% currently active`}
          colorClass="text-[#16A34A]"
          bgClass="bg-[#16A34A]/10"
        />
        <StatsCard
          icon={AlertTriangle}
          title="Inactive Subjects"
          value={stats.inactive}
          description="Suspended course profiles"
          colorClass="text-[#DC2626]"
          bgClass="bg-[#DC2626]/10"
        />
        <StatsCard
          icon={Clock}
          title="Recently Added"
          value={stats.recentlyAdded}
          description="Added in last 180 days"
          colorClass="text-[#F59E0B]"
          bgClass="bg-[#F59E0B]/10"
        />
      </div>

      {/* Filtering & Search Toolbar */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-4 sm:p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5 mr-1">
            <Filter size={14} /> Filter By:
          </span>
          <FilterDropdown
            label="Status"
            options={['Active', 'Inactive']}
            selectedValue={statusFilter}
            onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
          />
          <SearchBar
            value={localSearch}
            onChange={(v) => { setLocalSearch(v); setCurrentPage(1); }}
            placeholder="Search by code, name, syllabus..."
          />
        </div>

        {(statusFilter || localSearch) && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#DC2626] bg-[#DC2626]/5 hover:bg-[#DC2626]/10 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw size={14} /> Reset Filters
          </button>
        )}
      </div>

      {/* Main Subject Table Grid */}
      <SubjectTable
        subjects={paginatedSubjects}
        sortField={sortField}
        sortDir={sortDir}
        onSort={handleSort}
        onView={(s) => navigate(`/subjects/${s.id}`)}
        onEdit={(s) => navigate(`/subjects/${s.id}/edit`)}
        onDelete={(s) => { setDeletingSubject(s); setIsDeleteOpen(true); }}
        onAddSubject={() => navigate('/subjects/add')}
        onToggleStatus={handleToggleStatus}
      />

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredSubjects.length}
        itemsPerPage={itemsPerPage}
        itemLabel="subjects"
      />

      {/* Deletion Dialog */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setDeletingSubject(null); }}
        onConfirm={handleConfirmDelete}
        subjectName={deletingSubject?.name}
      />
    </motion.div>
  );
};

export default SubjectsPage;
