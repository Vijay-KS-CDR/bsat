import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle2, School, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/dashboard/StatsCard';
import PageHeader from '../../components/dashboard/PageHeader';
import LoadingSkeleton from '../../components/dashboard/LoadingSkeleton';
import { getStudentDashboard } from '../../api/studentPortalApi';

const StudentDashboardPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getStudentDashboard()
      .then(setData)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingSkeleton />;

  const { student, stats } = data;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-7xl mx-auto pb-12"
    >
      {/* Page Header */}
      <PageHeader
        title={`Welcome back, ${student.name}!`}
        subtitle="Here's a quick overview of your academic progress and upcoming assessments."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={ClipboardList}
          title="Assigned Tests"
          value={stats.assignedTests}
          description="Pending tests to complete"
          colorClass="text-[#2563EB]"
          bgClass="bg-[#2563EB]/10"
        />
        <StatsCard
          icon={CheckCircle2}
          title="Completed Tests"
          value={stats.completedTests}
          description="Tests you have finished"
          colorClass="text-[#16A34A]"
          bgClass="bg-[#16A34A]/10"
        />
        <StatsCard
          icon={School}
          title="Class"
          value={stats.class}
          description="Your current class"
          colorClass="text-[#F59E0B]"
          bgClass="bg-[#F59E0B]/10"
        />
        <StatsCard
          icon={LayoutGrid}
          title="Section"
          value={stats.section}
          description="Your class section"
          colorClass="text-[#6366f1]"
          bgClass="bg-[#6366f1]/10"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Tests Card */}
        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate('/student/tests')}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#2563EB]/10 rounded-xl">
              <ClipboardList size={22} className="text-[#2563EB]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">My Tests</h3>
              <p className="text-xs text-[#64748B] mt-0.5">View and start your assigned tests</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#64748B]">
              <span className="font-semibold text-[#2563EB]">{stats.assignedTests}</span> test{stats.assignedTests !== 1 ? 's' : ''} pending
            </span>
            <span className="text-xs font-semibold text-[#2563EB] bg-[#2563EB]/10 px-3 py-1 rounded-full">
              Go to Tests →
            </span>
          </div>
        </motion.div>

        {/* Results Card */}
        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate('/student/results')}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#16A34A]/10 rounded-xl">
              <CheckCircle2 size={22} className="text-[#16A34A]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">My Results</h3>
              <p className="text-xs text-[#64748B] mt-0.5">View your test scores and performance</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#64748B]">
              <span className="font-semibold text-[#16A34A]">{stats.completedTests}</span> test{stats.completedTests !== 1 ? 's' : ''} completed
            </span>
            <span className="text-xs font-semibold text-[#16A34A] bg-[#16A34A]/10 px-3 py-1 rounded-full">
              View Results →
            </span>
          </div>
        </motion.div>
      </div>

      {/* Student Info Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm">
        <h2 className="text-base font-bold text-[#0F172A] mb-4">Student Information</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Student ID', value: student.id },
            { label: 'Roll Number', value: student.rollNumber },
            { label: 'Class & Section', value: `${student.class} – ${student.section}` },
            { label: 'Status', value: student.status },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#F8FAFC] rounded-xl p-3">
              <p className="text-xs text-[#64748B] font-medium">{label}</p>
              <p className="text-sm font-bold text-[#0F172A] mt-1">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDashboardPage;
