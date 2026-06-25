import React from 'react';
import { ChevronDown } from 'lucide-react';

const FilterDropdown = ({ label, options, selectedValue, onChange, icon: Icon }) => {
  return (
    <div className="relative inline-block min-w-[140px]">
      <div className="relative flex items-center">
        {Icon && <Icon className="absolute left-3 text-[#64748B] pointer-events-none" size={16} />}
        <select
          value={selectedValue}
          onChange={(e) => onChange(e.target.value)}
          className={`appearance-none w-full ${Icon ? 'pl-9' : 'pl-4'} pr-9 py-2.5 bg-white border border-[#E2E8F0] rounded-[16px] text-sm font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 cursor-pointer shadow-xs transition-all duration-200`}
        >
          <option value="">All {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 text-[#64748B] pointer-events-none" size={16} />
      </div>
    </div>
  );
};

export default FilterDropdown;
