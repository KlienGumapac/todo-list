import React from 'react';
import type { Todo, UpdateTodoData } from '../../types';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => Promise<void>;
  onUpdate: (id: string, data: UpdateTodoData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onUpdate,
  onDelete,
}) => {
  if (todos.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No todos yet</h3>
        <p className="text-gray-500">Get started by creating your first todo!</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TodoList; 