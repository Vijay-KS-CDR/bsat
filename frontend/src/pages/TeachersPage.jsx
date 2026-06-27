import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Users, UserCheck, GraduationCap, Award, Sparkles, UserPlus, Filter, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

// Shared Components
import StatsCard from '../components/dashboard/StatsCard';
import PageHeader from '../components/dashboard/PageHeader';
import FilterDropdown from '../components/dashboard/FilterDropdown';
import SearchBar from '../components/dashboard/SearchBar';
import Pagination from '../components/dashboard/Pagination';
import LoadingSkeleton from '../components/dashboard/LoadingSkeleton';

// Teacher Specific Components
import TeacherTable from '../components/teachers/TeacherTable';
import TeacherForm from '../components/teachers/TeacherForm';
import TeacherProfile from '../components/teachers/TeacherProfile';
import DeleteModal from '../components/teachers/DeleteModal';

// Mock API
import {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  updateTeacherStatus
} from '../api/teacherApi';

const TeachersPage = ({ globalSearch = '', onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Determine current view from URL route
  const view = useMemo(() => {
    const path = location.pathname;
    if (path === '/teachers/add') return 'add';
    if (path.endsWith('/edit')) return 'edit';
    if (id) return 'details';
    return 'list';
  }, [location, id]);

  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTeacher, setActiveTeacher] = useState(null);

  // Filters state (only applicable in list view)
  const [statusFilter, setStatusFilter] = useState('');
  const [localSearch, setLocalSearch] = useState('');

  // Sorting state
  const [sortField, setSortField] = useState('employeeId');
  const [sortDir, setSortDir] = useState('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingTeacher, setDeletingTeacher] = useState(null);

  // Form error mapping state
  const [formErrors, setFormErrors] = useState({});


  // Load all teachers (always load to sync statistics and table data)
  const loadTeachers = async () => {
    setIsLoading(true);
    try {
      const data = await getTeachers();
      setTeachers(data);
    } catch (error) {
      console.error('Failed to load teachers:', error);
      toast.error('Failed to load teachers from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  // Fetch teacher details when route contains :id for details or edit view
  useEffect(() => {
    if (id && (view === 'edit' || view === 'details')) {
      const loadActiveTeacher = async () => {
        try {
          const data = await getTeacherById(id);
          setActiveTeacher(data);
        } catch (error) {
          console.error('Failed to load teacher:', error);
          toast.error('Teacher record not found.');
          navigate('/teachers');
        }
      };
      loadActiveTeacher();
    } else {
      setActiveTeacher(null);
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
    const total = teachers.length;
    const active = teachers.filter(t => t.status === 'Active').length;
    const inactive = teachers.filter(t => t.status === 'Inactive').length;
    const avgExp = total > 0 ? Math.round(teachers.reduce((sum, t) => sum + (t.experience || 0), 0) / total) : 0;
    return { total, active, inactive, avgExp };
  }, [teachers]);

  // Filtered and sorted teachers
  const filteredTeachers = useMemo(() => {
    return teachers
      .filter((t) => {
        const q = localSearch.toLowerCase().trim();
        const matchSearch =
          !q ||
          t.name.toLowerCase().includes(q) ||
          t.employeeId.toLowerCase().includes(q) ||
          t.phone.includes(q);
        const matchStatus = !statusFilter || t.status === statusFilter;
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
  }, [teachers, localSearch, statusFilter, sortField, sortDir]);

  // Paginated array
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const paginatedTeachers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTeachers.slice(start, start + itemsPerPage);
  }, [filteredTeachers, currentPage]);

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

  // Error handling utility matching student page
  const handleApiError = (error, setFieldErrors, defaultMessage) => {
    console.error("API Error details:", error);
    const responseData = error.response?.data;
    if (!responseData) {
      toast.error(error.message || defaultMessage);
      return;
    }

    if (error.response?.status === 400 && typeof responseData === 'string') {
      if (responseData.toLowerCase().includes("employee id")) {
        setFieldErrors({ employeeId: responseData });
      } else if (responseData.toLowerCase().includes("login id")) {
        setFieldErrors({ loginId: responseData });
      }
      toast.error(responseData);
      return;
    }

    toast.error(responseData.message || defaultMessage);
  };

  // CRUD actions
  const handleSaveTeacher = async (formData) => {
    setFormErrors({});
    try {
      if (view === 'edit') {
        const updated = await updateTeacher(id, formData);
        setTeachers(prev => prev.map(t => String(t.id) === String(id) ? updated : t));
        toast.success('Teacher updated successfully');
      } else {
        const created = await createTeacher(formData);
        setTeachers(prev => [created, ...prev]);
        toast.success('Teacher registered successfully');
      }
      navigate('/teachers');
    } catch (error) {
      handleApiError(error, setFormErrors, view === 'edit' ? 'Failed to update teacher profile' : 'Failed to save teacher');
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingTeacher) {
      try {
        await deleteTeacher(deletingTeacher.id);
        setTeachers(prev => prev.filter(t => String(t.id) !== String(deletingTeacher.id)));
        toast.success('Teacher deleted successfully');
      } catch (error) {
        console.error('Failed to delete teacher:', error);
        toast.error(error.message || 'Failed to delete teacher');
      }
    }
    setIsDeleteOpen(false);
    setDeletingTeacher(null);
  };

  const handleToggleStatus = async (teacher) => {
    const newStatus = teacher.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const updated = await updateTeacherStatus(teacher.id, newStatus);
      setTeachers(prev => prev.map(t => String(t.id) === String(teacher.id) ? updated : t));
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
  if (!activeTeacher && (view === 'edit' || view === 'details')) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin"></div>
      </div>
    );
  }

  // 1. ADD TEACHER VIEW
  if (view === 'add') {
    return (
      <div className="max-w-7xl mx-auto pb-12">
        <div className="mb-6">
          <button
            onClick={() => navigate('/teachers')}
            className="text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center gap-1"
          >
            ← Back to Teacher List
          </button>
        </div>
        <TeacherForm
          onSave={handleSaveTeacher}
          onCancel={() => navigate('/teachers')}
          apiErrors={formErrors}
        />
      </div>
    );
  }

  // 2. EDIT TEACHER VIEW
  if (view === 'edit') {
    return (
      <div className="max-w-7xl mx-auto pb-12">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/teachers/${id}`)}
            className="text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center gap-1"
          >
            ← Back to Details
          </button>
        </div>
        <TeacherForm
          initialData={activeTeacher}
          onSave={handleSaveTeacher}
          onCancel={() => navigate(`/teachers/${id}`)}
          apiErrors={formErrors}
        />
      </div>
    );
  }

  // 3. TEACHER DETAILS VIEW
  if (view === 'details') {
    return (
      <div className="max-w-7xl mx-auto pb-12">
        <TeacherProfile
          teacher={activeTeacher}
          onBack={() => navigate('/teachers')}
          onEdit={(tid) => navigate(`/teachers/${tid}/edit`)}
        />
      </div>
    );
  }

  // 4. TEACHER LIST VIEW (Default)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-7xl mx-auto pb-12"
    >
      {/* Page Header */}
      <PageHeader
        title="Teacher Management Dashboard"
        subtitle="Manage educator profiles, qualifications, experience years, contact data, and account status."
        actionButton={
          <button
            onClick={() => navigate('/teachers/add')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white font-semibold text-sm rounded-[16px] hover:bg-[#1D4ED8] transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <UserPlus size={18} /> Add Teacher
          </button>
        }
      />

      {/* Top Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={GraduationCap}
          title="Total Teachers"
          value={stats.total}
          description="Registered instructors"
          colorClass="text-[#2563EB]"
          bgClass="bg-[#2563EB]/10"
        />
        <StatsCard
          icon={UserCheck}
          title="Active Teachers"
          value={stats.active}
          description={`${stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% currently active`}
          colorClass="text-[#16A34A]"
          bgClass="bg-[#16A34A]/10"
        />
        <StatsCard
          icon={Users}
          title="Inactive Teachers"
          value={stats.inactive}
          description="Profiles suspended/inactive"
          colorClass="text-[#64748B]"
          bgClass="bg-[#64748B]/10"
        />
        <StatsCard
          icon={Award}
          title="Average Experience"
          value={`${stats.avgExp} Yrs`}
          description="Average teaching experience"
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
            placeholder="Search by name, ID or phone..."
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

      {/* Main Teacher Table Grid */}
      <TeacherTable
        teachers={paginatedTeachers}
        sortField={sortField}
        sortDir={sortDir}
        onSort={handleSort}
        onView={(t) => navigate(`/teachers/${t.id}`)}
        onEdit={(t) => navigate(`/teachers/${t.id}/edit`)}
        onDelete={(t) => { setDeletingTeacher(t); setIsDeleteOpen(true); }}
        onAddTeacher={() => navigate('/teachers/add')}
        onToggleStatus={handleToggleStatus}
      />

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredTeachers.length}
        itemsPerPage={itemsPerPage}
        itemLabel="teachers"
      />

      {/* Deletion Dialog */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setDeletingTeacher(null); }}
        onConfirm={handleConfirmDelete}
        teacherName={deletingTeacher?.name}
      />
    </motion.div>
  );
};

export default TeachersPage;
