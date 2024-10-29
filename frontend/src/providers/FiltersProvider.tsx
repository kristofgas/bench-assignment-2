import React, { createContext, useContext, useState, useCallback } from 'react';
import { TaskFilters } from 'types/filters';

interface FiltersContextType {
  filters: TaskFilters;
  setFilters: (filters: TaskFilters) => void;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<TaskFilters>({
    isCompleted: null,
    isFavorite: null,
    sortDescending: false,
  });

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return context;
}