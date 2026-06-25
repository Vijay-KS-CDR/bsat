import React from 'react';

const PageHeader = ({ title, subtitle, actionButton }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-[#64748B] mt-1">{subtitle}</p>}
      </div>
      {actionButton && (
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
