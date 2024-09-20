import { useMemo } from 'react';
import { Task } from '../types/task';
import { TaskFilters } from '../components/FilterTasks';

export const useFilteredTasks = (tasks: Task[] | undefined, filters: TaskFilters) => {
  return useMemo(() => {
    if (!tasks) return [];
    
    return tasks.filter(task => {
      if (filters.isCompleted !== null && task.isCompleted !== filters.isCompleted) return false;
      if (filters.isFavorite !== null && task.isFavorite !== filters.isFavorite) return false;
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'title') {
        return filters.sortDescending ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title);
      } else if (filters.sortBy === 'rank') {
        return filters.sortDescending ? b.rank - a.rank : a.rank - b.rank;
      }
      return 0;
    });
  }, [tasks, filters]);
};