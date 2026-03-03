export const MatchSettingStatus = {
  DRAFT: 'draft',
  READY: 'ready',
};

export const ChallengeStatus = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  ASSIGNED: 'assigned',
  STARTED_PHASE_ONE: 'started_phase_one',
  ENDED_PHASE_ONE: 'ended_phase_one',
  STARTED_PHASE_TWO: 'started_phase_two',
  ENDED_PHASE_TWO: 'ended_phase_two',
};

export const SubmissionStatus = {
  WRONG: 'wrong',
  IMPROVABLE: 'improvable',
  PROBABLY_CORRECT: 'probably_correct',
};

export const VoteType = {
  CORRECT: 'correct',
  INCORRECT: 'incorrect',
  ABSTAIN: 'abstain',
};

export const EvaluationStatus = {
  INVALID_OUTPUT: 'invalid_expected_output',
  NO_BUG: 'no_bug',
  BUG_PROVEN: 'bug_proven',
  COMPILE_ERROR: 'compile_error',
  RUNTIME_ERROR: 'runtime_error',
  TIMEOUT: 'timeout',
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

export const Scoring_Availability = {
  PEER_REVIEW_NOT_ENDED: 'PEER_REVIEW_NOT_ENDED',
  SCORING_IN_PROGRESS: 'SCORING_IN_PROGRESS',
  READY: 'READY',
};
