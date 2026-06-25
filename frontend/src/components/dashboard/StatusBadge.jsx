import React from 'react';

const StatusBadge = ({ status }) => {
  const isActive = status === 'Active';
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
        isActive
          ? 'bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20'
          : 'bg-[#64748B]/10 text-[#64748B] border border-[#64748B]/20'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          isActive ? 'bg-[#16A34A]' : 'bg-[#64748B]'
        }`}
      />
      {status}
    </span>
  );
};

export default StatusBadge;
