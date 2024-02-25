import { Injectable, NgZone } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { skipWhile, take } from "rxjs/operators";
import { searchNoticeData } from "../redux/notice/notice.actions";
import { NoticeData } from "../redux/notice/notice.state";
import { AppState } from "../redux/state";
import { selectNoticeData, selectNoticeDataFilters } from "../redux/notice/notice.selectors";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class NoticeResolver implements Resolve<NoticeData[]> {
    constructor(
        private store: Store<AppState>,
        private zone: NgZone
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<NoticeData[]> | Promise<NoticeData[]> | NoticeData[] {
        const rand = Math.floor(Math.random() * 1_000_000).toFixed();
        this.zone.runOutsideAngular(() => {
            setTimeout(() => {
                this.store.select(selectNoticeDataFilters).pipe(take(1)).subscribe((storedDqp) => {
                    this.store.dispatch(
                        searchNoticeData({
                            _id: rand,
                            queryParams: {
                                filtering: storedDqp.filtering ? storedDqp.filtering : [],
                                paging: storedDqp.paging ? storedDqp.paging : { skip: 0, take: environment.defaultNumberOfRowsPerPage },
                                ordering: storedDqp.ordering ? storedDqp.ordering : [{ column: "noticeId", columnPrefix: "", descending: false }],
                            },
                        })
                    );
                });
            });
        });
        return this.store.select(selectNoticeData).pipe(
            skipWhile((s) => s._id !== rand),
            take(1)
        );
    }
}
