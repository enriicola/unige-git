import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { AppState } from './../../redux/state';
import { Store } from '@ngrx/store';
import { selectMessageToShow } from '../../redux/message/message.selectors';
import { isEmpty, from } from './../../utils';
import { handleMessage } from './../../redux/message/message.actions'

@Component({
  selector: 'app-custom-message',
  templateUrl: "message.component.html",
  styleUrls: ["message.component.scss"]
})
export class MessageComponent implements OnDestroy {

    private sub: Subscription;

    constructor(
        private pMessageService: MessageService,
        private store: Store<AppState>) {
        this.sub = store.select(selectMessageToShow).pipe(
            map(m => from(m)),
            filter(m => !isEmpty(m)),
            distinctUntilChanged((e1, e2) => e1?.value.id === e2?.value.id)).subscribe(full => {
            this.pMessageService.add({
                severity: full.value.severity,
                id: full.value.id,
                summary: full.value.severity,
                detail: full.value.message
            });
        });
    }

    onMessageClose(event: any) {
        this.store.dispatch(handleMessage({ id: event.message.id}))
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }
}
