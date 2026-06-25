import React, { useState, useMemo, useEffect } from 'react';
import { Users, UserCheck, Sparkles, UserPlus, Filter, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

import mockStudents from '../mock/studentsData.json';
import StatsCard from '../components/dashboard/StatsCard';
import PageHeader from '../components/dashboard/PageHeader';
import FilterDropdown from '../components/dashboard/FilterDropdown';
import Pagination from '../components/dashboard/Pagination';
import LoadingSkeleton from '../components/dashboard/LoadingSkeleton';

import StudentTable from '../components/students/StudentTable';
import StudentForm from '../components/students/StudentForm';
import StudentDetailsModal from '../components/students/StudentDetailsModal';
import DeleteModal from '../components/dashboard/DeleteModal';

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

  // Load initial mock JSON
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setStudents(mockStudents);
      setIsLoading(false);
    }, 600); // Simulate network load
    return () => clearTimeout(timer);
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

  // CRUD Actions
  const handleSaveStudent = (formData) => {
    if (editingStudent) {
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? { ...s, ...formData } : s));
    } else {
      const newRecord = {
        ...formData,
        id: String(Date.now()),
        createdDate: new Date().toISOString().split('T')[0],
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
      };
      setStudents(prev => [newRecord, ...prev]);
    }
    setIsFormOpen(false);
    setEditingStudent(null);
  };

  const handleConfirmDelete = () => {
    if (deletingStudent) {
      setStudents(prev => prev.filter(s => s.id !== deletingStudent.id));
    }
    setIsDeleteOpen(false);
    setDeletingStudent(null);
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
            onClick={() => { setEditingStudent(null); setIsFormOpen(true); }}
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
            options={['9', '10', '11', '12']}
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
        onEdit={(st) => { setEditingStudent(st); setIsFormOpen(true); }}
        onDelete={(st) => { setDeletingStudent(st); setIsDeleteOpen(true); }}
        onAddStudent={() => { setEditingStudent(null); setIsFormOpen(true); }}
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
      />

      <StudentDetailsModal
        student={viewingStudent}
        isOpen={isDetailsOpen}
        onClose={() => { setIsDetailsOpen(false); setViewingStudent(null); }}
        onEdit={(st) => { setEditingStudent(st); setIsFormOpen(true); }}
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
