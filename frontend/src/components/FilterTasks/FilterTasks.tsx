import React, { useState, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';

interface FilterTasksProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: TaskFilters) => void;
}

export interface TaskFilters {
  isCompleted: boolean | null;
  isFavorite: boolean | null;
  sortBy?: 'title' | 'rank';
  sortDescending: boolean;
}

const FilterTasks: React.FC<FilterTasksProps> = ({ isOpen, onClose, onFilterChange }) => {
  const [filters, setFilters] = useState<TaskFilters>({
    isCompleted: null,
    isFavorite: null,
    sortDescending: false,
  });

  const handleFilterChange = useCallback((key: keyof TaskFilters, value: TaskFilters[keyof TaskFilters]) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, [key]: value };
      onFilterChange(newFilters);
      return newFilters;
    });
  }, [onFilterChange]);

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.isCompleted === true}
              onChange={(e) => handleFilterChange('isCompleted', e.target.checked ? true : null)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Show completed tasks</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.isFavorite === true}
              onChange={(e) => handleFilterChange('isFavorite', e.target.checked ? true : null)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Show favorite tasks</span>
          </label>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort by
            </label>
            <select
              className="w-full rounded-md border border-gray-300 shadow-sm py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              value={filters.sortBy || ''}
              onChange={(e) => handleFilterChange('sortBy', e.target.value as 'title' | 'rank' | undefined)}
            >
              <option value="">None</option>
              <option value="title">Title</option>
              <option value="rank">Priority</option>
            </select>
          </div>
          <div className="mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.sortDescending}
                onChange={(e) => handleFilterChange('sortDescending', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Sort descending</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterTasks;