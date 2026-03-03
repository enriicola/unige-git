'use client';

import { useCallback, useMemo } from 'react';
import useFetchData from '#js/useFetchData';
import { API_REST_BASE } from '#js/constants';

export default function useChallenge() {
  const { fetchData, loading } = useFetchData();

  const getChallenges = useCallback(async () => {
    const url = `${API_REST_BASE}/challenges`;
    return fetchData(url);
  }, [fetchData]);

  const getChallengeById = useCallback(
    async (challengeId) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}`;
      return fetchData(url);
    },
    [fetchData]
  );

  const getChallengeMatches = useCallback(
    async (challengeId) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}/matches`;
      return fetchData(url);
    },
    [fetchData]
  );

  const getChallengeParticipants = useCallback(
    async (challengeId) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}/participants`;
      return fetchData(url);
    },
    [fetchData]
  );

  const joinChallenge = useCallback(
    async (challengeId, studentId) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}/join`;
      return fetchData(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      });
    },
    [fetchData]
  );

  const createChallenge = useCallback(
    async (payload) => {
      const url = `${API_REST_BASE}/challenges`;
      return fetchData(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    },
    [fetchData]
  );

  const updateChallenge = useCallback(
    async (challengeId, payload) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}`;
      return fetchData(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    },
    [fetchData]
  );

  const publishChallenge = useCallback(
    async (id) => {
      const url = `${API_REST_BASE}/challenges/${id}/publish`;
      return fetchData(url, { method: 'POST' });
    },
    [fetchData]
  );

  const assignChallenge = useCallback(
    async (challengeId, overwrite = false) => {
      const searchParams = overwrite ? '?overwrite=true' : '';
      const url = `${API_REST_BASE}/challenges/${challengeId}/assign${searchParams}`;
      return fetchData(url, { method: 'POST' });
    },
    [fetchData]
  );

  const startChallenge = useCallback(
    async (challengeId) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}/start`;
      return fetchData(url, { method: 'POST' });
    },
    [fetchData]
  );
  const endCodingPhase = useCallback(
    async (challengeId) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}/end-coding`;
      return fetchData(url, { method: 'POST' });
    },
    [fetchData]
  );
  const assignPeerReviews = useCallback(
    async (challengeId, expectedReviewsPerSubmission) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}/peer-reviews/assign`;
      return fetchData(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expectedReviewsPerSubmission }),
      });
    },
    [fetchData]
  );
  const updateExpectedReviews = useCallback(
    async (challengeId, expectedReviewsPerSubmission) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}/expected-reviews`;
      return fetchData(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expectedReviewsPerSubmission }),
      });
    },
    [fetchData]
  );
  const startPeerReview = useCallback(
    async (challengeId) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}/peer-reviews/start`;
      return fetchData(url, { method: 'POST' });
    },
    [fetchData]
  );
  const endPeerReview = useCallback(
    async (challengeId) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}/end-peer-review`;
      return fetchData(url, { method: 'POST' });
    },
    [fetchData]
  );
  const getStudentPeerReviewAssignments = useCallback(
    async (challengeId, studentId) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}/peer-reviews/for-student?studentId=${studentId}`;
      return fetchData(url);
    },
    [fetchData]
  );
  const getPeerReviewSummary = useCallback(
    async (challengeId, studentId) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}/peer-reviews/summary?studentId=${studentId}`;
      return fetchData(url);
    },
    [fetchData]
  );
  const getChallengeForJoinedStudent = useCallback(
    async (challengeId, studentId) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}/for-student?studentId=${studentId}`;
      return fetchData(url);
    },
    [fetchData]
  );
  const getChallengesForStudent = useCallback(
    async (studentId) => {
      const url = `${API_REST_BASE}/challenges/for-student?studentId=${studentId}`;
      return fetchData(url);
    },
    [fetchData]
  );
  const getStudentAssignedMatchSetting = useCallback(
    async (challengeId, studentId) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}/matchSetting?studentId=${studentId}`;
      return fetchData(url);
    },
    [fetchData]
  );
  const getStudentAssignedMatch = useCallback(
    async (challengeId, studentId) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}/match?studentId=${studentId}`;
      return fetchData(url);
    },
    [fetchData]
  );
  const unpublishChallenge = useCallback(
    async (id) => {
      const url = `${API_REST_BASE}/challenges/${id}/unpublish`;
      return fetchData(url, { method: 'POST' });
    },
    [fetchData]
  );
  const submitSubmission = useCallback(
    async ({ matchId, code, isAutomatic = false, language = 'cpp' }) => {
      const url = `${API_REST_BASE}/submissions`;
      return fetchData(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId,
          code,
          isAutomatic,
          is_automatic_submission: isAutomatic,
          language,
        }),
      });
    },
    [fetchData]
  );
  const getLastSubmission = useCallback(
    async (matchId) => {
      const url = `${API_REST_BASE}/submissions/last?matchId=${matchId}`;
      return fetchData(url);
    },
    [fetchData]
  );

  const runCode = useCallback(
    async ({ matchSettingId, code, language }) => {
      const url = `${API_REST_BASE}/run`;
      return fetchData(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchSettingId,
          code,
          language,
        }),
      });
    },
    [fetchData]
  );

  const getStudentVotes = useCallback(
    async (challengeId) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}/peer-reviews/votes`;
      return fetchData(url, { method: 'GET' });
    },
    [fetchData]
  );

  const submitPeerReviewVote = useCallback(
    async (
      peerReviewAssignmentId,
      vote,
      testCaseInput = null,
      expectedOutput = null
    ) => {
      const url = `${API_REST_BASE}/peer-reviews/${peerReviewAssignmentId}/vote`;

      return fetchData(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vote,
          testCaseInput,
          expectedOutput,
        }),
      });
    },
    [fetchData]
  );

  const runCustomTests = useCallback(
    async ({ challengeId, studentId, code, language = 'cpp', tests }) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}/custom-tests/run`;
      return fetchData(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          code,
          language,
          tests,
        }),
      });
    },
    [fetchData]
  );

  const savePeerReviewTests = useCallback(
    async ({ challengeId, assignmentId, studentId, tests }) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}/peer-reviews/${assignmentId}/tests`;
      return fetchData(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          tests,
        }),
      });
    },
    [fetchData]
  );

  const getChallengeResults = useCallback(
    async (challengeId, studentId) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}/results?studentId=${studentId}`;
      return fetchData(url);
    },
    [fetchData]
  );
  const getTeacherChallengeResults = useCallback(
    async (challengeId, includePeerReviewResults = true) => {
      const includeResultsParam = includePeerReviewResults ? 'true' : 'false';
      const url = `${API_REST_BASE}/challenges/${challengeId}/teacher-results?includePeerReviewResults=${includeResultsParam}`;
      return fetchData(url);
    },
    [fetchData]
  );
  const addMatchSettingPrivateTest = useCallback(
    async ({ challengeId, matchSettingId, assignmentId, input, output }) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}/match-settings/${matchSettingId}/private-tests`;
      return fetchData(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId, input, output }),
      });
    },
    [fetchData]
  );
  const getChallengeLeaderboard = useCallback(
    async (challengeId, studentId) => {
      const query = studentId != null ? `?studentId=${Number(studentId)}` : '';
      const url = `${API_REST_BASE}/challenges/${challengeId}/leaderboard${query}`;
      return fetchData(url);
    },
    [fetchData]
  );
  const endChallenge = useCallback(
    async (challengeId) => {
      const url = `${API_REST_BASE}/challenges/${challengeId}/end-challenge`;
      return fetchData(url, { method: 'POST' });
    },
    [fetchData]
  );

  const finalizePeerReview = useCallback(
    async (challengeId) => {
      const url = `${API_REST_BASE}/peer-review/finalize-challenge`;
      return fetchData(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId }),
      });
    },
    [fetchData]
  );

  const exitPeerReview = useCallback(
    async (challengeId, studentId, votes = []) => {
      const url = `${API_REST_BASE}/peer-review/exit`;
      return fetchData(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, studentId, votes }),
      });
    },
    [fetchData]
  );
  return useMemo(
    () => ({
      loading,
      getChallenges,
      getChallengeById,
      getChallengeMatches,
      getChallengeParticipants,
      joinChallenge,
      createChallenge,
      updateChallenge,
      publishChallenge,
      assignChallenge,
      unpublishChallenge,
      startChallenge,
      endCodingPhase,
      assignPeerReviews,
      updateExpectedReviews,
      startPeerReview,
      endPeerReview,
      getStudentPeerReviewAssignments,
      getChallengeForJoinedStudent,
      getChallengesForStudent,
      getStudentAssignedMatchSetting,
      getStudentAssignedMatch,
      submitSubmission,
      getLastSubmission,
      runCode,
      runCustomTests,
      savePeerReviewTests,
      getChallengeResults,
      getTeacherChallengeResults,
      addMatchSettingPrivateTest,
      getChallengeLeaderboard,
      endChallenge,
      getPeerReviewSummary,
      getStudentVotes,
      submitPeerReviewVote,
      finalizePeerReview,
      exitPeerReview,
    }),
    [
      loading,
      getChallenges,
      getChallengeById,
      getChallengeMatches,
      getChallengeParticipants,
      joinChallenge,
      createChallenge,
      updateChallenge,
      publishChallenge,
      assignChallenge,
      unpublishChallenge,
      startChallenge,
      endCodingPhase,
      assignPeerReviews,
      updateExpectedReviews,
      startPeerReview,
      endPeerReview,
      getStudentPeerReviewAssignments,
      getChallengeForJoinedStudent,
      getChallengesForStudent,
      getStudentAssignedMatchSetting,
      getStudentAssignedMatch,
      submitSubmission,
      getLastSubmission,
      runCode,
      runCustomTests,
      savePeerReviewTests,
      getChallengeResults,
      getTeacherChallengeResults,
      addMatchSettingPrivateTest,
      getChallengeLeaderboard,
      endChallenge,
      getPeerReviewSummary,
      getStudentVotes,
      submitPeerReviewVote,
      finalizePeerReview,
      exitPeerReview,
    ]
  );
}
