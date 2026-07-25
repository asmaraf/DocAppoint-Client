'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';

const BetterAuthContext = createContext();

export const BetterAuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data } = await authClient.getSession();
        
        if (data?.session?.user) {
          setSession(data.session);
          setUser(data.session.user);
        }
      } catch (err) {
        console.error('[BetterAuth]: Session initialization error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (email, password, name) => {
    try {
      setError(null);
      const response = await authClient.signUp.email({
        email,
        password,
        name
      });

      if (response.data?.user) {
        setUser(response.data.user);
        setSession(response.data.session);
        return response.data;
      }
      throw new Error(response.error?.message || 'Sign up failed');
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null);
      const response = await authClient.signIn.email({
        email,
        password
      });

      if (response.data?.user) {
        setUser(response.data.user);
        setSession(response.data.session);
        return response.data;
      }
      throw new Error(response.error?.message || 'Sign in failed');
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await authClient.signOut();
      setUser(null);
      setSession(null);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const updateProfile = async (updates) => {
    try {
      setError(null);
      const response = await authClient.updateUser(updates);
      
      if (response.data?.user) {
        setUser(response.data.user);
        return response.data.user;
      }
      throw new Error(response.error?.message || 'Profile update failed');
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const value = {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <BetterAuthContext.Provider value={value}>
      {children}
    </BetterAuthContext.Provider>
  );
};

// Hook to use BetterAuth context
export const useBetterAuthContext = () => {
  const context = useContext(BetterAuthContext);
  
  if (!context) {
    throw new Error('useBetterAuthContext must be used within BetterAuthProvider');
  }
  
  return context;
};
