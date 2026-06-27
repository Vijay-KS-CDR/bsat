import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserCircle, BadgeInfo, IdCard, GraduationCap } from 'lucide-react';

const Dashboard = ({ fallbackUser }) => {
  const { user: authUser } = useAuth();

  const user = authUser || fallbackUser || {
    id: "G-999",
    name: "Administrator (Preview)",
    role: "ADMIN",
    email: "preview.admin@bsat.edu"
  };

  const roleColors = {
    STUDENT: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    TEACHER: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    PARENT: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-3xl shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Welcome back, {user.name}!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleColors[user.role] || roleColors.STUDENT}`}>
                {user.role}
              </span>
              User ID: #{user.id}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Quick Stats Cards */}
          <div className="glass dark:glass-dark rounded-xl p-6 flex items-start gap-4 hover:shadow-2xl transition-shadow duration-300">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <UserCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Profile Status</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">Active</h3>
            </div>
          </div>
          
          <div className="glass dark:glass-dark rounded-xl p-6 flex items-start gap-4 hover:shadow-2xl transition-shadow duration-300">
            <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
              <IdCard size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Account Email</p>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 truncate max-w-[150px] sm:max-w-xs">{user.email || 'Email not available'}</h3>
            </div>
          </div>

          <div className="glass dark:glass-dark rounded-xl p-6 flex items-start gap-4 hover:shadow-2xl transition-shadow duration-300">
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
              <GraduationCap size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Role</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 capitalize">{user.role.toLowerCase()}</h3>
            </div>
          </div>
        </div>

        <div className="glass dark:glass-dark rounded-2xl p-8 border-t-4 border-primary">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BadgeInfo className="text-primary" />
            Dashboard Overview
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            This is your secure dashboard area. Based on your role as a <strong>{user.role}</strong>, you will soon see personalized analytics, assessments, and reports tailored specifically for you. The navigation and options available will adapt to provide the most relevant tools for your educational journey.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-100 dark:border-blue-800/30">
              <p className="text-blue-800 dark:text-blue-300 font-medium">
               🚀 More features coming soon to BSAT!
              </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
