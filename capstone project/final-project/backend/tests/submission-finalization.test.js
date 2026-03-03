import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import sequelize from '#root/services/sequelize.js';
import { computeFinalSubmissionForMatch } from '#root/services/submission-finalization.js';
import Submission from '#root/models/submission.js';
import Match from '#root/models/match.js';
import Challenge from '#root/models/challenge.js';
import MatchSetting from '#root/models/match-setting.js';
import ChallengeMatchSetting from '#root/models/challenge-match-setting.js';
import ChallengeParticipant from '#root/models/challenge-participant.js';
import User from '#root/models/user.js';
import { ChallengeStatus, SubmissionStatus } from '#root/models/enum/enums.js';

const createFixture = async () => {
  const transaction = await sequelize.transaction();
  try {
    const suffix = Date.now();
    const user = await User.create(
      {
        username: `finalize_user_${suffix}`,
        password: 'testpassword123',
        email: `finalize_user_${suffix}@mail.com`,
        role: 'student',
      },
      { transaction }
    );

    const matchSetting = await MatchSetting.create(
      {
        problemTitle: 'Finalize Submission Test',
        problemDescription: 'Pick the best submission.',
        referenceSolution: '#include <iostream>\nint main(){return 0;}',
        publicTests: [{ input: ['1'], output: '1' }],
        privateTests: [{ input: ['2'], output: '2' }],
        status: 'ready',
      },
      { transaction }
    );

    const challenge = await Challenge.create(
      {
        title: 'Finalize Challenge',
        duration: 60,
        startDatetime: new Date('2026-01-01T09:00:00Z'),
        endDatetime: new Date('2026-01-01T10:00:00Z'),
        durationPeerReview: 30,
        allowedNumberOfReview: 2,
        status: ChallengeStatus.STARTED_PHASE_ONE,
      },
      { transaction }
    );

    const challengeMatchSetting = await ChallengeMatchSetting.create(
      {
        challengeId: challenge.id,
        matchSettingId: matchSetting.id,
      },
      { transaction }
    );

    const participant = await ChallengeParticipant.create(
      {
        studentId: user.id,
        challengeId: challenge.id,
      },
      { transaction }
    );

    const match = await Match.create(
      {
        challengeMatchSettingId: challengeMatchSetting.id,
        challengeParticipantId: participant.id,
      },
      { transaction }
    );

    await transaction.commit();
    return { match, participant };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const createSubmission = async ({
  match,
  participant,
  status,
  isAutomaticSubmission,
  updatedAt,
}) =>
  Submission.create(
    {
      matchId: match.id,
      challengeParticipantId: participant.id,
      code: 'int main() { return 0; }',
      status,
      isAutomaticSubmission,
      createdAt: updatedAt,
      updatedAt,
    },
    { silent: true }
  );

describe('Submission finalization', () => {
  let match;
  let participant;
  const statusRank = {
    [SubmissionStatus.WRONG]: 0,
    [SubmissionStatus.IMPROVABLE]: 1,
    [SubmissionStatus.PROBABLY_CORRECT]: 2,
  };
  const statusCases = [
    SubmissionStatus.WRONG,
    SubmissionStatus.IMPROVABLE,
    SubmissionStatus.PROBABLY_CORRECT,
  ];

  beforeEach(async () => {
    const fixture = await createFixture();
    match = fixture.match;
    participant = fixture.participant;
  });

  afterEach(async () => {
    await Submission.destroy({ where: {} });
    await Match.destroy({ where: {} });
    await ChallengeParticipant.destroy({ where: {} });
    await ChallengeMatchSetting.destroy({ where: {} });
    await Challenge.destroy({ where: {} });
    await MatchSetting.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  statusCases.forEach((manualStatus) => {
    statusCases.forEach((autoStatus) => {
      const expectAutomatic = statusRank[autoStatus] > statusRank[manualStatus];
      const expectedWinner = expectAutomatic ? 'automatic' : 'manual';

      it(`selects ${expectedWinner} for manual ${manualStatus} vs auto ${autoStatus}`, async () => {
        const older = new Date('2026-01-01T10:00:00Z');
        const newer = new Date('2026-01-01T10:01:00Z');

        const manual = await createSubmission({
          match,
          participant,
          status: manualStatus,
          isAutomaticSubmission: false,
          updatedAt: older,
        });
        const automatic = await createSubmission({
          match,
          participant,
          status: autoStatus,
          isAutomaticSubmission: true,
          updatedAt: newer,
        });

        const winner = await computeFinalSubmissionForMatch({
          matchId: match.id,
        });

        const expectedId = expectAutomatic ? automatic.id : manual.id;
        expect(winner.id).toBe(expectedId);
        expect((await Submission.findByPk(expectedId)).isFinal).toBe(true);
        expect(
          (
            await Submission.findByPk(
              expectAutomatic ? manual.id : automatic.id
            )
          ).isFinal
        ).toBe(false);
      });
    });
  });

  it('selects the latest automatic submission when no manual exists', async () => {
    const older = new Date('2026-01-01T10:00:00Z');
    const newer = new Date('2026-01-01T10:02:00Z');

    const first = await createSubmission({
      match,
      participant,
      status: SubmissionStatus.WRONG,
      isAutomaticSubmission: true,
      updatedAt: older,
    });
    const second = await createSubmission({
      match,
      participant,
      status: SubmissionStatus.IMPROVABLE,
      isAutomaticSubmission: true,
      updatedAt: newer,
    });

    const winner = await computeFinalSubmissionForMatch({ matchId: match.id });

    expect(winner.id).toBe(second.id);
    expect((await Submission.findByPk(second.id)).isFinal).toBe(true);
    expect((await Submission.findByPk(first.id)).isFinal).toBe(false);
  });
});
