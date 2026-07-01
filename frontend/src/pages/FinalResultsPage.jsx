import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, FileText, ArrowLeft, User, AlertCircle, CheckCircle, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PageHeader from '../components/dashboard/PageHeader';
import LoadingSkeleton from '../components/dashboard/LoadingSkeleton';
import EmptyState from '../components/dashboard/EmptyState';
import SearchBar from '../components/dashboard/SearchBar';
import Pagination from '../components/dashboard/Pagination';
import { getTests } from '../api/testApi';
import { getResultsByTest } from '../api/evaluationApi';

const ITEMS_PER_PAGE = 8;

const FinalResultsPage = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResultsLoading, setIsResultsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Load all tests initially
  const loadTests = async () => {
    setIsLoading(true);
    try {
      const data = await getTests();
      // Exclude draft status if needed, but display all published or completed tests
      setTests(data || []);
    } catch (error) {
      console.error('Failed to load tests:', error);
      toast.error('Failed to load test lists.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
  }, []);

  // Fetch results when a test is selected
  const handleSelectTest = async (test) => {
    setSelectedTest(test);
    setIsResultsLoading(true);
    setSearch('');
    setCurrentPage(1);
    try {
      const data = await getResultsByTest(test.id);
      setResults(data || []);
    } catch (error) {
      console.error('Failed to load results:', error);
      toast.error('Failed to load student results for this test.');
    } finally {
      setIsResultsLoading(false);
    }
  };

  // Search filter
  const filteredData = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (selectedTest) {
      // Filter results by student name
      if (!q) return results;
      return results.filter(r => r.studentName.toLowerCase().includes(q));
    } else {
      // Filter tests by name or subject
      if (!q) return tests;
      return tests.filter(
        t =>
          t.testName.toLowerCase().includes(q) ||
          (t.subject && t.subject.subjectName.toLowerCase().includes(q))
      );
    }
  }, [selectedTest, tests, results, search]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto pb-12 select-none"
    >
      <PageHeader
        title={selectedTest ? `Results: ${selectedTest.testName}` : "Student Performance & Results"}
        subtitle={selectedTest ? `Reviewing grades and scored marks for this test.` : "Select an assessment test to inspect score summaries and student performance logs."}
        actionButton={selectedTest && (
          <button
            onClick={() => setSelectedTest(null)}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#E2E8F0] hover:bg-slate-50 text-[#64748B] hover:text-[#0F172A] text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Tests
          </button>
        )}
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
            placeholder={selectedTest ? "Search by student name..." : "Search by test name or subject..."}
          />
          <div className="text-xs text-[#64748B]">
            <span className="font-semibold text-[#0F172A]">{filteredData.length}</span> {selectedTest ? 'student result' : 'test'}{filteredData.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {isResultsLoading ? (
          <LoadingSkeleton />
        ) : paginatedData.length === 0 ? (
          <EmptyState
            icon={selectedTest ? Award : FileText}
            title={selectedTest ? "No results recorded" : "No tests found"}
            description={
              search
                ? 'No matches found.'
                : selectedTest
                ? 'No students have submitted this test yet.'
                : 'No tests are registered in the portal database.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            {!selectedTest ? (
              /* TEST LIST VIEW */
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-[#64748B] uppercase tracking-wider">Test Name</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-[#64748B] uppercase tracking-wider">Class & Section</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-[#64748B] uppercase tracking-wider">Total Questions</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-[#64748B] uppercase tracking-wider">Max Marks</th>
                    <th className="px-6 py-3.5 text-right text-xs font-bold text-[#64748B] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {paginatedData.map((test, idx) => (
                    <motion.tr
                      key={test.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <span className="font-semibold text-[#0F172A] block">{test.testName}</span>
                          <span className="text-xs text-[#64748B]">{test.subject ? test.subject.subjectName : 'General'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#475569] font-medium">
                        Class {test.className} {test.section ? `• Sec ${test.section}` : ''}
                      </td>
                      <td className="px-6 py-4 text-[#64748B] font-mono">{test.totalQuestions}</td>
                      <td className="px-6 py-4 text-[#2563EB] font-bold font-mono">{test.totalMarks}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleSelectTest(test)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB]/10 hover:bg-[#2563EB]/20 text-[#2563EB] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                        >
                          <BarChart3 size={13} /> View Grades
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* STUDENT RESULTS VIEW */
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-[#64748B] uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-[#64748B] uppercase tracking-wider">Marks Obtained</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-[#64748B] uppercase tracking-wider">Percentage</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-[#64748B] uppercase tracking-wider">Answers Correctness</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-[#64748B] uppercase tracking-wider">Evaluation Status</th>
                    <th className="px-6 py-3.5 text-right text-xs font-bold text-[#64748B] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {paginatedData.map((res, idx) => {
                    const isCompleted = res.status === 'COMPLETED';
                    const isPending = res.status === 'PENDING_REVIEW';
                    const isPartial = res.status === 'PARTIALLY_EVALUATED';
                    
                    return (
                      <motion.tr
                        key={res.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="hover:bg-[#F8FAFC] transition-colors"
                      >
                        {/* Student Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-[#64748B]" />
                            <span className="font-semibold text-[#0F172A]">{res.studentName}</span>
                          </div>
                        </td>

                        {/* Marks Obtained */}
                        <td className="px-6 py-4 font-bold text-[#0F172A] font-mono">
                          {res.obtainedMarks} / {res.totalMarks}
                        </td>

                        {/* Percentage */}
                        <td className="px-6 py-4 font-mono font-bold">
                          <span className={res.percentage >= 60 ? 'text-[#16A34A]' : (res.percentage >= 40 ? 'text-[#F59E0B]' : 'text-[#DC2626]')}>
                            {res.percentage.toFixed(1)}%
                          </span>
                        </td>

                        {/* Answers breakdown */}
                        <td className="px-6 py-4 text-xs font-medium text-[#64748B]">
                          <span className="text-[#16A34A]">{res.correctAnswers} Correct</span> • <span className="text-[#DC2626]">{res.wrongAnswers} Wrong</span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20">
                              <CheckCircle size={11} /> Completed
                            </span>
                          ) : isPartial ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
                              <AlertCircle size={11} /> Partially Evaluated
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              <AlertCircle size={11} /> Pending Review
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/evaluations/attempt/${res.attemptId}`)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#2563EB]/10 hover:bg-[#2563EB]/20 text-[#2563EB] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                            >
                              Review Submissions
                            </button>
                            {isCompleted && (
                              <button
                                onClick={() => navigate(`/results/${res.attemptId}/review`)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#16A34A]/10 hover:bg-[#16A34A]/20 text-[#16A34A] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                              >
                                View Review
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredData.length}
          itemsPerPage={ITEMS_PER_PAGE}
          itemLabel={selectedTest ? "student results" : "tests"}
        />
      </div>
    </motion.div>
  );
};

export default FinalResultsPage;
