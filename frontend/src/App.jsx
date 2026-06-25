import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
          {/* <Navbar /> */}
          <main>
            <AppRoutes />
          </main>
          <ToastContainer position="top-right" autoClose={3000} theme="colored" hideProgressBar={false} />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
