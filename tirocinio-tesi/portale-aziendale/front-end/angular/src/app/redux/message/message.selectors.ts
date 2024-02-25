import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../state';
import { AppMessage, MessagesState } from './message.state';
import * as U from './../../utils';

export const selectMessagesState = createFeatureSelector<AppState, MessagesState>('messages');

export const selectMessageToShow = createSelector(
    selectMessagesState,
    (state: MessagesState) => state.current?.hasBeenShown ? null : state.current
);
