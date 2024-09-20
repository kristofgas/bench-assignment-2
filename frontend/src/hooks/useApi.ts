import { useState, useCallback } from 'react';
import { genApiClient } from '../services/backend/genApiClient';
import { handleApiError, AppError } from '../utils/errorHandling';
import { ApiFetchClient } from '../services/backend/client.generated';

export function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const apiCall = useCallback(async <T>(
    apiFunction: (client: ApiFetchClient) => Promise<T>
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const client = await genApiClient();
      const result = await apiFunction(client);
      return result;
    } catch (err) {
      const appError = handleApiError(err);
      setError(appError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { apiCall, isLoading, error };
}