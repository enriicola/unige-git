'use client';

export default function PeerReviewAssessment({
  currentVote,
  hasExplicitVote,
  isVotingDisabled,
  onVoteChange,
  validationErrors,
  selectedSubmissionId,
  voteMap,
  onIncorrectDetailsChange,
}) {
  const validationEntry = selectedSubmissionId
    ? validationErrors[selectedSubmissionId]
    : null;
  const voteEntry = selectedSubmissionId ? voteMap[selectedSubmissionId] : null;

  return (
    <div className='rounded-xl border border-border bg-muted/40 p-4 space-y-3'>
      <div>
        <p className='text-sm font-semibold text-foreground'>Your Assessment</p>
        <p className='text-xs text-muted-foreground'>
          Your selection is saved locally. You can change it anytime.
        </p>
      </div>

      {['correct', 'incorrect', 'abstain'].map((option) => {
        let label = 'Abstain';
        if (option === 'correct') label = 'Correct';
        if (option === 'incorrect') label = 'Incorrect';
        const isSelected = currentVote === option;
        const isDefaultAbstain = option === 'abstain' && !hasExplicitVote;
        return (
          <div key={option} className='space-y-2'>
            <label
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition cursor-pointer ${
                isSelected
                  ? 'border-primary/40 bg-primary/10 shadow-sm'
                  : 'border-border bg-card'
              }`}
            >
              <span>{label}</span>
              <input
                type='radio'
                name='assessment'
                value={option}
                checked={isSelected}
                onChange={() => onVoteChange(option)}
                onClick={
                  isDefaultAbstain ? () => onVoteChange('abstain') : undefined
                }
                disabled={isVotingDisabled}
                className='h-4 w-4 accent-primary cursor-pointer'
              />
            </label>
            {option === 'incorrect' && isSelected && (
              <div className='pl-4 pr-2 py-3 space-y-3 border-l-2 border-primary/20 ml-2 bg-muted/20 rounded-r-lg'>
                {validationEntry?.warning && (
                  <p className='text-xs text-amber-500 font-medium flex gap-2'>
                    ⚠️ <span>{validationEntry.warning}</span>
                  </p>
                )}
                {validationEntry?.error && (
                  <p className='text-xs text-destructive font-bold flex gap-2'>
                    ❌ <span>{validationEntry.error}</span>
                  </p>
                )}

                <div>
                  <label
                    htmlFor={`input-${selectedSubmissionId}`}
                    className='text-xs font-semibold text-muted-foreground'
                  >
                    Test Case Input (JSON Array)
                  </label>
                  <input
                    id={`input-${selectedSubmissionId}`}
                    type='text'
                    placeholder='e.g. [1, 2] or ["a", "b"]'
                    className='w-full mt-1 p-2 text-sm border rounded bg-background focus:ring-1 focus:ring-primary'
                    value={voteEntry?.input || ''}
                    onChange={(event) =>
                      onIncorrectDetailsChange('input', event.target.value)
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor={`output-${selectedSubmissionId}`}
                    className='text-xs font-semibold text-muted-foreground'
                  >
                    Expected Output (JSON Array)
                  </label>
                  <input
                    id={`output-${selectedSubmissionId}`}
                    type='text'
                    placeholder='e.g. [2, 1] or ["b", "a"]'
                    className='w-full mt-1 p-2 text-sm border rounded bg-background focus:ring-1 focus:ring-primary'
                    value={voteEntry?.output || ''}
                    onChange={(event) =>
                      onIncorrectDetailsChange('output', event.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
