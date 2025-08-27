import { useState, useEffect, useCallback } from 'react';
import type { User, UserCredentials, RegisterData, AuthResponse } from '../types';
import { authAPI } from '../utils/api';
import { getFromStorage, setToStorage, removeFromStorage } from '../utils';
import { STORAGE_KEYS } from '../constants';

interface UseAuthReturn {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (credentials: UserCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = getFromStorage<string>(STORAGE_KEYS.AUTH_TOKEN);
        const storedUser = getFromStorage<User>(STORAGE_KEYS.USER_DATA);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
          
          // Verify token is still valid
          try {
            const currentUser = await authAPI.getCurrentUser();
            setUser(currentUser);
          } catch (error) {
            // Token is invalid, clear storage
            removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
            removeFromStorage(STORAGE_KEYS.USER_DATA);
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: UserCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: AuthResponse = await authAPI.login(credentials);
      
      setUser(response.user);
      setToken(response.token);
      
      setToStorage(STORAGE_KEYS.AUTH_TOKEN, response.token);
      setToStorage(STORAGE_KEYS.USER_DATA, response.user);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: AuthResponse = await authAPI.register(userData);
      
      setUser(response.user);
      setToken(response.token);
      
      setToStorage(STORAGE_KEYS.AUTH_TOKEN, response.token);
      setToStorage(STORAGE_KEYS.USER_DATA, response.user);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authAPI.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(null);
      setToken(null);
      removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
      removeFromStorage(STORAGE_KEYS.USER_DATA);
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };
}; 