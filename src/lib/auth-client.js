import { createAuthClient } from 'better-auth/client';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

// Social sign-in helper
export const signInWithGoogle = async () => {
  try {
    const data = await authClient.signIn.social({
      provider: 'google',
    });
    return data;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

// Email sign-in helper
export const signInWithEmail = async (email, password) => {
  try {
    const data = await authClient.signIn.email({
      email,
      password,
    });
    return data;
  } catch (error) {
    console.error('Email sign-in error:', error);
    throw error;
  }
};

// Email sign-up helper
export const signUpWithEmail = async (email, password, name) => {
  try {
    const data = await authClient.signUp.email({
      email,
      password,
      name,
    });
    return data;
  } catch (error) {
    console.error('Email sign-up error:', error);
    throw error;
  }
};

// Sign out helper
export const signOut = async () => {
  try {
    await authClient.signOut();
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Get session
export const getSession = async () => {
  try {
    const response = await authClient.getSession();
    return response;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
};

