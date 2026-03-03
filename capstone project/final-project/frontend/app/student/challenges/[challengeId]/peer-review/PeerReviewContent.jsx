'use client';

import { Button } from '#components/common/Button';
import Timer from '#components/common/Timer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#components/common/card';
import PeerReviewSummaryDialog from '#components/peerReview/PeerReviewSummaryDialog';
import ExitConfirmationModal from './ExitConfirmationModal';
import PeerReviewAssessment from './PeerReviewAssessment';
import PeerReviewSidebar from './PeerReviewSidebar';

export default function PeerReviewContent({
  assignments,
  challengeId,
  challengeInfo,
  completedCount,
  currentVote,
  error,
  exitDialogOpen,
  finalSummary,
  formatCodeWithNewlines,
  handleCloseSummaryDialog,
  handleContinue,
  handleExit,
  handleIncorrectDetailsChange,
  handleNext,
  handlePrev,
  handleVoteChange,
  hasExplicitVote,
  hasExited,
  isExiting,
  isFirst,
  isLast,
  isVotingDisabled,
  loading,
  MonacoEditor,
  monacoTheme,
  onEditorMount,
  progressValue,
  selectedAssignment,
  selectedIndex,
  selectedSubmissionId,
  setExitDialogOpen,
  setSelectedIndex,
  showSummaryDialog,
  showSummaryToast,
  timeLeft,
  validationErrors,
  voteMap,
}) {
  return (
    <div className='max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-8'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
            Peer review
          </p>
          <h1 className='text-3xl font-bold text-foreground'>
            Review solutions and submit your assessment
          </h1>
        </div>
        <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary'>
          <span className='h-2 w-2 rounded-full bg-primary' />
          <Timer
            duration={challengeInfo?.durationPeerReview}
            challengeId={`${challengeId}-peer-review`}
            startTime={challengeInfo?.startPhaseTwoDateTime}
            label='Time left'
          />
        </div>
      </div>

      {error && (
        <Card className='mt-4 border border-destructive/30 bg-destructive/5 text-destructive'>
          <CardContent className='py-4'>
            <p className='text-sm'>{error}</p>
          </CardContent>
        </Card>
      )}

      <div className='mt-6 grid gap-6 lg:grid-cols-[280px_1fr]'>
        <PeerReviewSidebar
          assignments={assignments}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          voteMap={voteMap}
          completedCount={completedCount}
          progressValue={progressValue}
          loading={loading}
          timeLeft={timeLeft}
          hasExited={hasExited}
          isExiting={isExiting}
          onShowSummary={showSummaryToast}
          onOpenExitDialog={() => setExitDialogOpen(true)}
        />

        <section className='space-y-4 min-w-0'>
          <Card>
            <CardHeader className='bg-primary text-primary-foreground rounded-t-xl'>
              <CardTitle className='text-lg font-semibold'>
                {selectedAssignment
                  ? `Solution ${selectedIndex + 1}`
                  : 'Solution'}
              </CardTitle>
              <CardDescription className='text-primary-foreground/80'>
                Review this solution and cast your vote
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4 min-w-0'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                  Submitted Code
                </p>
                <div className='mt-2 min-h-[320px] w-full max-w-full overflow-hidden rounded-lg border border-border bg-muted'>
                  <MonacoEditor
                    height='320px'
                    width='100%'
                    language='cpp'
                    theme={monacoTheme}
                    value={
                      formatCodeWithNewlines(selectedAssignment?.code) ||
                      '// No code available.'
                    }
                    onMount={(editor, monaco) => {
                      if (onEditorMount) {
                        onEditorMount(editor, monaco);
                      }
                      monaco.editor.setTheme(monacoTheme);
                      setTimeout(() => {
                        try {
                          editor
                            .getAction('editor.action.formatDocument')
                            ?.run();
                        } catch (err) {
                          /* empty */
                        }
                      }, 100);
                    }}
                    loading={
                      <div className='flex h-full items-center justify-center bg-muted text-muted-foreground'>
                        Loading editor...
                      </div>
                    }
                    options={{
                      readOnly: true,
                      automaticLayout: true,
                      fontSize: 14,
                      wordWrap: 'off',
                      minimap: { enabled: false },
                      scrollbar: { alwaysConsumeMouseWheel: false },
                      padding: { top: 12, bottom: 12 },
                      lineNumbers: 'on',
                      renderLineHighlight: 'all',
                    }}
                  />
                </div>
              </div>

              <PeerReviewAssessment
                currentVote={currentVote}
                hasExplicitVote={hasExplicitVote}
                isVotingDisabled={isVotingDisabled}
                onVoteChange={handleVoteChange}
                validationErrors={validationErrors}
                selectedSubmissionId={selectedSubmissionId}
                voteMap={voteMap}
                onIncorrectDetailsChange={handleIncorrectDetailsChange}
              />

              <div className='flex items-center justify-between text-xs text-muted-foreground'>
                <Button
                  type='button'
                  variant='primary'
                  onClick={handlePrev}
                  disabled={isFirst}
                >
                  Previous
                </Button>
                <span>
                  {assignments.length
                    ? `Solution ${selectedIndex + 1} of ${assignments.length}`
                    : 'No solutions assigned'}
                </span>
                <Button
                  type='button'
                  variant='primary'
                  onClick={handleNext}
                  disabled={isLast}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
      <PeerReviewSummaryDialog
        open={showSummaryDialog}
        summary={finalSummary}
        onClose={handleCloseSummaryDialog}
      />
      <ExitConfirmationModal
        open={exitDialogOpen}
        assignments={assignments}
        voteMap={voteMap}
        onContinue={handleContinue}
        onExit={handleExit}
      />
    </div>
  );
}
