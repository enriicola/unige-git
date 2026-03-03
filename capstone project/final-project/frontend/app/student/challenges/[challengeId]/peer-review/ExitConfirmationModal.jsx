'use client';

import { useMemo } from 'react';
import { Button } from '#components/common/Button';

export default function ExitConfirmationModal({
  open,
  assignments,
  voteMap,
  onContinue,
  onExit,
}) {
  // Calculate summary stats from local voteMap
  const { completedCount, correctCount, incorrectCount, abstainCount } =
    useMemo(() => {
      let completed = 0;
      let correct = 0;
      let incorrect = 0;
      let abstain = 0;

      assignments.forEach((assignment) => {
        const voteType = voteMap[assignment.submissionId]?.type;
        if (voteType) {
          completed += 1;
          if (voteType === 'correct') {
            correct += 1;
          } else if (voteType === 'incorrect') {
            incorrect += 1;
          } else if (voteType === 'abstain') {
            abstain += 1;
          }
        }
      });

      return {
        completedCount: completed,
        correctCount: correct,
        incorrectCount: incorrect,
        abstainCount: abstain,
      };
    }, [assignments, voteMap]);

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'>
      <div className='w-[360px] max-w-[92vw] rounded-2xl border border-border bg-background shadow-xl p-4'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <p className='text-sm font-semibold text-foreground'>
              Exit Peer Review?
            </p>
            <p className='text-xs text-muted-foreground mt-0.5'>
              You have reviewed {completedCount} of {assignments.length}{' '}
              solutions.
            </p>
          </div>
        </div>

        <div className='mt-4 rounded-xl border border-secondary bg-muted/40 p-3 text-sm'>
          <p className='font-semibold text-foreground mb-2'>
            Your votes so far
          </p>
          <div className='space-y-2'>
            <div className='flex items-center justify-between rounded-lg border border-border px-3 py-2'>
              <span>Correct</span>
              <span className='font-semibold'>{correctCount}</span>
            </div>
            <div className='flex items-center justify-between rounded-lg border border-border px-3 py-2'>
              <span>Incorrect</span>
              <span className='font-semibold'>{incorrectCount}</span>
            </div>
            <div className='flex items-center justify-between rounded-lg border border-border px-3 py-2'>
              <span>Abstain</span>
              <span className='font-semibold'>{abstainCount}</span>
            </div>
          </div>
        </div>

        <div className='mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end'>
          <Button
            type='button'
            variant='outline'
            onClick={onContinue}
            className='w-full sm:w-auto'
          >
            Continue Reviewing
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={onExit}
            className='w-full sm:w-auto'
          >
            Exit Anyway
          </Button>
        </div>
      </div>
    </div>
  );
}
