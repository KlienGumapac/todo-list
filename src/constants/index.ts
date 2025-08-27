export const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  TODOS: {
    BASE: '/todos',
    BY_ID: (id: string) => `/todos/${id}`,
  },
} as const;

export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
} as const;

export const TODO_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

export const SORT_OPTIONS = {
  CREATED_AT: 'createdAt',
  DUE_DATE: 'dueDate',
  PRIORITY: 'priority',
  TITLE: 'title',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
} as const;

export const VALIDATION_RULES = {
  EMAIL: {
    required: 'Email is required',
    pattern: 'Please enter a valid email address',
  },
  PASSWORD: {
    required: 'Password is required',
    minLength: 'Password must be at least 6 characters',
  },
  NAME: {
    required: 'Name is required',
    minLength: 'Name must be at least 2 characters',
  },
  TODO_TITLE: {
    required: 'Todo title is required',
    maxLength: 'Title must be less than 100 characters',
  },
} as const;

export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
} as const; 