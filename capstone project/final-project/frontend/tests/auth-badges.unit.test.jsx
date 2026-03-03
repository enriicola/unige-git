import { describe, expect, it } from 'vitest';
import { authReducer, markBadgeSeen } from '#js/store/slices/auth';

describe('auth badge milestone tracking (unit)', () => {
  it('stores seen milestone badges per student without overwriting previous entries', () => {
    const initialState = authReducer(undefined, { type: '@@INIT' });

    const afterFirstBadge = authReducer(
      initialState,
      markBadgeSeen({ studentId: 7, badgeId: 301 })
    );
    const afterSecondBadge = authReducer(
      afterFirstBadge,
      markBadgeSeen({ studentId: 7, badgeId: 305 })
    );
    const afterAnotherStudent = authReducer(
      afterSecondBadge,
      markBadgeSeen({ studentId: 8, badgeId: 301 })
    );

    expect(afterAnotherStudent.badgeSeen).toEqual({
      7: {
        301: true,
        305: true,
      },
      8: {
        301: true,
      },
    });
  });

  it('keeps the same badge idempotent when marked more than once', () => {
    const initialState = authReducer(undefined, { type: '@@INIT' });

    const markedOnce = authReducer(
      initialState,
      markBadgeSeen({ studentId: 9, badgeId: 500 })
    );
    const markedTwice = authReducer(
      markedOnce,
      markBadgeSeen({ studentId: 9, badgeId: 500 })
    );

    expect(markedTwice.badgeSeen[9][500]).toBe(true);
    expect(Object.keys(markedTwice.badgeSeen[9])).toHaveLength(1);
  });
});
