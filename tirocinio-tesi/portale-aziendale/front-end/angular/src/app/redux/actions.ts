
import { createAction, props } from '@ngrx/store';
import { SuccessPayload } from './message/message.actions';

export function getRandomId() {
    const rand = Math.floor(Math.random() * 1_000_000).toFixed();
    return rand;
}
 
export const authLogin = createAction('[Auth] Login');
export const authLoginSuccess = createAction('[Auth] Login Success', props<SuccessPayload<{ token: string}>>());
export const authLogout = createAction('[Auth] Logout');

export const userInfoSuccess = createAction('[User] Info Success', props<SuccessPayload<{ userName: string, email: string}>>());
