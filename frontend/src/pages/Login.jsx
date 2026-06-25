import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, MonitorPlay, BarChart3, TrendingUp, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import InputField from '../components/InputField';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import schoolBg from '../assets/login 3.jpeg';
import logo from '../assets/logo.png';

const Login = () => {
  const [formData, setFormData] = useState({ loginId: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const newErrors = {};
    if (!formData.loginId) {
      newErrors.loginId = 'Login ID is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      console.log("Outgoing login payload:", formData);
      const response = await loginUser(formData);
      console.log("Login successful response:", response);
      if (response.success) {
        // The backend does not generate a real token since security permits all requests.
        // We supply a mock token to satisfy frontend authentication route checks.
        login(response.token || 'mock-jwt-token', response);
        toast.success('Welcome back!');
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login failed full error details:", {
        statusCode: error.response?.status,
        responseBody: error.response?.data,
        errorMessage: error.message
      });
      const message = typeof error.response?.data === 'string'
        ? error.response.data
        : error.response?.data?.message || 'Login failed. Please try again.';
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
              Empowering Schools Through Smart Assessments
            </h1>
            <p className="text-white/90 text-sm mb-5 font-medium" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              A comprehensive platform for assessments, analytics and student growth.
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
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 animate-in fade-in duration-700 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-500">
              Please enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <InputField
              label="Login ID"
              name="loginId"
              type="text"
              icon={Mail}
              value={formData.loginId}
              onChange={handleChange}
              error={errors.loginId}
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <div className="flex items-center justify-between mt-2 mb-8">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/50 cursor-pointer" />
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-lg font-semibold shadow-md transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <LoadingSpinner size="sm" color="white" /> : <LogIn size={20} />}
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600 mb-6 flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck size={18} className="text-emerald-500" />
              Secure access for Students, Teachers, Parents and Administrators.
            </p>
            <p className="text-sm text-slate-600 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-primary hover:underline transition-all">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
