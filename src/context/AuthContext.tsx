'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, photoURL: string, password: string) => Promise<boolean>;
  socialLogin: (provider: 'Google' | 'GitHub') => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (name: string, photoURL: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  // BetterAuth session
  const { data: session, isPending: sessionPending } = authClient.useSession();

  // Restore auth session on initial mount / reload
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('kindred_token');
      const storedUser = localStorage.getItem('kindred_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to restore session from storage:', err);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  // Bridge BetterAuth session to AuthContext & automatically fetch/sync JWT Token
  useEffect(() => {
    const sessionUser = (session as any)?.user;
    if (sessionUser) {
      const u: User = {
        id: sessionUser.id,
        name: sessionUser.name,
        email: sessionUser.email,
        photoURL:
          sessionUser.image ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      };
      setUser(u);
      localStorage.setItem('kindred_user', JSON.stringify(u));

      // If JWT token is missing in localStorage, auto-fetch from backend
      const existingToken = localStorage.getItem('kindred_token');
      if (!existingToken) {
        fetch(`${API_BASE}/auth/social-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: u.email,
            name: u.name,
            photoURL: u.photoURL,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.token) {
              setToken(data.token);
              localStorage.setItem('kindred_token', data.token);
            }
          })
          .catch((err) => console.error('Auto JWT token sync error:', err));
      } else {
        setToken(existingToken);
      }
    }
  }, [session]);

  const isLoading = initialLoading || sessionPending;

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await authClient.signIn.email({
        email: email.trim(),
        password: password,
      });

      if (res.error) {
        toast.error(res.error.message || 'Login failed.');
        return false;
      }

      // Immediately set user in context from the login response
      const resUser = (res as any).data?.user;
      if (resUser) {
        const u: User = {
          id: resUser.id,
          name: resUser.name,
          email: resUser.email,
          photoURL: resUser.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        };
        setUser(u);
        localStorage.setItem('kindred_user', JSON.stringify(u));
      }

      // Fetch JWT token for backend APIs
      try {
        const jwtRes = await fetch(`${API_BASE}/auth/social-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            name: resUser?.name || 'Volunteer',
            photoURL: resUser?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          }),
        });
        if (jwtRes.ok) {
          const jwtData = await jwtRes.json();
          setToken(jwtData.token);
          localStorage.setItem('kindred_token', jwtData.token);
        }
      } catch (err) {}

      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error('Unable to connect to server. Please try again.');
      return false;
    }
  };

  const register = async (name: string, email: string, photoURL: string, password: string): Promise<boolean> => {
    try {
      const res = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password: password,
        image: photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      });

      if (res.error) {
        toast.error(res.error.message || 'Registration failed.');
        return false;
      }

      // Fetch JWT token for backend APIs
      try {
        const jwtRes = await fetch(`${API_BASE}/auth/social-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            name: name.trim(),
            photoURL: photoURL,
          }),
        });
        if (jwtRes.ok) {
          const jwtData = await jwtRes.json();
          setToken(jwtData.token);
          localStorage.setItem('kindred_token', jwtData.token);
        }
      } catch (err) {}

      toast.success('Registration successful! Welcome to KindredActs.');
      return true;
    } catch (error) {
      toast.error('Unable to connect to server. Please try again.');
      return false;
    }
  };

  const socialLogin = async (provider: 'Google' | 'GitHub'): Promise<boolean> => {
    try {
      await authClient.signIn.social({
        provider: provider.toLowerCase() as 'google' | 'github',
        callbackURL: '/',
      });
      return true;
    } catch (error) {
      toast.error(`Unable to connect for ${provider} login.`);
      return false;
    }
  };

  const logout = async () => {
    try {
      await (authClient as any).signOut();
    } catch (err) {}
    setUser(null);
    setToken(null);
    localStorage.removeItem('kindred_token');
    localStorage.removeItem('kindred_user');
    toast.success('Logged out successfully.');
  };

  const updateUserProfile = async (name: string, photoURL: string): Promise<boolean> => {
    try {
      let activeToken = token || localStorage.getItem('kindred_token');
      if (!activeToken) return false;

      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ name, photoURL }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Profile update failed.');
        return false;
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('kindred_token', data.token);
      localStorage.setItem('kindred_user', JSON.stringify(data.user));

      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      toast.error('Failed to update profile.');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        socialLogin,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
