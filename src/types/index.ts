// User related types
export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends UserCredentials {
  name: string;
}

// Todo related types
export interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoData {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Filter types
export type TodoFilter = 'all' | 'active' | 'completed';
export type TodoSort = 'createdAt' | 'dueDate' | 'priority' | 'title';

// UI State types
export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  filter: TodoFilter;
  sortBy: TodoSort;
  sortOrder: 'asc' | 'desc';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Component Props types
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'date';
  error?: string;
  required?: boolean;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
} 