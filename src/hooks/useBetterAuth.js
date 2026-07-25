'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';

export const useBetterAuth = () => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        setIsPending(true);
        const response = await authClient.getSession();
        setData(response);
      } catch (err) {
        setError(err);
      } finally {
        setIsPending(false);
      }
    };

    getSession();
  }, []);

  const signUp = async (email, password, name) => {
    try {
      setIsPending(true);
      const response = await authClient.signUp.email(
        {
          email,
          password,
          name
        },
        {
          onSuccess: () => {
            // Session will be automatically set
          }
        }
      );
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setIsPending(true);
      const response = await authClient.signIn.email(
        {
          email,
          password
        },
        {
          onSuccess: () => {
            // Session will be automatically set
          }
        }
      );
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const signOut = async () => {
    try {
      setIsPending(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setData(null);
          }
        }
      });
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return {
    data,
    isPending,
    error,
    signUp,
    signIn,
    signOut
  };
};
