import { Action, createAction, props } from '@ngrx/store';
import { AppMessage } from './message.state';

export interface ErrorPayload {
    error: string;
}

export interface SuccessMessage {
    successMessage?: string
}
export type SuccessPayload<T> = {
    [P in keyof T]?: T[P];
  } & SuccessMessage

export function isErrorAction(a: Action): a is Action & ErrorPayload {
    return a['error'] !== undefined &&
        typeof(a['error']) === 'string' &&
        a.type !== handleMessage.type &&
        a.type !== showMessage.type;
}

export function isSuccessActionToShow(a: Action): a is Action & SuccessMessage {
    return a['successMessage'] !== undefined &&
        a['successMessage'] !== null &&
        typeof(a['successMessage']) === 'string' &&
        a['successMessage'] !== '';
}

export const showMessage = createAction('[Messages] Show Message', props<{ message: AppMessage }>());
export const handleMessage = createAction('[Messages] Handle Message', props<{ id: number }>());
