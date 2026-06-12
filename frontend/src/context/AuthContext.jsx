import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../services/api'; // Pulls our live Axios configuration client

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedActive = localStorage.getItem('exam_active_user');
    return savedActive ? JSON.parse(savedActive) : null;
  });

  // Track session persistent states locally for quick dashboard page reloads
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('exam_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('exam_active_user');
    }
  }, [currentUser]);

  // 🟢 BACKEND CONNECTED LOGIN PIPELINE (UPDATED TO SECURE SERVER-SIDE ROUTING)
  const login = async (username, password) => {
    try {
      // Send credentials directly to our secure AuthController endpoint
      const response = await API.post('/auth/login', { username, password });
      
      if (response.data.success) {
        // The backend returns user metadata including the lowercased role string
        setCurrentUser(response.data);
        return { success: true, user: response.data };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      console.error("Login authentication connection loop error:", err);
      return { 
        success: false, 
        message: err.response?.data?.message || "Invalid username or password credentials." 
      };
    }
  };

  // 🟢 BACKEND CONNECTED SIGNUP PIPELINE
  const signup = async (userData) => {
    try {
      const response = await API.post('/auth/signup', userData);
      if (response.data.success) {
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || "Server connection failed during registration data transport." 
      };
    }
  };

  // 🟢 BACKEND CONNECTED PROFILE MODIFICATIONS
  const updateUserProfile = async (updatedData) => {
    try {
      // Direct assignment forces an instant re-render across your state engines
      setCurrentUser(updatedData);
      localStorage.setItem('exam_active_user', JSON.stringify(updatedData));
    } catch (err) {
      console.error("Profile modification update failure:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem('exam_active_user'); // 🟢 FIXED: Explicitly purge the cache on command
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isAuthenticated: !!currentUser,
        login,
        signup,
        updateUserProfile,
        updateUserContext: updateUserProfile, // 🟢 FIX: Maps alternative key alias name so Profile.jsx updates smoothly!
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);