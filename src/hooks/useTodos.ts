import { useState, useEffect, useCallback } from 'react';
import type { Todo, CreateTodoData, UpdateTodoData, TodoFilter, TodoSort } from '../types';
import { todoAPI } from '../utils/api';
import { filterTodos, sortTodos } from '../utils';

interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  filter: TodoFilter;
  sortBy: TodoSort;
  sortOrder: 'asc' | 'desc';
  filteredTodos: Todo[];
  createTodo: (todoData: CreateTodoData) => Promise<void>;
  updateTodo: (id: string, todoData: UpdateTodoData) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  setFilter: (filter: TodoFilter) => void;
  setSortBy: (sortBy: TodoSort) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  clearError: () => void;
}

export const useTodos = (): UseTodosReturn => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [sortBy, setSortBy] = useState<TodoSort>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTodos = await todoAPI.getAll();
      setTodos(fetchedTodos);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTodo = useCallback(async (todoData: CreateTodoData) => {
    try {
      setLoading(true);
      setError(null);
      const newTodo = await todoAPI.create(todoData);
      setTodos(prev => [newTodo, ...prev]);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create todo');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTodo = useCallback(async (id: string, todoData: UpdateTodoData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTodo = await todoAPI.update(id, todoData);
      setTodos(prev => prev.map(todo => todo._id === id ? updatedTodo : todo));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update todo');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTodo = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await todoAPI.delete(id);
      setTodos(prev => prev.filter(todo => todo._id !== id));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete todo');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleTodo = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const todo = todos.find(t => t._id === id);
      if (!todo) return;
      
      const updatedTodo = await todoAPI.toggleComplete(id, !todo.completed);
      setTodos(prev => prev.map(t => t._id === id ? updatedTodo : t));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to toggle todo');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [todos]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const filteredTodos = useCallback(() => {
    const filtered = filterTodos(todos, filter);
    return sortTodos(filtered, sortBy, sortOrder);
  }, [todos, filter, sortBy, sortOrder]);

  return {
    todos,
    loading,
    error,
    filter,
    sortBy,
    sortOrder,
    filteredTodos: filteredTodos(),
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    setFilter,
    setSortBy,
    setSortOrder,
    clearError,
  };
}; 