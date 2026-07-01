import React, { useState, useEffect, useMemo } from 'react';
import { Eye, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/dashboard/PageHeader';
import SearchBar from '../../components/dashboard/SearchBar';
import Pagination from '../../components/dashboard/Pagination';
import LoadingSkeleton from '../../components/dashboard/LoadingSkeleton';
import EmptyState from '../../components/dashboard/EmptyState';
import { getStudentResults } from '../../api/studentPortalApi';

const ITEMS_PER_PAGE = 5;

const getPercentageColor = (pct) => {
  if (pct >= 80) return 'text-[#16A34A]';
  if (pct >= 60) return 'text-[#F59E0B]';
  return 'text-[#DC2626]';
};

const getGradeBadge = (grade) => {
  const map = {
    'A+': 'bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20',
    A: 'bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20',
    'B+': 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20',
    B: 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20',
    C: 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20',
    D: 'bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20',
  };
  return map[grade] || 'bg-[#64748B]/10 text-[#64748B] border border-[#64748B]/20';
};

const StudentResultsPage = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    getStudentResults()
      .then(setResults)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredResults = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return results;
    return results.filter(
      (r) =>
        r.testName.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q)
    );
  }, [results, search]);

  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResults.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredResults, currentPage]);

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
        title="My Results"
        subtitle="Review your performance across all completed tests."
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
          <div className="text-xs text-[#64748B]">
            <span className="font-semibold text-[#0F172A]">{filteredResults.length}</span> result{filteredResults.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {paginatedResults.length === 0 ? (
          <EmptyState
            icon={Award}
            title="No results found"
            description={
              search
                ? 'No results match your search.'
                : 'You have no completed tests yet. Complete a test to see your results here.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  {['Test Name', 'Marks Obtained', 'Total Marks', 'Percentage', 'Grade', 'Actions'].map((col) => (
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
                {paginatedResults.map((result, idx) => (
                  <motion.tr
                    key={result.testId || result.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors"
                  >
                    {/* Test Name */}
                    <td className="px-5 py-4">
                      <div>
                        <span className="font-semibold text-[#0F172A] line-clamp-1 max-w-xs block">
                          {result.testName}
                        </span>
                        <span className="text-xs text-[#64748B]">{result.subject}</span>
                      </div>
                    </td>

                    {/* Marks Obtained */}
                    <td className="px-5 py-4">
                      <span className="font-bold text-[#0F172A]">{result.marksObtained}</span>
                    </td>

                    {/* Total Marks */}
                    <td className="px-5 py-4">
                      <span className="text-[#64748B]">{result.totalMarks}</span>
                    </td>

                    {/* Percentage */}
                    <td className="px-5 py-4">
                      <span className={`font-bold ${getPercentageColor(result.percentage)}`}>
                        {result.percentage.toFixed(1)}%
                      </span>
                    </td>

                    {/* Grade */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getGradeBadge(result.grade)}`}>
                        {result.grade}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => navigate(`/student/results/${result.testId || result.id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#2563EB] bg-[#2563EB]/10 hover:bg-[#2563EB]/20 rounded-lg transition-colors"
                      >
                        <Eye size={14} /> View Result
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredResults.length}
          itemsPerPage={ITEMS_PER_PAGE}
          itemLabel="results"
        />
      </div>
    </motion.div>
  );
};

export default StudentResultsPage;
