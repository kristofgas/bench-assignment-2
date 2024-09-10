"use client"
import { useEffect, useRef, useState } from "react";

export const useMemoAsync = <T>(
  cb: () => Promise<T>,
  deps: unknown[],
  initialValue: T = null
): { value: T; loading: boolean; error: any } => {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const activeRef = useRef(true);

  useEffect(() => {
    activeRef.current = true;
    return () => {
      activeRef.current = false;
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    (async function () {
      try {
        const res = await cb();
        if (!activeRef.current) {
          return;
        }
        setValue(res);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    })();
  }, [...deps]);

  return { value, loading: isLoading, error };
};
