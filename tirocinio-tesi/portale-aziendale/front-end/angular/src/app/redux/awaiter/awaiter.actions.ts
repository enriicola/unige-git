import { createAction, props } from '@ngrx/store';
import { AwaiterItem } from './awaiter.state';

export const awaitItem = createAction(
  '[Awaiter] await item',
  props<{ item: AwaiterItem }>()
);
