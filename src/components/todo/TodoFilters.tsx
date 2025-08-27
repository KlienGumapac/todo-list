import React from 'react';
import type { TodoFilter, TodoSort } from '@/types';
import { TODO_FILTERS, SORT_OPTIONS } from '@/constants';

interface TodoFiltersProps {
  filter: TodoFilter;
  sortBy: TodoSort;
  sortOrder: 'asc' | 'desc';
  onFilterChange: (filter: TodoFilter) => void;
  onSortChange: (sortBy: TodoSort) => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

const TodoFilters: React.FC<TodoFiltersProps> = ({
  filter,
  sortBy,
  sortOrder,
  onFilterChange,
  onSortChange,
  onSortOrderChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
   
      <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
        {Object.entries(TODO_FILTERS).map(([key, value]) => (
          <button
            key={key}
            onClick={() => onFilterChange(value as TodoFilter)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
              filter === value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as TodoSort)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {Object.entries(SORT_OPTIONS).map(([key, value]) => (
            <option key={key} value={value}>
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </option>
          ))}
        </select>

        <button
          onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
        >
          <svg
            className={`w-4 h-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TodoFilters; 