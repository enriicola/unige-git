import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
  vi,
} from 'vitest';

// --- DYNAMIC IMPORTS & VARIABLES ---
let Challenge;
let MatchSetting;
let ChallengeMatchSetting;
let ChallengeParticipant;
let Match;
let Submission;
let PeerReviewAssignment;
let PeerReviewVote;
let SubmissionScoreBreakdown;
let User;
let calculateChallengeScores;
let ChallengeStatus;
let VoteType;

// --- MOCK EXECUTE CODE TESTS ---
vi.mock('#root/services/execute-code-tests.js', () => ({
  executeCodeTests: vi.fn(async ({ code, testCases }) => {
    const results = testCases.map((tc) => {
      const inputStr = String(tc.input);
      if (code.includes('BUGGY') && inputStr.includes('KILLER')) {
        return { passed: false, actualOutput: '["WRONG"]' };
      }
      return { passed: true, actualOutput: '["CORRECT"]' };
    });
    return { isCompiled: true, testResults: results };
  }),
}));

beforeAll(async () => {
  await import('#root/app_initial.js');

  Challenge = (await import('#root/models/challenge.js')).default;
  MatchSetting = (await import('#root/models/match-setting.js')).default;
  ChallengeMatchSetting = (
    await import('#root/models/challenge-match-setting.js')
  ).default;
  ChallengeParticipant = (await import('#root/models/challenge-participant.js'))
    .default;
  Match = (await import('#root/models/match.js')).default;
  Submission = (await import('#root/models/submission.js')).default;
  PeerReviewAssignment = (
    await import('#root/models/peer_review_assignment.js')
  ).default;
  PeerReviewVote = (await import('#root/models/peer-review-vote.js')).default;
  SubmissionScoreBreakdown = (
    await import('#root/models/submission-score-breakdown.js')
  ).default;
  User = (await import('#root/models/user.js')).default;

  const enums = await import('#root/models/enum/enums.js');
  ChallengeStatus = enums.ChallengeStatus;
  VoteType = enums.VoteType;

  const service = await import('#root/services/scoring-service.js');
  calculateChallengeScores = service.calculateChallengeScores;
});

const createScenario = async () => {
  const suffix = Date.now() + Math.floor(Math.random() * 10000);

  const matchSetting = await MatchSetting.create({
    problemTitle: `Prob ${suffix}`,
    problemDescription: 'Desc',
    referenceSolution: 'void main(){}',
    publicTests: [],
    privateTests: [{ input: '["1"]', output: '["1"]' }], // 1 teacher test
    status: 'ready',
  });

  const challenge = await Challenge.create({
    title: `Test ${suffix}`,
    status: ChallengeStatus.ENDED_PHASE_TWO, // Default ended
    endPhaseTwoDateTime: new Date(),
    scoringStatus: 'completed', // Default completed
    duration: 60,
    startDatetime: new Date(),
    endDatetime: new Date(),
    durationPeerReview: 20,
    allowedNumberOfReview: 2,
  });

  const cms = await ChallengeMatchSetting.create({
    challengeId: challenge.id,
    matchSettingId: matchSetting.id,
  });

  const userA = await User.create({
    username: `A_${suffix}`,
    email: `a_${suffix}@t.com`,
    role: 'student',
    password: 'p',
  });
  const userB = await User.create({
    username: `B_${suffix}`,
    email: `b_${suffix}@t.com`,
    role: 'student',
    password: 'p',
  });

  const partA = await ChallengeParticipant.create({
    challengeId: challenge.id,
    studentId: userA.id,
  });
  const partB = await ChallengeParticipant.create({
    challengeId: challenge.id,
    studentId: userB.id,
  });

  const matchA = await Match.create({
    challengeMatchSettingId: cms.id,
    challengeParticipantId: partA.id,
  });

  const subA = await Submission.create({
    matchId: matchA.id,
    challengeParticipantId: partA.id,
    code: 'CORRECT',
    isFinal: true,
    privateTestResults: JSON.stringify([{ passed: true }]), // Teacher pass
  });

  const matchB = await Match.create({
    challengeMatchSettingId: cms.id,
    challengeParticipantId: partB.id,
  });

  const subB = await Submission.create({
    matchId: matchB.id,
    challengeParticipantId: partB.id,
    code: 'CORRECT',
    isFinal: true,
    privateTestResults: JSON.stringify([{ passed: true }]),
  });

  return { challenge, partA, partB, subA, subB };
};

