'use client';

import { useCallback, useMemo } from 'react';
import useFetchData from '#js/useFetchData';
import { API_REST_BASE } from '#js/constants';

export default function useProfile() {
  const { fetchData, loading } = useFetchData();
  const getProfile = useCallback(async () => {
    const url = `${API_REST_BASE}/students/me/profile`;
    return fetchData(url);
  }, [fetchData]);

  return useMemo(
    () => ({
      loading,
      getProfile,
    }),
    [loading, getProfile]
  );
}
