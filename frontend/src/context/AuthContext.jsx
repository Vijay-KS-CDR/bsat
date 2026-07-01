import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('loginId');
    localStorage.removeItem('name');
    setUser(null);
    window.location.href = '/login';
  }, []);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const userId = localStorage.getItem('userId');
      const loginId = localStorage.getItem('loginId');
      const name = localStorage.getItem('name');

      if (token && role && userId && loginId) {
        setUser({
          id: userId,
          loginId: loginId,
          role: role,
          name: name || loginId,
        });
      } else {
        // If credentials are not present or partial, reset without redirecting
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('loginId');
        localStorage.removeItem('name');
        setUser(null);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [logout]);

  const login = useCallback((token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('userId', String(userData.id));
    localStorage.setItem('loginId', userData.loginId);
    
    const displayName = userData.name || userData.loginId || userData.role;
    localStorage.setItem('name', displayName);
    
    setUser({
      id: String(userData.id),
      loginId: userData.loginId,
      role: userData.role,
      name: displayName,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
