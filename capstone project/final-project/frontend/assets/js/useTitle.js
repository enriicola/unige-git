import { useCallback, useMemo } from 'react';
import useFetchData from '#js/useFetchData';
import { API_REST_BASE } from '#js/constants';

export default function useTitle() {
  const { fetchData, loading } = useFetchData();

  const evaluateTitle = useCallback(async () => {
    const url = `${API_REST_BASE}/rewards/evaluate-title`;
    return fetchData(url, { method: 'POST' });
  }, [fetchData]);

  return useMemo(
    () => ({
      loading,
      evaluateTitle,
    }),
    [loading, evaluateTitle]
  );
}
