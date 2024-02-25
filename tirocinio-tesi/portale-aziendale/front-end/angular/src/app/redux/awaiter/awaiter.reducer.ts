import { AwaiterState, initialAwaiterState } from './awaiter.state';
import { createReducer, on, Action } from '@ngrx/store';
import { awaitItem } from './awaiter.actions';

const _awaiterReducer = createReducer(
  initialAwaiterState,
  on(awaitItem, (state, a) => ({
    ...state,
    items: !state.items.some(i => i.message === a.item.message)
      ? [...state.items, { ...a.item }]
      : a.item.perc === 100
      ? state.items.filter(i => i.message !== a.item.message)
      : [
          ...state.items.filter(i => i.message !== a.item.message),
          {
            ...state.items.find(i => i.message === a.item.message),
            perc: a.item.perc
          }
        ]
  }))
);

export function awaiterReducer(
  state: AwaiterState | undefined,
  action: Action
): AwaiterState {
  return _awaiterReducer(state, action);
}
