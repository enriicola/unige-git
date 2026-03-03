import { useAppDispatch } from '#js/store/hooks';
import { clearUser } from '#js/store/slices/auth';
import { useCallback, useMemo, useState } from 'react';

const useFetchData = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleResponse = useCallback(
    async (response) => {
      if (response.status === 401) {
        dispatch(clearUser());
        window.location = '/login';
        return { success: false, status: 401, message: 'User not logged in' };
      }
      if (response.status >= 400) {
        let message = response.statusText || 'Request failed';
        let details = null;
        try {
          const text = await response.text();
          if (text) {
            try {
              const parsed = JSON.parse(text);
              details = parsed;
              message =
                parsed?.error || parsed?.message || parsed?.details || message;
            } catch {
              message = text;
            }
          }
        } catch {
          // keep default message
        }
        return {
          success: false,
          status: response.status,
          message,
          error: message,
          details,
        };
      }
      return response.json();
    },
    // dispatch is stable from Redux and doesn't need to be in dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const fetchData = useCallback(
    async (url, options = {}) => {
      setLoading(true);
      try {
        const response = await fetch(url, {
          credentials: 'include',
          ...options,
        });
        const data = await handleResponse(response);
        setLoading(false);
        return data;
      } catch (err) {
        setLoading(false);
        if (err.name === 'AbortError') throw err;
        const message = err?.message || 'Request failed';
        return {
          success: false,
          status: 0,
          message,
          error: message,
        };
      }
    },
    [handleResponse]
  );

  return useMemo(() => ({ fetchData, loading }), [fetchData, loading]);
};

export default useFetchData;
