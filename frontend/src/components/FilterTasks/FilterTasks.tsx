import React, { useState, useCallback } from 'react';

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

  const handleFilterChange = useCallback((key: keyof TaskFilters, value: TaskFilters[keyof TaskFilters]) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, [key]: value };
      onFilterChange(newFilters);
      return newFilters;
    });
  }, [onFilterChange]);

  return (
    <div className="filter-tasks bg-gray-100 p-4 rounded-lg mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filters.isCompleted === true}
            onChange={(e) => handleFilterChange('isCompleted', e.target.checked ? true : null)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span>Show completed tasks</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filters.isFavorite === true}
            onChange={(e) => handleFilterChange('isFavorite', e.target.checked ? true : null)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span>Show favorite tasks</span>
        </label>
        <div className="flex items-center space-x-2">
          <select
            className="form-select block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filters.sortBy || ''}
            onChange={(e) => handleFilterChange('sortBy', e.target.value as 'title' | 'rank' | undefined)}
          >
            <option value="">Sort by</option>
            <option value="title">Title</option>
            <option value="rank">Rank</option>
          </select>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.sortDescending}
              onChange={(e) => handleFilterChange('sortDescending', e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Descending</span>
          </label>
        </div>
      </div>
    </div>
  );
});

FilterTasks.displayName = 'FilterTasks';

export default FilterTasks;