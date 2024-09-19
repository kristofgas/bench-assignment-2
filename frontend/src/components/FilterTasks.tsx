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
    <div className="filter-tasks">
      <label className="filter-checkbox">
        <input
          type="checkbox"
          checked={filters.isCompleted === true}
          onChange={(e) => handleFilterChange('isCompleted', e.target.checked ? true : null)}
        />
        Show completed tasks
      </label>
      <label className="filter-checkbox">
        <input
          type="checkbox"
          checked={filters.isFavorite === true}
          onChange={(e) => handleFilterChange('isFavorite', e.target.checked ? true : null)}
        />
        Show favorite tasks
      </label>
      <select
        className="filter-select"
        value={filters.sortBy || ''}
        onChange={(e) => handleFilterChange('sortBy', e.target.value as 'title' | 'rank' | undefined)}
      >
        <option value="">Sort by</option>
        <option value="title">Title</option>
        <option value="rank">Rank</option>
      </select>
      <label className="filter-checkbox">
        <input
          type="checkbox"
          checked={filters.sortDescending}
          onChange={(e) => handleFilterChange('sortDescending', e.target.checked)}
        />
        Sort descending
      </label>
    </div>
  );
});

FilterTasks.displayName = 'FilterTasks';

export default FilterTasks;