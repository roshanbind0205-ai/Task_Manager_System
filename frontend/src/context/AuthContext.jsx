import React, {
  createContext,
  useState,
  useEffect,
} from 'react';

import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
} from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const currentUser = getCurrentUser();

    if (currentUser) {
      setUser(currentUser);
    }

    setLoading(false);
  }, []);

  const register = async (userData) => {
    const response = await registerUser(userData);
    return response;
  };

  const login = async (userData) => {
    const response = await loginUser(userData);

    if (response.success) {
      setUser(response.user);
    }

    return response;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
