'use client';

import { useCallback, useMemo } from 'react';
import useFetchData from '#js/useFetchData';
import { API_REST_BASE } from '#js/constants';

export default function useMatchSettings() {
  const { fetchData, loading } = useFetchData();

  const getMatchSettings = useCallback(async () => {
    const url = `${API_REST_BASE}/matchSettings`;
    return fetchData(url);
  }, [fetchData]);

  const getMatchSetting = useCallback(
    async (matchSettingId) => {
      const url = `${API_REST_BASE}/matchSettings/${matchSettingId}`;
      return fetchData(url);
    },
    [fetchData]
  );

  const getMatchSettingsReady = useCallback(async () => {
    const url = `${API_REST_BASE}/matchSettingsReady`;
    return fetchData(url);
  }, [fetchData]);

  const createMatchSetting = useCallback(
    async (payload) => {
      const url = `${API_REST_BASE}/matchSettings`;
      return fetchData(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    },
    [fetchData]
  );

  const updateMatchSetting = useCallback(
    async (matchSettingId, payload) => {
      const url = `${API_REST_BASE}/matchSettings/${matchSettingId}`;
      return fetchData(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    },
    [fetchData]
  );

  const publishMatchSetting = useCallback(
    async (matchSettingId) => {
      const url = `${API_REST_BASE}/matchSettings/${matchSettingId}/publish`;
      return fetchData(url, { method: 'POST' });
    },
    [fetchData]
  );

  const unpublishMatchSetting = useCallback(
    async (matchSettingId) => {
      const url = `${API_REST_BASE}/matchSettings/${matchSettingId}/unpublish`;
      return fetchData(url, { method: 'POST' });
    },
    [fetchData]
  );

  const duplicateMatchSetting = useCallback(
    async (matchSettingId) => {
      const url = `${API_REST_BASE}/matchSettings/${matchSettingId}/duplicate`;
      return fetchData(url, { method: 'POST' });
    },
    [fetchData]
  );

  return useMemo(
    () => ({
      loading,
      getMatchSettings,
      getMatchSetting,
      getMatchSettingsReady,
      createMatchSetting,
      updateMatchSetting,
      publishMatchSetting,
      unpublishMatchSetting,
      duplicateMatchSetting,
    }),
    [
      loading,
      getMatchSettings,
      getMatchSetting,
      getMatchSettingsReady,
      createMatchSetting,
      updateMatchSetting,
      publishMatchSetting,
      unpublishMatchSetting,
      duplicateMatchSetting,
    ]
  );
}
