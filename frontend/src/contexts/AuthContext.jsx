import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('phantom_user');
    return saved ? JSON.parse(saved) : { username: 'admin', role: 'Security Analyst', token: 'phantom-token' };
  });

  const login = (username, password) => {
    // Demo authentication
    if (username === 'admin' && password === 'phantom2026') {
      const authUser = { username: 'admin', role: 'Security Lead', token: 'token-admin-2026' };
      setUser(authUser);
      localStorage.setItem('phantom_user', JSON.stringify(authUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('phantom_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
