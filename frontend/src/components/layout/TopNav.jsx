import React from 'react';
import { Bell, ChevronRight, User } from 'lucide-react';
import SearchBar from '../dashboard/SearchBar';

const TopNav = ({ activePage = 'Students', searchQuery, onSearchChange }) => {
  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
      {/* Breadcrumb Area */}
      <div className="flex items-center gap-2 text-sm text-[#64748B]">
        <span className="font-medium hover:text-[#0F172A] cursor-pointer transition-colors">BSAT</span>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-medium hover:text-[#0F172A] cursor-pointer transition-colors">Module 2</span>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-semibold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-0.5 rounded-full text-xs">
          {activePage}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Global Quick Search */}
        <div className="hidden md:block w-72">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Quick search student..."
          />
        </div>

        {/* Notification Icon */}
        <button className="relative p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-xl transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#DC2626] ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-[#E2E8F0]" />

        {/* Profile Menu */}
        <div className="flex items-center gap-3 pl-1 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB] font-bold overflow-hidden shadow-2xs group-hover:border-[#2563EB] transition-colors">
            <User size={18} />
          </div>
          <div className="hidden sm:block text-left">
            <h4 className="text-sm font-bold text-[#0F172A] leading-tight group-hover:text-[#2563EB] transition-colors">
              Administrator
            </h4>
            <p className="text-xs text-[#64748B]">Current User</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
