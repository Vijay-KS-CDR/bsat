import React from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRight, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StudentSidebar from './StudentSidebar';

const getPageTitle = (pathname) => {
  if (pathname.startsWith('/student/tests/')) return 'Test Details';
  if (pathname.startsWith('/student/tests')) return 'My Tests';
  if (pathname.startsWith('/student/results/')) return 'Result Details';
  if (pathname.startsWith('/student/results')) return 'Results';
  return 'Dashboard';
};

const StudentPortalLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden font-sans">
      <StudentSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <span className="font-medium hover:text-[#0F172A] cursor-pointer transition-colors">BSAT</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="font-medium hover:text-[#0F172A] cursor-pointer transition-colors">Student Portal</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="font-semibold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-0.5 rounded-full text-xs">
              {pageTitle}
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Notification Icon */}
            <button className="relative p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-xl transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#DC2626] ring-2 ring-white" />
            </button>

            <div className="h-6 w-px bg-[#E2E8F0]" />

            {/* Profile */}
            <div className="flex items-center gap-3 pl-1 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB] font-bold overflow-hidden shadow-2xs group-hover:border-[#2563EB] transition-colors">
                <User size={18} />
              </div>
              <div className="hidden sm:block text-left">
                <h4 className="text-sm font-bold text-[#0F172A] leading-tight group-hover:text-[#2563EB] transition-colors">
                  {user?.name || 'Student'}
                </h4>
                <p className="text-xs text-[#64748B]">Student</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentPortalLayout;
