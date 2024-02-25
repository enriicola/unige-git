import { Injectable } from '@angular/core';
import { createEffect, Actions } from '@ngrx/effects';
import { map, filter } from 'rxjs/operators';
import { isErrorAction, showMessage, isSuccessActionToShow } from './message/message.actions';

@Injectable()
export class AppEffects {

    constructor(
        private actions$: Actions,
      ) { }

    _errors$ = createEffect(
        () => this.actions$.pipe(
            filter(isErrorAction),
            map(e => showMessage({ message: { id: Math.floor(Math.random() * 1_000_000), hasBeenShown: false, message: e.error, severity: 'error' }}))
        )
    );

    _success$ = createEffect(
        () => this.actions$.pipe(
            filter(isSuccessActionToShow),
            map(e => showMessage({ message: { id: Math.floor(Math.random() * 1_000_000), hasBeenShown: false, message: e.successMessage, severity: 'success' }}))
        )
    );
}
