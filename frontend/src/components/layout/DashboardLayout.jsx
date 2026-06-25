import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const DashboardLayout = ({ children }) => {
  const [activePage, setActivePage] = useState('Students');
  const [globalSearch, setGlobalSearch] = useState('');

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden font-sans">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav 
          activePage={activePage} 
          searchQuery={globalSearch} 
          onSearchChange={setGlobalSearch} 
        />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* We pass activePage and globalSearch down to child or render pages */}
          {React.isValidElement(children) 
            ? React.cloneElement(children, { activePage, globalSearch, onNavigate: setActivePage })
            : children
          }
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
