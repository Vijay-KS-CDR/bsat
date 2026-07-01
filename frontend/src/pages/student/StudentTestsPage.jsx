import React, { useState, useEffect, useMemo } from 'react';
import { Eye, PlayCircle, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/dashboard/PageHeader';
import SearchBar from '../../components/dashboard/SearchBar';
import StatusBadge from '../../components/dashboard/StatusBadge';
import Pagination from '../../components/dashboard/Pagination';
import LoadingSkeleton from '../../components/dashboard/LoadingSkeleton';
import EmptyState from '../../components/dashboard/EmptyState';
import { getStudentTests } from '../../api/studentPortalApi';

const ITEMS_PER_PAGE = 5;

const StudentTestsPage = () => {
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    getStudentTests()
      .then(setTests)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredTests = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return tests;
    return tests.filter(
      (t) =>
        t.testName.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q)
    );
  }, [tests, search]);

  const totalPages = Math.ceil(filteredTests.length / ITEMS_PER_PAGE);
  const paginatedTests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTests.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTests, currentPage]);

  const handleSearchChange = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto pb-12"
    >
      <PageHeader
        title="My Tests"
        subtitle="View all your assigned and completed tests. Start a test when you are ready."
      />

      {/* Table Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-[#E2E8F0]">
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by test name or subject..."
          />
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <span className="font-semibold text-[#0F172A]">{filteredTests.length}</span> test{filteredTests.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Table */}
        {paginatedTests.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No tests found"
            description={
              search
                ? 'No tests match your search. Try a different keyword.'
                : 'You have no tests assigned yet. Check back later.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  {['Test Name', 'Subject', 'Duration', 'Status', 'Actions'].map((col) => (
                    <th
                      key={col}
                      className="px-5 py-3.5 text-left text-xs font-bold text-[#64748B] uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedTests.map((test, idx) => (
                  <motion.tr
                    key={test.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors"
                  >
                    {/* Test Name */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-[#0F172A] line-clamp-1 max-w-xs">
                        {test.testName}
                      </span>
                    </td>

                    {/* Subject */}
                    <td className="px-5 py-4">
                      <span className="text-[#64748B] font-medium">{test.subject}</span>
                    </td>

                    {/* Duration */}
                    <td className="px-5 py-4">
                      <span className="text-[#64748B]">{test.duration} min</span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={test.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/student/tests/${test.id}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#2563EB] bg-[#2563EB]/10 hover:bg-[#2563EB]/20 rounded-lg transition-colors"
                        >
                          <Eye size={14} /> View
                        </button>
                        {test.status === 'ASSIGNED' ? (
                          <button
                            onClick={() => navigate(`/student/tests/${test.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors shadow-xs"
                          >
                            <PlayCircle size={14} /> Start Test
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate(`/student/results/${test.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-lg transition-colors shadow-xs"
                          >
                            <Eye size={14} /> View Result
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredTests.length}
          itemsPerPage={ITEMS_PER_PAGE}
          itemLabel="tests"
        />
      </div>
    </motion.div>
  );
};

export default StudentTestsPage;
