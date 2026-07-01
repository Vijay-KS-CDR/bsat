import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Award, 
  BarChart3, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ activePage = 'Students', onNavigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Students', icon: Users, allowedRoles: ['ADMIN'] },
    { name: 'Teachers', icon: GraduationCap, allowedRoles: ['ADMIN'] },
    { name: 'Subjects', icon: BookOpen, allowedRoles: ['ADMIN', 'TEACHER'] },
    { name: 'Tests', icon: FileText, allowedRoles: ['ADMIN', 'TEACHER'] },
    { name: 'Evaluations', icon: ClipboardList, allowedRoles: ['ADMIN', 'TEACHER'] },
    { name: 'Results', icon: Award, allowedRoles: ['ADMIN', 'TEACHER'] },
    { name: 'Analytics', icon: BarChart3, allowedRoles: ['ADMIN'] },
    { name: 'Settings', icon: Settings, allowedRoles: ['ADMIN'] },
  ];

  const visibleMenuItems = menuItems.filter((item) => {
    if (!item.allowedRoles) return true;
    return user && item.allowedRoles.includes(user.role);
  });

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
            <span className="font-bold text-lg tracking-tight text-[#0F172A]">BSAT Portal</span>
          </div>
        ) : (
          <img src={logo} alt="BSAT Logo" className="w-11 h-11 object-contain mx-auto" />
        )}
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center text-[#64748B] hover:text-[#0F172A] shadow-xs hover:shadow-sm transition-all z-40"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {visibleMenuItems.map((item) => {
          const isActive = activePage === item.name;
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() => onNavigate && onNavigate(item.name)}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-0' : 'justify-start px-3.5'
              } py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-[#64748B] group-hover:text-[#2563EB] transition-colors'} />
              {!isCollapsed && <span className="ml-3 tracking-tight">{item.name}</span>}
              {isActive && !isCollapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Pro Badge / Upgrade Prompt */}
      {!isCollapsed && (
        <div className="mx-3 mb-4 p-4 rounded-2xl bg-gradient-to-br from-[#2563EB]/5 to-[#2563EB]/10 border border-[#2563EB]/15">
          <div className="flex items-center gap-2 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} /> Premium Tier
          </div>
          <p className="text-xs text-[#64748B] mt-1 leading-normal">
            Linear-inspired UI active.
          </p>
        </div>
      )}

      {/* Logout Footer */}
      <div className="p-3 border-t border-[#E2E8F0]">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center px-0' : 'justify-start px-3.5'
          } py-2.5 rounded-xl text-sm font-semibold text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="ml-3 tracking-tight">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