describe('Backend Scoring Requirements', () => {
  beforeEach(async () => {
    if (!SubmissionScoreBreakdown) return;
    await SubmissionScoreBreakdown.destroy({ where: {} });
    await PeerReviewVote.destroy({ where: {} });
    await PeerReviewAssignment.destroy({ where: {} });
    await Submission.destroy({ where: {} });
    await Match.destroy({ where: {} });
    await ChallengeParticipant.destroy({ where: {} });
    await ChallengeMatchSetting.destroy({ where: {} });
    await Challenge.destroy({ where: {} });
    await MatchSetting.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ----------------------------------------------------------------
  // REQ 1 & 2: SCORING AVAILABILITY
  // ----------------------------------------------------------------

  it('Score breakdown is created/updated (Simulating "Completed")', async () => {
    const { challenge, partA, subB } = await createScenario();

    // Verify "In Progress" state (no breakdown yet)
    let breakdown = await SubmissionScoreBreakdown.findOne({
      where: { challengeParticipantId: partA.id },
    });
    expect(breakdown).toBeNull();

    // Setup: A reviews B (Correctly)
    const assign = await PeerReviewAssignment.create({
      reviewerId: partA.id,
      submissionId: subB.id,
    });
    await PeerReviewVote.create({
      peerReviewAssignmentId: assign.id,
      vote: VoteType.CORRECT,
      isVoteCorrect: true,
    });

    // Action: Run calculation (Simulates "Scoring Completed")
    const results = await calculateChallengeScores(challenge.id);

    // Assert: Data exists
    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThan(0);

    breakdown = await SubmissionScoreBreakdown.findOne({
      where: { challengeParticipantId: partA.id },
    });
    expect(breakdown).not.toBeNull();
    expect(breakdown.totalScore).toBe(100);
  });

  // ----------------------------------------------------------------
  // REQ 3: CODE REVIEW SCORE - NORMALIZATION & CLAMPING [0, 50]
  // ----------------------------------------------------------------

  it('Code Review Score is computed via formula and clamped to [0, 50]', async () => {
    const { challenge, partA, subB } = await createScenario();

    // --- CASE A: Perfect Score (Max 50) ---
    const assign1 = await PeerReviewAssignment.create({
      reviewerId: partA.id,
      submissionId: subB.id,
    });
    await PeerReviewVote.create({
      peerReviewAssignmentId: assign1.id,
      vote: VoteType.CORRECT,
      isVoteCorrect: true,
    });

    // Run calc
    let results = await calculateChallengeScores(challenge.id);
    let resA = results.find((r) => r.challengeParticipantId === partA.id);

    // Expect: 50 (Max)
    expect(resA.codeReviewScore).toBe(50);

    // --- CASE B: Terrible Score (Should be 0, not negative) ---
    // Clear previous votes
    await PeerReviewVote.destroy({ where: {} });
    await PeerReviewAssignment.destroy({ where: {} });

    // A reviews B: WRONG vote (Says Incorrect on correct code)
    const assign2 = await PeerReviewAssignment.create({
      reviewerId: partA.id,
      submissionId: subB.id,
    });
    await PeerReviewVote.create({
      peerReviewAssignmentId: assign2.id,
      vote: VoteType.INCORRECT,
      testCaseInput: '["A"]',
      expectedOutput: '["B"]',
      isExpectedOutputCorrect: true,
      // isVoteCorrect defaults to false -> W
    });

    // Formula: 2*E(0) + 1*C(0) - 0.5*W(1) = -0.5
    // Normalized: 50 * (-0.5 / 1) = -25.
    // Clamped: 0.

    results = await calculateChallengeScores(challenge.id);
    resA = results.find((r) => r.challengeParticipantId === partA.id);

    expect(resA.codeReviewScore).toBe(0); // Clamped at 0
  });

  // ----------------------------------------------------------------
  // REQ 4: IMPLEMENTATION SCORE - FINAL VALUE (Base - Penalty, Clamped)
  // ----------------------------------------------------------------

  it('Final Implementation Score = Base - Penalty, clamped to [0, 50]', async () => {
    const { challenge, partA, subA, partB } = await createScenario();

    // --- CASE A: Penalty application ---
    // Teacher: Passed (Base = 50)
    // Peer: B finds bug (Penalty)
    await subA.update({ code: 'BUGGY' });

    const assign = await PeerReviewAssignment.create({
      reviewerId: partB.id,
      submissionId: subA.id,
    });
    await PeerReviewVote.create({
      peerReviewAssignmentId: assign.id,
      vote: VoteType.INCORRECT,
      testCaseInput: '["KILLER"]', // Triggers mock failure
      expectedOutput: '["CORRECT"]',
      isExpectedOutputCorrect: true,
      isVoteCorrect: true, // Confirmed bug
    });

    let results = await calculateChallengeScores(challenge.id);
    let resA = results.find((r) => r.challengeParticipantId === partA.id);

    // Base: 50. Penalty: (1 failed / 1 total) * 50 = 50.  penalty 16.67 (50/3).
    // Exp: 50 - 16.67 = 33.33.
    expect(resA.implementationScore).toBeCloseTo(33.33, 1);

    // --- CASE B: Clamped at 0 ---
    // Teacher: Failed (Base = 0).
    // Peer: B finds bug (Penalty exists).
    // Result should be 0 - Penalty = Negative -> Clamped to 0.
    await subA.update({
      privateTestResults: JSON.stringify([{ passed: false }]),
    });

    results = await calculateChallengeScores(challenge.id);
    resA = results.find((r) => r.challengeParticipantId === partA.id);

    expect(resA.implementationScore).toBe(0); // Clamped
  });

  // ----------------------------------------------------------------
  // REQ 5: TOTAL SCORE AGGREGATION
  // ----------------------------------------------------------------

  it('REQ 5: Total Score is the sum of Code Review + Implementation', async () => {
    const { challenge, partA, subA, subB } = await createScenario();

    await subA.update({ code: 'CORRECT' });

    // 2. Code Review: 50 (1 Correct Review)
    const assign = await PeerReviewAssignment.create({
      reviewerId: partA.id,
      submissionId: subB.id,
    });
    await PeerReviewVote.create({
      peerReviewAssignmentId: assign.id,
      vote: VoteType.CORRECT,
      isVoteCorrect: true,
    });

    const results = await calculateChallengeScores(challenge.id);
    const resA = results.find((r) => r.challengeParticipantId === partA.id);

    expect(resA.implementationScore).toBe(50);
    expect(resA.codeReviewScore).toBe(50);
    expect(resA.totalScore).toBe(100); // 50 + 50

    // DB Persistence check
    const dbRecord = await SubmissionScoreBreakdown.findOne({
      where: { challengeParticipantId: partA.id },
    });
    expect(dbRecord.totalScore).toBe(100);
  });
});
