import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useQueryInvalidation = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = useCallback((queryKeys: string[]) => {
    queryKeys.forEach(key => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  }, [queryClient]);

  return { invalidateQueries };
};