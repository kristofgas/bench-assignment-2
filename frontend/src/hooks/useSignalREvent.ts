import { useEffect, useCallback } from 'react';
import { useSignalRConnection } from '../providers/SignalRProvider';

export const useSignalREvent = (eventName: string, callback: (...args: any[]) => void) => {
  const { connection } = useSignalRConnection();

  const memoizedCallback = useCallback(callback, [callback]);

  useEffect(() => {
    if (connection) {
      connection.on(eventName, memoizedCallback);
      return () => {
        connection.off(eventName, memoizedCallback);
      };
    }
  }, [connection, eventName, memoizedCallback]);
};