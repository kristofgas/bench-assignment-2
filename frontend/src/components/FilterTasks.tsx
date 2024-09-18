import React from 'react';

interface FilterTasksProps {
  onFilterChange: (filters: TaskFilters) => void;
}

export interface TaskFilters {
    isCompleted: boolean | null;
    isFavorite: boolean | null;
    sortBy?: 'title' | 'rank';
    sortDescending: boolean;
  }

const FilterTasks: React.FC<FilterTasksProps> = ({ onFilterChange }) => {
    const [filters, setFilters] = React.useState<TaskFilters>({
        isCompleted: null,
        isFavorite: null,
        sortDescending: false,
      });

  const handleFilterChange = (key: keyof TaskFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div>
      <label>
  <input
    type="checkbox"
    checked={filters.isCompleted === true}
    onChange={(e) => handleFilterChange('isCompleted', e.target.checked ? true : null)}
  />
  Show completed tasks
</label>
<label>
  <input
    type="checkbox"
    checked={filters.isFavorite === true}
    onChange={(e) => handleFilterChange('isFavorite', e.target.checked ? true : null)}
  />
  Show favorite tasks
</label>
      <select
        value={filters.sortBy || ''}
        onChange={(e) => handleFilterChange('sortBy', e.target.value || undefined)}
      >
        <option value="">Sort by</option>
        <option value="title">Title</option>
        <option value="rank">Rank</option>
      </select>
      <label>
        <input
          type="checkbox"
          checked={filters.sortDescending}
          onChange={(e) => handleFilterChange('sortDescending', e.target.checked)}
        />
        Sort descending
      </label>
    </div>
  );
};

export default FilterTasks;