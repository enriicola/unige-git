import { createReducer, on, Action } from '@ngrx/store';
import { initialMessagesState, MessagesState } from './message.state';
import { showMessage, handleMessage } from './message.actions';

const _messagesReducer = createReducer(
    initialMessagesState,
    on(showMessage,
        (state, action) => ({
            ...state,
            current: action.message,
            messages: [...state.messages.concat(action.message)]
        })),
    on(handleMessage,
        (state, action) => ({
            ...state,
            current: action.id === state.current.id ? {...state.current, hasBeenShown: true} : state.current
    })));

export function messagesReducer(state: MessagesState, action: Action): MessagesState {
    return _messagesReducer(state, action);
}
