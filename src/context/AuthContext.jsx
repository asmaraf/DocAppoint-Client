'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-restore login on refresh
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('docappoint_token');
      const storedUser = localStorage.getItem('docappoint_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        try {
          const res = await fetch(`${API_BASE}/api/auth/me`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('docappoint_user', JSON.stringify(data.user));
          }
        } catch (err) {
          console.warn('Auth restore warning using stored session:', err);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('docappoint_token', data.token);
      localStorage.setItem('docappoint_user', JSON.stringify(data.user));

      return data;
    } catch (err) {
      throw err;
    }
  };

  const register = async (name, email, password, photoUrl) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, photoUrl })
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (err) {
      throw err;
    }
  };

  const socialLogin = async (name, email, photoUrl, provider = 'Google') => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/social-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, photoUrl, provider })
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Social login failed');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('docappoint_token', data.token);
      localStorage.setItem('docappoint_user', JSON.stringify(data.user));

      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateProfile = async (name, photoUrl) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, photoUrl })
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Update profile failed');
      }

      setUser(data.user);
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('docappoint_token', data.token);
      }
      localStorage.setItem('docappoint_user', JSON.stringify(data.user));

      return data;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('docappoint_token');
    localStorage.removeItem('docappoint_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        socialLogin,
        updateProfile,
        logout,
        API_BASE
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
