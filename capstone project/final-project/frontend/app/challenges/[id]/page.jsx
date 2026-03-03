'use client';

import Link from 'next/link';
import { Button } from '#components/common/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#components/common/card';
import AlertDialog from '#components/common/AlertDialog';
import { ChallengeStatus } from '#js/constants';
import PeerReviewVoteResultCard from '#components/challenge/PeerReviewVoteResultCard';
import { formatDateTime } from '#js/date';
import TestResultsSection from './(components)/TestResultsSection';
import useChallengeDetailPage from './useChallengeDetailPage';
import {
  buildStudentName,
  formatTimer,
  getEarnedCreditFromVote,
  getExpectedEvaluationFromSubmissionStatus,
  normalizeMultilineValue,
} from './challengeDetailUtils';

const peerReviewTones = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-700',
  error: 'border-destructive/30 bg-destructive/5 text-destructive',
};

export default function ChallengeDetailPage() {
  const {
    isTeacher,
    challenge,
    assignments,
    joinedStudents,
    showParticipantList,
    error,
    loading,
    assigning,
    assigningReviews,
    starting,
    startingPeerReview,
    statusBadge,
    detailItems,
    showStartButton,
    showAssignReviewsButton,
    showStartPeerReviewButton,
    showPeerReviewInProgress,
    phaseStatus,
    phaseOneCardClass,
    phaseTwoCardClass,
    phaseOneStart,
    phaseOneEndDisplay,
    phaseOneCountdownSeconds,
    phaseOneTimeLeft,
    isPhaseOneActive,
    phaseTwoStart,
    phaseTwoEndDisplay,
    phaseTwoCountdownSeconds,
    phaseTwoTimeLeft,
    isPhaseTwoActive,
    showPhaseTwoSubmissionCount,
    totalMatches,
    finalSubmissionCount,
    pendingFinalCount,
    hasPendingFinalizations,
    peerReviewMessages,
    showDangerZone,
    showEndCodingPhaseButton,
    showEndPeerReviewButton,
    showEndChallengeButton,
    setDangerAction,
    dangerPending,
    activeDangerAction,
    handleConfirmDangerAction,
    handleCancelDangerAction,
    editDialogOpen,
    editPending,
    editDisabled,
    editTitle,
    handleEditClick,
    handleConfirmUnpublish,
    handleEditCancel,
    load,
    handleAssign,
    handleStart,
    handleAssignReviews,
    handleStartPeerReview,
    canShowTeacherResults,
    teacherResultsOpen,
    teacherResultsLoading,
    teacherResultsError,
    teacherMatchSettings,
    privateTestActions,
    handleAddPrivateTest,
    handleToggleTeacherResults,
  } = useChallengeDetailPage();

  return (
    <div className='max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6'>
      <div className='space-y-3'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div className='space-y-2'>
            <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
              Challenge overview
            </p>
            <div className='flex flex-wrap items-center gap-3'>
              <h1 className='text-3xl font-bold text-foreground'>
                {challenge?.title || 'Challenge'}
              </h1>
              {statusBadge}
            </div>
          </div>
          <div className='flex flex-wrap items-center gap-2 sm:justify-end'>
            <Button variant='outline' asChild>
              <Link href='/challenges' title='Back to challenges list'>
                Back
              </Link>
            </Button>
            <Button
              variant='outline'
              onClick={load}
              disabled={loading}
              title='Refresh challenge details'
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
            {isTeacher ? (
              <Button
                variant='outline'
                onClick={handleEditClick}
                disabled={editDisabled}
                title={editTitle}
              >
                {editPending ? 'Unpublishing...' : 'Edit'}
              </Button>
            ) : null}
            {challenge?.status === ChallengeStatus.PUBLIC ? (
              <Button
                onClick={handleAssign}
                disabled={assigning || loading}
                title='Assign students to this challenge'
              >
                {assigning ? 'Assigning...' : 'Assign students'}
              </Button>
            ) : null}
            {showStartButton ? (
              <Button
                onClick={handleStart}
                disabled={starting || loading}
                title='Start the challenge for assigned students'
              >
                {starting ? 'Starting...' : 'Start'}
              </Button>
            ) : null}
            {showAssignReviewsButton ? (
              <Button
                onClick={handleAssignReviews}
                disabled={assigningReviews || loading}
                title='Assign peer reviews for this challenge'
              >
                {assigningReviews ? 'Assigning...' : 'Assign'}
              </Button>
            ) : null}
            {showStartPeerReviewButton ? (
              <Button
                onClick={handleStartPeerReview}
                disabled={startingPeerReview || loading}
                title='Start the peer review phase'
              >
                {startingPeerReview ? 'Starting...' : 'Start Peer Review'}
              </Button>
            ) : null}
            {showPeerReviewInProgress ? (
              <div className='flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700'>
                <span className='h-2 w-2 rounded-full bg-indigo-500' />
                Peer review is in progress. Time left:{' '}
                {formatTimer(phaseTwoTimeLeft)}
              </div>
            ) : null}
          </div>
        </div>
        <dl className='flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center'>
          {detailItems.map((item) => (
            <div
              key={item.label}
              className='w-full rounded-lg border border-border/60 bg-muted/60 px-3 py-2 sm:min-w-42.5 sm:w-auto'
            >
              <dt className='text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground'>
                {item.label}
              </dt>
              <dd className='text-sm font-semibold text-foreground'>
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className='grid gap-4 lg:grid-cols-2'>
        <Card className={`border ${phaseOneCardClass}`}>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg font-semibold text-foreground'>
              Coding phase
            </CardTitle>
            <CardDescription className='text-sm text-muted-foreground'>
              Write and validate solutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-2 text-sm text-foreground'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <span className='font-semibold text-muted-foreground'>
                  Start
                </span>
                <span>{formatDateTime(phaseOneStart)}</span>
              </div>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <span className='font-semibold text-muted-foreground'>End</span>
                <span>{formatDateTime(phaseOneEndDisplay)}</span>
              </div>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <span className='font-semibold text-muted-foreground'>
                  Duration
                </span>
                <span>
                  {challenge?.duration ? `${challenge.duration} min` : '—'}
                </span>
              </div>
              {isPhaseOneActive ? (
                <div className='space-y-1 mt-3'>
                  <div className='flex items-center gap-2'>
                    <span className='h-2 w-2 rounded-full bg-emerald-500' />
                    <span className='text-sm font-semibold text-emerald-700'>
                      Challenge in progress
                    </span>
                  </div>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='text-sm text-muted-foreground'>
                      {phaseOneCountdownSeconds > 0
                        ? 'Starting soon'
                        : 'Ongoing'}
                    </span>
                    <span className='font-mono text-emerald-700'>
                      {phaseOneCountdownSeconds > 0
                        ? `Starting in ${phaseOneCountdownSeconds}s`
                        : `Time left ${formatTimer(phaseOneTimeLeft)}`}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className={`border ${phaseTwoCardClass}`}>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg font-semibold text-foreground'>
              Peer review
            </CardTitle>
            <CardDescription className='text-sm text-muted-foreground'>
              Review classmates&apos; submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-2 text-sm text-foreground'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <span className='font-semibold text-muted-foreground'>
                  Start
                </span>
                <span>{formatDateTime(phaseTwoStart)}</span>
              </div>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <span className='font-semibold text-muted-foreground'>End</span>
                <span>{formatDateTime(phaseTwoEndDisplay)}</span>
              </div>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <span className='font-semibold text-muted-foreground'>
                  Duration
                </span>
                <span>
                  {challenge?.durationPeerReview
                    ? `${challenge.durationPeerReview} min`
                    : '—'}
                </span>
              </div>
              {showPhaseTwoSubmissionCount ? (
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <span className='font-semibold text-muted-foreground'>
                    Submissions for peer review
                  </span>
                  <span>{challenge?.validSubmissionsCount ?? 0}</span>
                </div>
              ) : null}
              {showPhaseTwoSubmissionCount ? (
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <span className='font-semibold text-muted-foreground'>
                    Number of submissions
                  </span>
                  <span>{challenge?.totalSubmissionsCount ?? 0}</span>
                </div>
              ) : null}
              {typeof finalSubmissionCount === 'number' &&
              typeof totalMatches === 'number' ? (
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <span className='font-semibold text-muted-foreground'>
                    Finalized submissions
                  </span>
                  <span>
                    {finalSubmissionCount} / {totalMatches}
                  </span>
                </div>
              ) : null}
              {typeof pendingFinalCount === 'number' &&
              pendingFinalCount > 0 ? (
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <span className='font-semibold text-muted-foreground'>
                    Pending finalizations
                  </span>
                  <span>{pendingFinalCount}</span>
                </div>
              ) : null}
              {hasPendingFinalizations &&
              phaseStatus === ChallengeStatus.ENDED_PHASE_ONE ? (
                <p className='text-sm text-amber-700'>
                  Finalizing submissions. You can assign peer reviews once all
                  submissions are ready.
                </p>
              ) : null}
              {isPhaseTwoActive ? (
                <div className='space-y-1 mt-3'>
                  <div className='flex items-center gap-2'>
                    <span className='h-2 w-2 rounded-full bg-indigo-500' />
                    <span className='text-sm font-semibold text-indigo-700'>
                      Challenge in progress
                    </span>
                  </div>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='text-sm text-muted-foreground'>
                      {phaseTwoCountdownSeconds > 0
                        ? 'Starting soon'
                        : 'Ongoing'}
                    </span>
                    <span className='font-mono text-indigo-700'>
                      {phaseTwoCountdownSeconds > 0
                        ? `Starting in ${phaseTwoCountdownSeconds}s`
                        : `Time left ${formatTimer(phaseTwoTimeLeft)}`}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Card className='border border-destructive/30 bg-destructive/5 text-destructive'>
          <CardContent className='py-4'>
            <p className='text-sm'>{error}</p>
          </CardContent>
        </Card>
      )}

      {showStartPeerReviewButton ? (
        <Card className='border border-emerald-500/30 bg-emerald-500/10 text-emerald-700'>
          <CardContent className='py-4'>
            <p className='text-sm font-medium'>
              Peer review assignments are ready. You can start the peer review
              phase when you are ready.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {peerReviewMessages.length > 0 && (
        <div className='space-y-2'>
          {peerReviewMessages.map((message) => (
            <Card
              key={`${message.tone}-${message.text}`}
              className={`border ${peerReviewTones[message.tone] || peerReviewTones.error}`}
            >
              <CardContent className='py-3'>
                <p className='text-sm font-medium'>{message.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showDangerZone ? (
        <Card className='border border-destructive/40 bg-destructive/5'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base font-semibold text-destructive'>
              Danger zone
            </CardTitle>
            <CardDescription className='text-sm text-destructive/80'>
              These actions end phases early and cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex flex-wrap gap-2'>
            {showEndCodingPhaseButton ? (
              <Button
                type='button'
                variant='destructive'
                onClick={() => setDangerAction('endCoding')}
                disabled={loading || dangerPending}
              >
                End coding phase
              </Button>
            ) : null}
            {showEndPeerReviewButton ? (
              <Button
                type='button'
                variant='destructive'
                onClick={() => setDangerAction('endPeerReview')}
                disabled={loading || dangerPending}
              >
                End peer review
              </Button>
            ) : null}
            {showEndChallengeButton ? (
              <Button
                type='button'
                variant='destructive'
                onClick={() => setDangerAction('endChallenge')}
                disabled={loading || dangerPending}
              >
                End challenge
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {!assignments.length && !error ? (
        <Card className='border border-dashed border-border bg-card text-card-foreground shadow-sm'>
          <CardContent className='py-6'>
            <p className='text-muted-foreground text-sm'>
              No matches have been assigned yet for this challenge.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {showParticipantList ? (
        <Card className='border border-border bg-card text-card-foreground shadow-sm'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base font-semibold text-foreground'>
              Joined students
            </CardTitle>
            <CardDescription className='text-xs text-muted-foreground'>
              {joinedStudents.length} joined
            </CardDescription>
          </CardHeader>
          <CardContent>
            {joinedStudents.length === 0 ? (
              <p className='text-sm text-muted-foreground'>
                No students have joined yet.
              </p>
            ) : (
              <ul className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
                {joinedStudents.map((student) => (
                  <li
                    key={student.id}
                    className='rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-sm font-medium text-foreground'
                  >
                    {student.name}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      ) : null}

      <div className='space-y-4'>
        {assignments.map((group) => (
          <Card
            key={group.challengeMatchSettingId}
            className='border border-border bg-card text-card-foreground shadow-sm'
          >
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg font-semibold text-foreground'>
                {group.matchSetting?.problemTitle || 'Match setting'}
              </CardTitle>
              <CardDescription className='text-sm text-muted-foreground space-y-1'>
                <span className='block'>
                  Match setting ID:{' '}
                  {group.matchSetting?.id ?? group.challengeMatchSettingId}
                </span>
                <span className='block'>
                  Valid submissions: {group.validSubmissionsCount ?? 0}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='overflow-auto rounded-lg border border-border'>
                <table className='min-w-full table-auto text-sm'>
                  <thead className='bg-muted'>
                    <tr className='text-left text-muted-foreground'>
                      <th className='px-4 py-3 font-semibold'>Match ID</th>
                      <th className='px-4 py-3 font-semibold'>Student</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.matches.map((match) => (
                      <tr key={match.id} className='border-t border-border/60'>
                        <td className='px-4 py-3 font-medium text-foreground'>
                          {match.id}
                        </td>
                        <td className='px-4 py-3 text-foreground'>
                          {match.student?.username || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {group.peerReviewAssignments?.length ? (
                <details className='mt-4 rounded-lg border border-border/60 bg-muted/40 p-3'>
                  <summary className='cursor-pointer text-sm font-semibold text-foreground'>
                    Peer review assignments
                  </summary>
                  <div className='mt-3 space-y-3'>
                    {group.peerReviewAssignments.map((assignment) => {
                      const revieweeNames = assignment.reviewees
                        .map((reviewee) => reviewee.username)
                        .join(', ');
                      return (
                        <div
                          key={assignment.reviewer.participantId}
                          className='text-sm'
                        >
                          <p className='font-semibold text-foreground'>
                            {assignment.reviewer.username}
                          </p>
                          <p className='text-muted-foreground wrap-break-word'>
                            Reviews: {revieweeNames || '—'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </details>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      {canShowTeacherResults ? (
        <Card className='border border-border bg-card text-card-foreground shadow-sm'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg font-semibold text-foreground'>
              Student results
            </CardTitle>
            <CardDescription className='text-sm text-muted-foreground'>
              Review submissions and peer review outcomes by match setting.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              type='button'
              variant='outline'
              onClick={handleToggleTeacherResults}
              aria-expanded={teacherResultsOpen}
            >
              {teacherResultsOpen
                ? 'Hide student results'
                : 'View student results'}
            </Button>

            {teacherResultsOpen ? (
              <div className='mt-4 space-y-4'>
                {teacherResultsLoading ? (
                  <p className='text-sm text-muted-foreground'>
                    Loading student results...
                  </p>
                ) : null}
                {teacherResultsError ? (
                  <p className='text-sm text-destructive'>
                    {teacherResultsError}
                  </p>
                ) : null}
                {!teacherResultsLoading &&
                !teacherResultsError &&
                teacherMatchSettings.length === 0 ? (
                  <p className='text-sm text-muted-foreground'>
                    No student results available yet.
                  </p>
                ) : null}
                {!teacherResultsLoading &&
                !teacherResultsError &&
                teacherMatchSettings.length > 0 ? (
                  <div className='space-y-3'>
                    {teacherMatchSettings.map((group) => {
                      const reviewerVotesByStudentId = new Map();
                      const reviewedMatches = Array.isArray(group.matches)
                        ? group.matches
                        : [];

                      reviewedMatches.forEach((reviewedMatch) => {
                        const reviewedStudentName = buildStudentName(
                          reviewedMatch.student,
                          reviewedMatch.student?.id ?? reviewedMatch.id
                        );
                        const expectedEvaluation =
                          getExpectedEvaluationFromSubmissionStatus(
                            reviewedMatch.submission?.status
                          );
                        const assignmentsList = Array.isArray(
                          reviewedMatch.peerReviewAssignments
                        )
                          ? reviewedMatch.peerReviewAssignments
                          : [];

                        assignmentsList.forEach((assignment) => {
                          const reviewerId = assignment.reviewer?.id;
                          if (!reviewerId) return;

                          if (!reviewerVotesByStudentId.has(reviewerId)) {
                            reviewerVotesByStudentId.set(reviewerId, []);
                          }

                          const voteRecord = assignment.vote || null;
                          reviewerVotesByStudentId.get(reviewerId).push({
                            id: assignment.id,
                            assignmentId: assignment.id,
                            title: `Vote for ${reviewedStudentName}`,
                            vote: voteRecord?.vote || 'abstain',
                            expectedEvaluation,
                            isCorrect: getEarnedCreditFromVote(
                              voteRecord,
                              reviewedMatch.submission?.status
                            ),
                            testCaseInput: voteRecord?.testCaseInput || null,
                            expectedOutput: voteRecord?.expectedOutput || null,
                            referenceOutput:
                              voteRecord?.referenceOutput || null,
                            actualOutput: voteRecord?.actualOutput || null,
                            isExpectedOutputCorrect:
                              voteRecord?.isExpectedOutputCorrect,
                            isVoteCorrect: voteRecord?.isVoteCorrect,
                            evaluationStatus: voteRecord?.evaluationStatus,
                            matchSettingId: group.matchSetting?.id,
                          });
                        });
                      });

                      reviewerVotesByStudentId.forEach((votes) => {
                        votes.sort((leftVote, rightVote) => {
                          if (leftVote.id === rightVote.id) return 0;
                          return leftVote.id > rightVote.id ? 1 : -1;
                        });
                      });

                      return (
                        <details
                          key={group.challengeMatchSettingId}
                          className='rounded-xl border border-border/60 bg-muted/30 p-3'
                        >
                          <summary className='cursor-pointer text-sm font-semibold text-foreground'>
                            {group.matchSetting?.problemTitle ||
                              'Match setting results'}
                          </summary>
                          <div className='mt-3 space-y-3'>
                            {group.matches?.map((match) => {
                              const studentName = buildStudentName(
                                match.student,
                                match.student?.id ?? match.id
                              );
                              const { submission } = match;
                              const studentVotes =
                                reviewerVotesByStudentId.get(
                                  match.student?.id
                                ) || [];
                              return (
                                <details
                                  key={match.id}
                                  className='rounded-lg border border-border/60 bg-background/80 p-3'
                                >
                                  <summary className='cursor-pointer text-sm font-semibold text-foreground'>
                                    {studentName}
                                  </summary>
                                  <div className='mt-3 space-y-3'>
                                    <details className='rounded-lg border border-border/60 bg-muted/40 p-3'>
                                      <summary className='cursor-pointer text-sm font-semibold text-foreground'>
                                        Coding phase
                                      </summary>
                                      <div className='mt-3 space-y-3'>
                                        {!submission ? (
                                          <p className='text-sm text-muted-foreground'>
                                            No submission was recorded for this
                                            student.
                                          </p>
                                        ) : (
                                          <>
                                            <div className='flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground'>
                                              <span>
                                                Status:{' '}
                                                {submission.status || '—'}
                                              </span>
                                              <span>
                                                Submitted:{' '}
                                                {submission.updatedAt
                                                  ? formatDateTime(
                                                      submission.updatedAt
                                                    )
                                                  : '—'}
                                              </span>
                                            </div>
                                            <pre className='w-full overflow-auto rounded-lg border border-slate-900/80 bg-slate-900 p-3 text-xs text-slate-100 shadow-inner whitespace-pre-wrap dark:border-slate-700 dark:bg-slate-950'>
                                              {normalizeMultilineValue(
                                                submission.code || ''
                                              )}
                                            </pre>
                                            <div className='grid gap-3 lg:grid-cols-2'>
                                              <TestResultsSection
                                                title='Public tests'
                                                results={
                                                  submission.publicTestResults
                                                }
                                                emptyMessage='No public test results.'
                                              />
                                              <TestResultsSection
                                                title='Private tests'
                                                results={
                                                  submission.privateTestResults
                                                }
                                                emptyMessage='No private test results.'
                                              />
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </details>

                                    <details className='rounded-lg border border-border/60 bg-muted/40 p-3'>
                                      <summary className='cursor-pointer text-sm font-semibold text-foreground'>
                                        Peer review
                                      </summary>
                                      <div className='mt-3 space-y-3'>
                                        {studentVotes.length === 0 ? (
                                          <p className='text-sm text-muted-foreground'>
                                            No peer review votes were recorded
                                            for this student.
                                          </p>
                                        ) : (
                                          studentVotes.map((voteItem) => {
                                            const actionKey = `assignment-${voteItem.assignmentId}`;
                                            const hasTestCase =
                                              Boolean(voteItem.testCaseInput) &&
                                              Boolean(voteItem.expectedOutput);
                                            const showAddButton =
                                              voteItem.vote === 'incorrect' &&
                                              hasTestCase &&
                                              voteItem.matchSettingId;
                                            const expectedOutputStatus =
                                              voteItem.isExpectedOutputCorrect;
                                            let addButtonMessage = '';
                                            if (
                                              showAddButton &&
                                              expectedOutputStatus === false
                                            ) {
                                              addButtonMessage =
                                                'Expected output does not match the reference solution.';
                                            } else if (
                                              showAddButton &&
                                              expectedOutputStatus == null
                                            ) {
                                              addButtonMessage =
                                                'Expected output has not been validated yet.';
                                            }
                                            const canAddTest =
                                              showAddButton &&
                                              expectedOutputStatus === true;
                                            const actionState =
                                              privateTestActions[actionKey];
                                            const voteActions =
                                              showAddButton ? (
                                                <div className='space-y-1'>
                                                  <Button
                                                    type='button'
                                                    variant='outline'
                                                    size='sm'
                                                    onClick={() =>
                                                      handleAddPrivateTest({
                                                        matchSettingId:
                                                          voteItem.matchSettingId,
                                                        assignmentId:
                                                          voteItem.assignmentId,
                                                        testCaseInput:
                                                          voteItem.testCaseInput,
                                                        expectedOutput:
                                                          voteItem.expectedOutput,
                                                      })
                                                    }
                                                    disabled={
                                                      actionState?.status ===
                                                        'saving' ||
                                                      actionState?.status ===
                                                        'saved' ||
                                                      !canAddTest
                                                    }
                                                  >
                                                    {actionState?.status ===
                                                    'saving'
                                                      ? 'Adding...'
                                                      : 'Add to private tests'}
                                                  </Button>
                                                  {addButtonMessage ? (
                                                    <p className='text-[0.7rem] text-muted-foreground'>
                                                      {addButtonMessage}
                                                    </p>
                                                  ) : null}
                                                  {actionState?.message ? (
                                                    <p
                                                      className={`text-[0.7rem] ${
                                                        actionState.status ===
                                                        'error'
                                                          ? 'text-rose-700 dark:text-rose-200'
                                                          : 'text-emerald-700 dark:text-emerald-200'
                                                      }`}
                                                    >
                                                      {actionState.message}
                                                    </p>
                                                  ) : null}
                                                </div>
                                              ) : null;

                                            return (
                                              <PeerReviewVoteResultCard
                                                key={voteItem.id}
                                                title={voteItem.title}
                                                vote={voteItem.vote}
                                                expectedEvaluation={
                                                  voteItem.expectedEvaluation
                                                }
                                                isCorrect={voteItem.isCorrect}
                                                testCaseInput={
                                                  voteItem.testCaseInput
                                                }
                                                expectedOutput={
                                                  voteItem.expectedOutput
                                                }
                                                referenceOutput={
                                                  voteItem.referenceOutput
                                                }
                                                actualOutput={
                                                  voteItem.actualOutput
                                                }
                                                isExpectedOutputCorrect={
                                                  voteItem.isExpectedOutputCorrect
                                                }
                                                isVoteCorrect={
                                                  voteItem.isVoteCorrect
                                                }
                                                evaluationStatus={
                                                  voteItem.evaluationStatus
                                                }
                                                voteLabelText='Student vote'
                                                actions={voteActions}
                                              />
                                            );
                                          })
                                        )}
                                      </div>
                                    </details>
                                  </div>
                                </details>
                              );
                            })}
                          </div>
                        </details>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <AlertDialog
        open={editDialogOpen}
        title='Unpublish to edit'
        description='This challenge will be set to private so you can edit it. Continue?'
        confirmLabel='Unpublish & edit'
        cancelLabel='Cancel'
        confirmVariant='primary'
        cancelVariant='outline'
        confirmDisabled={editPending}
        cancelDisabled={editPending}
        onConfirm={handleConfirmUnpublish}
        onCancel={handleEditCancel}
      />
      <AlertDialog
        open={Boolean(activeDangerAction)}
        title={activeDangerAction?.title}
        description={activeDangerAction?.description}
        confirmLabel={
          dangerPending
            ? activeDangerAction?.pendingLabel
            : activeDangerAction?.confirmLabel
        }
        cancelLabel='Cancel'
        confirmVariant='destructive'
        cancelVariant='outline'
        confirmDisabled={dangerPending}
        cancelDisabled={dangerPending}
        onConfirm={handleConfirmDangerAction}
        onCancel={handleCancelDangerAction}
      />
    </div>
  );
}
