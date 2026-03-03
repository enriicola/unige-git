'use client';

import { Button } from '#components/common/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#components/common/card';

export default function PeerReviewSidebar({
  assignments,
  selectedIndex,
  onSelect,
  voteMap,
  completedCount,
  progressValue,
  loading,
  timeLeft,
  hasExited,
  isExiting,
  onShowSummary,
  onOpenExitDialog,
}) {
  const totalAssignments = assignments.length;

  return (
    <aside className='space-y-4'>
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-sm font-semibold'>
            Overall Progress
          </CardTitle>
          <CardDescription className='text-xs text-muted-foreground'>
            {completedCount}/{totalAssignments}
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='h-2 w-full rounded-full bg-muted'>
            <div
              className='h-2 rounded-full bg-primary transition-all'
              style={{ width: `${progressValue}%` }}
            />
          </div>
          <p className='text-xs text-muted-foreground'>
            {progressValue}% completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-sm font-semibold'>
            Solutions to Review
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          {loading && (
            <p className='text-xs text-muted-foreground'>Loading...</p>
          )}
          {!loading && totalAssignments === 0 && (
            <p className='text-xs text-muted-foreground'>
              No assignments available yet.
            </p>
          )}
          {assignments.map((assignment, index) => {
            const isSelected = index === selectedIndex;
            const voteEntry = voteMap[assignment.submissionId];
            const status = voteEntry?.type ? 'Reviewed' : 'Not voted yet';
            const buttonClassName = isSelected
              ? 'border-primary/30 bg-primary/10'
              : 'border-border bg-card';
            return (
              <button
                key={assignment.id}
                type='button'
                onClick={() => onSelect(index)}
                className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${buttonClassName}`}
              >
                <div className='flex items-center gap-2 font-semibold'>
                  <span className='flex h-7 w-7 items-center justify-center rounded-full border border-border bg-muted text-xs'>
                    {index + 1}
                  </span>
                  Solution {index + 1}
                </div>
                <p className='mt-1 text-xs text-muted-foreground'>{status}</p>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <div className='space-y-2'>
        <Button className='w-full' variant='primary' onClick={onShowSummary}>
          Summary
        </Button>
        {timeLeft > 0 && !hasExited && !isExiting && (
          <Button
            className='w-full'
            variant='outline'
            onClick={onOpenExitDialog}
            disabled={hasExited || isExiting}
          >
            Exit
          </Button>
        )}
      </div>
    </aside>
  );
}
