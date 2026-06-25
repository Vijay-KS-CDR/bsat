import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Shield, MonitorPlay, BarChart3, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import InputField from '../components/InputField';
import { registerUser } from '../api/authApi';
import LoadingSpinner from '../components/LoadingSpinner';
import schoolBg from '../assets/login 3.jpeg';
import logo from '../assets/logo.png';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    loginId: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 3 || formData.name.length > 100) {
      newErrors.name = 'Name must be between 3 and 100 characters';
    }
    if (!formData.loginId) {
      newErrors.loginId = 'Login ID is required';
    } else if (formData.loginId.length < 3 || formData.loginId.length > 100) {
      newErrors.loginId = 'Login ID must be between 3 and 100 characters';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8 || formData.password.length > 100) {
      newErrors.password = 'Password must be between 8 and 100 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const { name, loginId, password, role } = formData;
      console.log("Outgoing registration payload:", { name, loginId, password, role });
      const response = await registerUser({ name, loginId, password, role });
      console.log("Registration successful response:", response);
      
      // The backend returns a valid response payload on success, but success boolean might be null.
      // So we check if the response is returned successfully.
      if (response) {
        toast.success(response.message || 'Registration successful! Please login.');
        navigate('/login');
      }
    } catch (error) {
      console.error("Registration failed full error details:", {
        statusCode: error.response?.status,
        responseBody: error.response?.data,
        errorMessage: error.message
      });
      const message = typeof error.response?.data === 'string'
        ? error.response.data
        : error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Left Panel - Information & Image */}
      <div className="lg:w-1/2 relative min-h-screen overflow-hidden hidden lg:flex flex-col">
        {/* Educational Background Image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${schoolBg})` }}></div>
        {/* Subtle overlay for text readability - keeps image visible */}
        <div className="absolute inset-0 bg-black/25"></div>

        {/* Brand - pinned to top-left corner */}
        <div className="absolute top-6 left-6 z-20">
          <Link to="/" className="inline-flex items-center group">
            <img src={logo} alt="BSAT Logo" className="h-16 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform -ml-3 -mr-2 -mt-1" />
            <span className="font-black text-3xl tracking-tight text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
              BSAT
            </span>
          </Link>
        </div>

        {/* Bottom frosted glass content panel */}
        <div className="absolute bottom-8 left-6 right-6 z-10">
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-2xl">
            <h1 className="text-3xl font-bold mb-3 text-white leading-snug" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
              Join the Future of Education
            </h1>
            <p className="text-white/90 text-sm mb-5 font-medium" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              Create an account to access a unified platform for assessments, performance tracking and academic growth.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-center">
                <MonitorPlay className="text-amber-300" size={22} />
                <span className="text-xs font-semibold text-white leading-tight">Online Examinations</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-center">
                <BarChart3 className="text-amber-300" size={22} />
                <span className="text-xs font-semibold text-white leading-tight">Performance Analytics</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-center">
                <TrendingUp className="text-amber-300" size={22} />
                <span className="text-xs font-semibold text-white leading-tight">Progress Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12 animate-in fade-in duration-700 bg-slate-50">
        
        {/* Mobile only header */}
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex items-center justify-center">
            <img src={logo} alt="BSAT Logo" className="h-16 w-auto object-contain drop-shadow-sm -mr-2 -mt-1" />
            <span className="font-black text-3xl tracking-tight text-primary">
              BSAT
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Create Account
              </h2>
              <p className="text-slate-500">
                Sign up to access BSAT Platform
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-1">
              <InputField
                label="Full Name"
                name="name"
                icon={User}
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />
              
              <InputField
                label="Login ID"
                name="loginId"
                type="text"
                icon={Mail}
                value={formData.loginId}
                onChange={handleChange}
                error={errors.loginId}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  icon={Lock}
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                />
                <InputField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  icon={Shield}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                />
              </div>

              <div className="mb-6 pt-2">
                <label className="text-sm font-semibold text-slate-700 block mb-2">
                  Select your role:
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-primary text-slate-900 appearance-none transition-colors duration-200 font-medium cursor-pointer"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-lg font-semibold shadow-md transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
              >
                {isSubmitting ? <LoadingSpinner size="sm" color="white" /> : <UserPlus size={20} />}
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-600 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-primary hover:underline transition-all">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
