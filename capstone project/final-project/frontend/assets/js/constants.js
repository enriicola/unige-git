export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/rest';

export const API_REST_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/rest';

export const NETWORK_RESPONSE_NOT_OK = 'Network response was not ok: ';

export const ChallengeStatus = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  ASSIGNED: 'assigned',
  STARTED_PHASE_ONE: 'started_phase_one',
  ENDED_PHASE_ONE: 'ended_phase_one',
  STARTED_PHASE_TWO: 'started_phase_two',
  ENDED_PHASE_TWO: 'ended_phase_two',
};

export const ChallengeStatusLabels = {
  [ChallengeStatus.PUBLIC]: 'Public',
  [ChallengeStatus.PRIVATE]: 'Private',
  [ChallengeStatus.ASSIGNED]: 'Assigned',
  [ChallengeStatus.STARTED_PHASE_ONE]: 'Coding phase in progress',
  [ChallengeStatus.ENDED_PHASE_ONE]: 'Coding phase complete',
  [ChallengeStatus.STARTED_PHASE_TWO]: 'Peer review in progress',
  [ChallengeStatus.ENDED_PHASE_TWO]: 'Completed',
};

export const getChallengeStatusLabel = (status) => {
  if (status === 'draft') return 'Private';
  return ChallengeStatusLabels[status] || status || 'Unknown';
};

export const MatchSettingStatus = {
  DRAFT: 'draft',
  READY: 'ready',
};

export const BadgeCategory = {
  CHALLENGE_MILESTONE: 'challenge_milestone',
  REVIEW_MILESTONE: 'review_milestone',
  REVIEW_QUALITY: 'review_quality',
};

export const BadgeLevel = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
};

export const BadgeMetric = {
  CHALLENGES_COMPLETED: 'challenges_completed',
  REVIEWS_COMPLETED: 'reviews_completed',
  CORRECT_REVIEWS: 'correct_reviews',
  ERRORS_FOUND: 'errors_found',
};
