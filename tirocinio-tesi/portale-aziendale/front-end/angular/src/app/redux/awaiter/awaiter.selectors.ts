import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../state';
import { AwaiterState } from './awaiter.state';

export const selectAwaiterState = createFeatureSelector<AppState, AwaiterState>(
    'awaiter'
  );

export const selectAwaiter = createSelector(
  selectAwaiterState,
  (state: AwaiterState) => {
    return state;
  }
);

export const selectIsLoading = createSelector(
  selectAwaiterState,
  (state: AwaiterState) => state.items.length > 0
);

export const selectLoadingItems = createSelector(
  selectAwaiterState,
  (state: AwaiterState) => state.items
);
