import { API_REST_BASE } from '#js/constants';

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_REST_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  return res.json();
}
