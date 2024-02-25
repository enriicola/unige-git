import { Component, ChangeDetectionStrategy } from "@angular/core";
import { combineLatest, Observable, of } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/redux/state";
import { selectIsLoading } from "src/app/redux/awaiter/awaiter.selectors";
import { CustomOAuthService } from "src/app/services/custom-oauth.service";

@Component({
    selector: "app-progress-bar",
    templateUrl: "awaiter.component.html",
    styleUrls: ["awaiter.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AwaiterComponent {
    isLoading$: Observable<boolean> = of(false);
    private _isStable$: Observable<boolean> = of(false);

    constructor(
        private store: Store<AppState>,
        private oauthService: CustomOAuthService
    ) {
        this.isLoading$ = combineLatest([
            of(this.oauthService.isAuthenticated()),
            this.store.select(selectIsLoading).pipe(distinctUntilChanged()),
        ]).pipe(map(([_, show]) => show));
    }
}
