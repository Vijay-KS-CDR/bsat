import React from 'react';

const StatusBadge = ({ status }) => {
  const normalized = String(status).toUpperCase();
  
  let bgClass = 'bg-[#64748B]/10 text-[#64748B] border border-[#64748B]/20';
  let dotClass = 'bg-[#64748B]';
  
  if (normalized === 'ACTIVE' || normalized === 'PUBLISHED') {
    bgClass = 'bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20';
    dotClass = 'bg-[#16A34A]';
  } else if (normalized === 'DRAFT' || normalized === 'ASSIGNED') {
    bgClass = 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20';
    dotClass = 'bg-[#2563EB]';
  } else if (normalized === 'COMPLETED') {
    bgClass = 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20';
    dotClass = 'bg-[#F59E0B]';
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${bgClass}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotClass}`}
      />
      {status}
    </span>
  );
};

export default StatusBadge;
