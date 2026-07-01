import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Award,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';

const MENU_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
  { name: 'My Tests', icon: ClipboardList, path: '/student/tests' },
  { name: 'Results', icon: Award, path: '/student/results' },
];

const StudentSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const getActiveName = () => {
    const path = location.pathname;
    if (path.startsWith('/student/tests')) return 'My Tests';
    if (path.startsWith('/student/results')) return 'Results';
    return 'Dashboard';
  };

  const activeName = getActiveName();

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-[#E2E8F0] transition-all duration-300 z-30 shrink-0 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-[#E2E8F0]">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="BSAT Logo" className="w-11 h-11 object-contain" />
            <span className="font-bold text-lg tracking-tight text-[#0F172A]">Student Portal</span>
          </div>
        ) : (
          <img src={logo} alt="BSAT Logo" className="w-11 h-11 object-contain mx-auto" />
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center text-[#64748B] hover:text-[#0F172A] shadow-xs hover:shadow-sm transition-all z-40"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = activeName === item.name;
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-0' : 'justify-start px-3.5'
              } py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon
                size={18}
                className={isActive ? 'text-white' : 'text-[#64748B] group-hover:text-[#2563EB] transition-colors'}
              />
              {!isCollapsed && <span className="ml-3 tracking-tight">{item.name}</span>}
              {isActive && !isCollapsed && (
                <motion.div
                  layoutId="studentActiveIndicator"
                  className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Student Info Badge */}
      {!isCollapsed && user && (
        <div className="mx-3 mb-4 p-4 rounded-2xl bg-gradient-to-br from-[#2563EB]/5 to-[#2563EB]/10 border border-[#2563EB]/15">
          <div className="flex items-center gap-2 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
            <GraduationCap size={14} /> Student Account
          </div>
          <p className="text-xs text-[#64748B] mt-1 leading-normal font-medium truncate">
            {user.name}
          </p>
        </div>
      )}

      {/* Logout */}
      <div className="p-3 border-t border-[#E2E8F0]">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center px-0' : 'justify-start px-3.5'
          } py-2.5 rounded-xl text-sm font-semibold text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="ml-3 tracking-tight">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;
