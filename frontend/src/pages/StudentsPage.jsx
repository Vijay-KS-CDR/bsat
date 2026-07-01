import React, { useState, useMemo, useEffect } from 'react';
import { Users, UserCheck, Sparkles, UserPlus, Filter, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

import StatsCard from '../components/dashboard/StatsCard';
import PageHeader from '../components/dashboard/PageHeader';
import FilterDropdown from '../components/dashboard/FilterDropdown';
import Pagination from '../components/dashboard/Pagination';
import LoadingSkeleton from '../components/dashboard/LoadingSkeleton';

import StudentTable from '../components/students/StudentTable';
import StudentForm from '../components/students/StudentForm';
import StudentDetailsModal from '../components/students/StudentDetailsModal';
import DeleteModal from '../components/dashboard/DeleteModal';

import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  updateStudentStatus
} from '../api/studentApi';

const StudentsPage = ({ globalSearch = '' }) => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [localSearch, setLocalSearch] = useState('');

  // Sorting state
  const [sortField, setSortField] = useState('admissionNumber');
  const [sortDir, setSortDir] = useState('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState(null);

  // API validation errors state
  const [formErrors, setFormErrors] = useState({});

  // Fetch student data from backend
  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Failed to load students:', error);
      toast.error('Failed to load students from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Sync global topnav search with local search
  useEffect(() => {
    if (globalSearch !== undefined) {
      setLocalSearch(globalSearch);
      setCurrentPage(1);
    }
  }, [globalSearch]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter(s => s.status === 'Active').length;
    const boys = students.filter(s => s.gender === 'Boy').length;
    const girls = students.filter(s => s.gender === 'Girl').length;
    return { total, active, boys, girls };
  }, [students]);

  // Filtered & Sorted student array
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = localSearch.toLowerCase().trim();
      const matchSearch = !q || 
        s.name.toLowerCase().includes(q) || 
        s.admissionNumber.toLowerCase().includes(q) ||
        s.parentPhone.includes(q);
      const matchClass = !classFilter || s.class === classFilter;
      const matchSection = !sectionFilter || s.section === sectionFilter;
      const matchStatus = !statusFilter || s.status === statusFilter;

      return matchSearch && matchClass && matchSection && matchStatus;
    }).sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [students, localSearch, classFilter, sectionFilter, statusFilter, sortField, sortDir]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const resetFilters = () => {
    setClassFilter('');
    setSectionFilter('');
    setStatusFilter('');
    setLocalSearch('');
    setCurrentPage(1);
  };

  // Helper to open form modals resetting validation errors
  const openAddForm = () => {
    setFormErrors({});
    setEditingStudent(null);
    setIsFormOpen(true);
  };

  const openEditForm = (st) => {
    setFormErrors({});
    setEditingStudent(st);
    setIsFormOpen(true);
  };

  // Utility to parse backend API validation and business errors
  const handleApiError = (error, setFieldErrors, defaultMessage) => {
    console.error("API error details:", {
      statusCode: error.response?.status,
      responseBody: error.response?.data,
      errorMessage: error.message
    });

    const responseData = error.response?.data;
    if (!responseData) {
      toast.error(error.message || defaultMessage);
      return;
    }

    // 1. Spring Validation Field Errors
    if (responseData.errors && Array.isArray(responseData.errors)) {
      const fieldErrors = {};
      responseData.errors.forEach(err => {
        const field = err.field === 'className' ? 'class' : (err.field === 'dateOfBirth' ? 'dob' : err.field);
        fieldErrors[field] = err.defaultMessage;
      });
      setFieldErrors(fieldErrors);
      toast.error("Please fix the validation errors below.");
      return;
    }

    // 2. Exception messages (String responses from controllers)
    if (typeof responseData === 'string') {
      if (responseData.toLowerCase().includes("admission number")) {
        setFieldErrors({ admissionNumber: responseData });
      } else if (responseData.toLowerCase().includes("login id")) {
        setFieldErrors({ loginId: responseData });
      }
      toast.error(responseData);
      return;
    }

    // 3. Fallback General Message
    const generalMsg = responseData.message || defaultMessage;
    toast.error(generalMsg);
  };

  // CRUD Actions
  const handleSaveStudent = async (formData) => {
    setFormErrors({});
    try {
      if (editingStudent) {
        const updated = await updateStudent(editingStudent.id, formData);
        setStudents(prev => prev.map(s => s.id === editingStudent.id ? updated : s));
        toast.success('Student updated successfully');
      } else {
        const created = await createStudent(formData);
        setStudents(prev => [created, ...prev]);
        toast.success('Student created successfully');
      }
      setIsFormOpen(false);
      setEditingStudent(null);
    } catch (error) {
      handleApiError(error, setFormErrors, editingStudent ? 'Failed to update student' : 'Failed to save student');
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingStudent) {
      try {
        await deleteStudent(deletingStudent.id);
        setStudents(prev => prev.filter(s => s.id !== deletingStudent.id));
        toast.success('Student deleted successfully');
      } catch (error) {
        console.error('Failed to delete student:', error);
        toast.error(error.response?.data || error.message || 'Failed to delete student');
      }
    }
    setIsDeleteOpen(false);
    setDeletingStudent(null);
  };

  const handleToggleStatus = async (student) => {
    const newStatus = student.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const updated = await updateStudentStatus(student.id, newStatus);
      setStudents(prev => prev.map(s => s.id === student.id ? updated : s));
      toast.success(`Status updated successfully to ${newStatus}`);
    } catch (error) {
      console.error('Failed to toggle status:', error);
      toast.error(error.response?.data || error.message || 'Failed to update status');
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-7xl mx-auto pb-12"
    >
      {/* Page Header */}
      <PageHeader
        title="Student Management Dashboard"
        subtitle="Manage student enrollments, class allocations, parent contact details, and account status."
        actionButton={
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white font-semibold text-sm rounded-[16px] hover:bg-[#1D4ED8] transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <UserPlus size={18} /> Add Student
          </button>
        }
      />

      {/* Top Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Users}
          title="Total Students"
          value={stats.total}
          description="Total enrolled in academy"
          colorClass="text-[#2563EB]"
          bgClass="bg-[#2563EB]/10"
        />
        <StatsCard
          icon={UserCheck}
          title="Active Students"
          value={stats.active}
          description={`${Math.round((stats.active / (stats.total || 1)) * 100)}% currently active`}
          colorClass="text-[#16A34A]"
          bgClass="bg-[#16A34A]/10"
        />
        <StatsCard
          icon={Sparkles}
          title="Boys Enrolled"
          value={stats.boys}
          description="Male student ratio"
          colorClass="text-[#F59E0B]"
          bgClass="bg-[#F59E0B]/10"
        />
        <StatsCard
          icon={Sparkles}
          title="Girls Enrolled"
          value={stats.girls}
          description="Female student ratio"
          colorClass="text-[#6366f1]"
          bgClass="bg-[#6366f1]/10"
        />
      </div>

      {/* Filtering Toolbar */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-4 sm:p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5 mr-1">
            <Filter size={14} /> Filter By:
          </span>
          <FilterDropdown
            label="Class"
            options={['6', '7', '8', '9', '10', '11', '12']}
            selectedValue={classFilter}
            onChange={(v) => { setClassFilter(v); setCurrentPage(1); }}
          />
          <FilterDropdown
            label="Section"
            options={['A', 'B', 'C']}
            selectedValue={sectionFilter}
            onChange={(v) => { setSectionFilter(v); setCurrentPage(1); }}
          />
          <FilterDropdown
            label="Status"
            options={['Active', 'Inactive']}
            selectedValue={statusFilter}
            onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
          />
        </div>

        {(classFilter || sectionFilter || statusFilter || localSearch) && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#DC2626] bg-[#DC2626]/5 hover:bg-[#DC2626]/10 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw size={14} /> Reset Filters
          </button>
        )}
      </div>

      {/* Main Student Data Table */}
      <StudentTable
        students={paginatedStudents}
        sortField={sortField}
        sortDir={sortDir}
        onSort={handleSort}
        onView={(st) => { setViewingStudent(st); setIsDetailsOpen(true); }}
        onEdit={openEditForm}
        onDelete={(st) => { setDeletingStudent(st); setIsDeleteOpen(true); }}
        onAddStudent={openAddForm}
        onToggleStatus={handleToggleStatus}
      />

      {/* Table Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredStudents.length}
        itemsPerPage={itemsPerPage}
      />

      {/* Modals & Dialogs */}
      <StudentForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingStudent(null); }}
        onSave={handleSaveStudent}
        initialData={editingStudent}
        apiErrors={formErrors}
      />

      <StudentDetailsModal
        student={viewingStudent}
        isOpen={isDetailsOpen}
        onClose={() => { setIsDetailsOpen(false); setViewingStudent(null); }}
        onEdit={openEditForm}
      />

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setDeletingStudent(null); }}
        onConfirm={handleConfirmDelete}
        studentName={deletingStudent?.name}
      />
    </motion.div>
  );
};

export default StudentsPage;
