export interface TaskFilters {
    isCompleted: boolean | null;
    isFavorite: boolean | null;
    sortBy?: 'title' | 'rank';
    sortDescending: boolean;
  }