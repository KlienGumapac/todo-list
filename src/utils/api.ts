import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/constants';
import type { 
  User, 
  UserCredentials, 
  RegisterData, 
  Todo, 
  CreateTodoData, 
  UpdateTodoData,
  ApiResponse,
  AuthResponse 
} from '@/types';


const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getFromStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

api.interceptors.request.use(
  (config) => {
    const token = getFromStorage<string>(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      
      removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
      removeFromStorage(STORAGE_KEYS.USER_DATA);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: UserCredentials): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data!;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return response.data.data!;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  },
};

export const todoAPI = {
  getAll: async (): Promise<Todo[]> => {
    const response = await api.get<ApiResponse<Todo[]>>('/todos');
    return response.data.data!;
  },

  getById: async (id: string): Promise<Todo> => {
    const response = await api.get<ApiResponse<Todo>>(`/todos/${id}`);
    return response.data.data!;
  },

  create: async (todoData: CreateTodoData): Promise<Todo> => {
    const response = await api.post<ApiResponse<Todo>>('/todos', todoData);
    return response.data.data!;
  },

  update: async (id: string, todoData: UpdateTodoData): Promise<Todo> => {
    const response = await api.put<ApiResponse<Todo>>(`/todos/${id}`, todoData);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },

  toggleComplete: async (id: string, completed: boolean): Promise<Todo> => {
    const response = await api.patch<ApiResponse<Todo>>(`/todos/${id}`, { completed });
    return response.data.data!;
  },
};

export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export default api; 