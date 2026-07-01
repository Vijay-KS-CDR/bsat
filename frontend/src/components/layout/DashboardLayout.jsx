import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { Sparkles, Construction } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturePlaceholder = ({ pageName }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto text-center px-4"
    >
      <div className="p-4 bg-[#2563EB]/10 text-[#2563EB] rounded-3xl mb-6 hover:scale-105 transition-transform duration-300">
        <Construction size={48} className="animate-pulse" />
      </div>
      <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">{pageName} Module</h2>
      <p className="text-[#64748B] mt-3 leading-relaxed">
        The {pageName} module is currently under development. Our team is building advanced analytical tools, workflows, and database integrations for this module.
      </p>
      
      <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-[#2563EB]/5 to-[#1D4ED8]/5 border border-[#2563EB]/15 flex items-center gap-3">
        <Sparkles size={18} className="text-[#2563EB] shrink-0" />
        <span className="text-xs text-[#2563EB] font-semibold uppercase tracking-wider">Coming Soon in next update</span>
      </div>
    </motion.div>
  );
};

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activePage, setActivePage] = useState(() => {
    const path = window.location.pathname;
    if (path.startsWith('/teachers')) return 'Teachers';
    if (path.startsWith('/subjects')) return 'Subjects';
    if (path.startsWith('/question-bank')) return 'Question Bank';
    if (path.startsWith('/tests')) return 'Tests';
    if (path.startsWith('/evaluations')) return 'Evaluations';
    if (path.startsWith('/results')) return 'Results';
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/analytics')) return 'Analytics';
    if (path.startsWith('/settings')) return 'Settings';
    if (path.startsWith('/students') || path === '/') return 'Students';
    return 'Students';
  });
  
  const [globalSearch, setGlobalSearch] = useState('');

  // Sync back/forward and path updates to the activePage state
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/teachers')) {
      setActivePage('Teachers');
    } else if (path.startsWith('/subjects')) {
      setActivePage('Subjects');
    } else if (path.startsWith('/question-bank')) {
      setActivePage('Question Bank');
    } else if (path.startsWith('/tests')) {
      setActivePage('Tests');
    } else if (path.startsWith('/evaluations')) {
      setActivePage('Evaluations');
    } else if (path.startsWith('/results')) {
      setActivePage('Results');
    } else if (path.startsWith('/dashboard')) {
      setActivePage('Dashboard');
    } else if (path.startsWith('/analytics')) {
      setActivePage('Analytics');
    } else if (path.startsWith('/settings')) {
      setActivePage('Settings');
    } else if (path.startsWith('/students') || path === '/') {
      setActivePage('Students');
    }
  }, [location]);

  const handleNavigate = (page) => {
    setActivePage(page);
    if (page === 'Students') navigate('/students');
    else if (page === 'Teachers') navigate('/teachers');
    else if (page === 'Subjects') navigate('/subjects');
    else if (page === 'Question Bank') navigate('/question-bank');
    else if (page === 'Tests') navigate('/tests');
    else if (page === 'Evaluations') navigate('/evaluations');
    else if (page === 'Results') navigate('/results');
    else if (page === 'Dashboard') navigate('/dashboard');
    else if (page === 'Analytics') navigate('/analytics');
    else if (page === 'Settings') navigate('/settings');
  };

  const renderContent = () => {
    switch (activePage) {
      case 'Students':
      case 'Teachers':
      case 'Subjects':
      case 'Question Bank':
      case 'Tests':
      case 'Evaluations':
      case 'Results':
      case 'Dashboard':
        return React.isValidElement(children) 
          ? React.cloneElement(children, { activePage, globalSearch, onNavigate: handleNavigate })
          : children;
      default:
        return <FeaturePlaceholder pageName={activePage} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden font-sans">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav 
          activePage={activePage} 
          searchQuery={globalSearch} 
          onSearchChange={setGlobalSearch} 
        />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
