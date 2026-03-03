'use client';

import { useCallback, useMemo } from 'react';
import useFetchData from '#js/useFetchData';
import { API_REST_BASE } from '#js/constants';

export default function useRewards() {
  const { fetchData, loading } = useFetchData();
  const getRules = useCallback(async () => {
    const url = `${API_REST_BASE}/rules`;
    return fetchData(url);
  }, [fetchData]);

  return useMemo(
    () => ({
      loading,
      getRules,
    }),
    [loading, getRules]
  );
}
