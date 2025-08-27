import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTodos } from '@/hooks/useTodos';
import TodoList from '@/components/todo/TodoList';
import TodoForm from '@/components/todo/TodoForm';
import TodoFilters from '@/components/todo/TodoFilters';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { 
    todos, 
    loading, 
    error, 
    filteredTodos,
    createTodo, 
    updateTodo, 
    deleteTodo, 
    toggleTodo,
    filter,
    sortBy,
    sortOrder,
    setFilter,
    setSortBy,
    setSortOrder,
    clearError 
  } = useTodos();

  const [showAddForm, setShowAddForm] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCreateTodo = async (todoData: any) => {
    try {
      await createTodo(todoData);
      setShowAddForm(false);
    } catch (error) {
      
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            You have {todos.filter(todo => !todo.completed).length} active tasks
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-red-600">{error}</p>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TodoFilters
            filter={filter}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onFilterChange={setFilter}
            onSortChange={setSortBy}
            onSortOrderChange={setSortOrder}
          />
          
          <Button
            onClick={() => setShowAddForm(true)}
            className="sm:w-auto"
          >
            Add New Todo
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <p className="mt-2 text-gray-500">Loading todos...</p>
            </div>
          ) : (
            <TodoList
              todos={filteredTodos}
              onToggle={toggleTodo}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
            />
          )}
        </div>

        {showAddForm && (
          <TodoForm
            isOpen={showAddForm}
            onClose={() => setShowAddForm(false)}
            onSubmit={handleCreateTodo}
            title="Add New Todo"
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard; 