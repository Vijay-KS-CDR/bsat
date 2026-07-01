import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, User, FileText, AlertCircle, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PageHeader from '../components/dashboard/PageHeader';
import LoadingSkeleton from '../components/dashboard/LoadingSkeleton';
import EmptyState from '../components/dashboard/EmptyState';
import SearchBar from '../components/dashboard/SearchBar';
import Pagination from '../components/dashboard/Pagination';
import { getPendingEvaluations } from '../api/evaluationApi';

const ITEMS_PER_PAGE = 8;

const EvaluationDashboard = () => {
  const [pendingAnswers, setPendingAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getPendingEvaluations();
      setPendingAnswers(data || []);
    } catch (error) {
      console.error('Failed to load pending evaluations:', error);
      toast.error('Failed to load pending evaluations.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Group pending answers by attemptId to represent submission sheets
  const pendingAttempts = useMemo(() => {
    const map = {};
    pendingAnswers.forEach((ans) => {
      if (!map[ans.attemptId]) {
        map[ans.attemptId] = {
          attemptId: ans.attemptId,
          studentName: ans.studentName,
          testName: ans.testName,
          pendingQuestionsCount: 0,
        };
      }
      map[ans.attemptId].pendingQuestionsCount++;
    });
    return Object.values(map);
  }, [pendingAnswers]);

  // Filter by search query
  const filteredAttempts = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return pendingAttempts;
    return pendingAttempts.filter(
      (a) =>
        a.studentName.toLowerCase().includes(q) ||
        a.testName.toLowerCase().includes(q)
    );
  }, [pendingAttempts, search]);

  const totalPages = Math.ceil(filteredAttempts.length / ITEMS_PER_PAGE);
  const paginatedAttempts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAttempts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAttempts, currentPage]);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto pb-12 select-none"
    >
      <PageHeader
        title="Manual Evaluation Dashboard"
        subtitle="Review student descriptive responses, award marks, and finalize pending attempts."
      />

      <div className="bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-[#E2E8F0]">
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
            placeholder="Search by student name or test name..."
          />
          <div className="text-xs text-[#64748B]">
            <span className="font-semibold text-[#0F172A]">{filteredAttempts.length}</span> attempt{filteredAttempts.length !== 1 ? 's' : ''} require evaluation
          </div>
        </div>

        {paginatedAttempts.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="All caught up!"
            description={
              search
                ? 'No pending attempts match your search.'
                : 'There are currently no student attempts pending manual descriptive review.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-[#64748B] uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-[#64748B] uppercase tracking-wider">
                    Test Title
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-[#64748B] uppercase tracking-wider">
                    Pending Questions
                  </th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-[#64748B] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {paginatedAttempts.map((attempt, idx) => (
                  <motion.tr
                    key={attempt.attemptId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-[#F8FAFC] transition-colors"
                  >
                    {/* Student Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
                          <User size={14} />
                        </div>
                        <span className="font-semibold text-[#0F172A]">{attempt.studentName}</span>
                      </div>
                    </td>

                    {/* Test Title */}
                    <td className="px-6 py-4 text-[#475569]">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-[#64748B]" />
                        <span>{attempt.testName}</span>
                      </div>
                    </td>

                    {/* Pending Count */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
                        <AlertCircle size={12} />
                        {attempt.pendingQuestionsCount} descriptive response{attempt.pendingQuestionsCount !== 1 ? 's' : ''}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/evaluations/attempt/${attempt.attemptId}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-colors cursor-pointer shadow-xs"
                      >
                        <Eye size={12} /> Review & Score
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
          totalItems={filteredAttempts.length}
          itemsPerPage={ITEMS_PER_PAGE}
          itemLabel="attempts"
        />
      </div>
    </motion.div>
  );
};

export default EvaluationDashboard;
