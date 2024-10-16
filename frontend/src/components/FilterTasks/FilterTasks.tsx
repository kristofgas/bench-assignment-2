import React, { useState, useCallback } from 'react';
import { FaFilter } from 'react-icons/fa';

interface FilterTasksProps {
  onFilterChange: (filters: TaskFilters) => void;
}

export interface TaskFilters {
  isCompleted: boolean | null;
  isFavorite: boolean | null;
  sortBy?: 'title' | 'rank';
  sortDescending: boolean;
}

const FilterTasks: React.FC<FilterTasksProps> = React.memo(({ onFilterChange }) => {
  const [filters, setFilters] = useState<TaskFilters>({
    isCompleted: null,
    isFavorite: null,
    sortDescending: false,
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = useCallback((key: keyof TaskFilters, value: TaskFilters[keyof TaskFilters]) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, [key]: value };
      onFilterChange(newFilters);
      return newFilters;
    });
  }, [onFilterChange]);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaFilter className="mr-2 h-5 w-5" />
          Filters
        </button>
      </div>
  
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <label className="block px-4 py-2 text-sm">
              <input
                type="checkbox"
                checked={filters.isCompleted === true}
                onChange={(e) => handleFilterChange('isCompleted', e.target.checked ? true : null)}
                className="mr-2"
              />
              Show completed tasks
            </label>
            <label className="block px-4 py-2 text-sm">
              <input
                type="checkbox"
                checked={filters.isFavorite === true}
                onChange={(e) => handleFilterChange('isFavorite', e.target.checked ? true : null)}
                className="mr-2"
              />
              Show favorite tasks
            </label>
            <div className="px-4 py-2">
              <select
                className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                value={filters.sortBy || ''}
                onChange={(e) => handleFilterChange('sortBy', e.target.value as 'title' | 'rank' | undefined)}
              >
                <option value="">Sort by</option>
                <option value="title">Title</option>
                <option value="rank">Rank</option>
              </select>
            </div>
            <label className="block px-4 py-2 text-sm">
              <input
                type="checkbox"
                checked={filters.sortDescending}
                onChange={(e) => handleFilterChange('sortDescending', e.target.checked)}
                className="mr-2"
              />
              Sort descending
            </label>
          </div>
        </div>
      )}
    </div>
  );
});

export default FilterTasks;