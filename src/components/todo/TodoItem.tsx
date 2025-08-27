import React, { useState } from 'react';
import type { Todo, UpdateTodoData } from '@/types';
import { formatDate, isOverdue, getPriorityLabel, getPriorityColor } from '@/utils';
import { PRIORITY_COLORS } from '@/constants';
import Button from '@/components/ui/Button';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => Promise<void>;
  onUpdate: (id: string, data: UpdateTodoData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority,
    dueDate: todo.dueDate || '',
  });

  const handleToggle = async () => {
    try {
      await onToggle(todo._id);
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await onUpdate(todo._id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
      dueDate: todo.dueDate || '',
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await onDelete(todo._id);
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
        <div className="space-y-3">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Todo title"
          />
          
          <textarea
            value={editData.description}
            onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Description (optional)"
            rows={2}
          />
          
          <div className="flex gap-2">
            <select
              value={editData.priority}
              onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value as any }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            
            <input
              type="date"
              value={editData.dueDate}
              onChange={(e) => setEditData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              Save
            </Button>
            <Button onClick={handleCancel} variant="secondary" size="sm">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${todo.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start space-x-3">
   
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`text-sm font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {todo.title}
              </h3>
              
              {todo.description && (
                <p className={`mt-1 text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                  {todo.description}
                </p>
              )}
              
              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[todo.priority]}`}>
                  {getPriorityLabel(todo.priority)}
                </span>
                
                {todo.dueDate && (
                  <span className={`flex items-center ${isOverdue(todo.dueDate) && !todo.completed ? 'text-red-600' : ''}`}>
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(todo.dueDate)}
                    {isOverdue(todo.dueDate) && !todo.completed && (
                      <span className="ml-1 text-red-600">(Overdue)</span>
                    )}
                  </span>
                )}
                
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDate(todo.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            onClick={handleEdit}
            variant="secondary"
            size="sm"
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
          
          <Button
            onClick={handleDelete}
            variant="danger"
            size="sm"
            className="text-red-400 hover:text-red-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem; 