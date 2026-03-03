import { apiFetch } from './api';

export async function getAllChallenges() {
  return apiFetch('/challenges');
}
export async function joinChallenge(challengeId, studentId) {
  return apiFetch(`/challenge/${challengeId}/join`, {
    method: 'POST',
    body: JSON.stringify({ studentId }),
  });
}
