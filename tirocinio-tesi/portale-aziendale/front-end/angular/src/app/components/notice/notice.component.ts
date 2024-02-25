import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Action, Store } from "@ngrx/store";
import { firstValueFrom, Observable, of, Subject, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged, filter, map, startWith, take } from "rxjs/operators";
import { LazyLoadEvent } from "primeng/api";


import { AppState, DynamicQueryPart, Filtering } from "src/app/redux/state";
import { getRandomId } from "src/app/redux/actions";
import { selectIsLoading } from "src/app/redux/awaiter/awaiter.selectors";
import { NoticeData } from "src/app/redux/notice/notice.state";
import { selectNoticeData, selectNoticeDataFilters } from "src/app/redux/notice/notice.selectors";
import { changeNoticeDataFilters } from "src/app/redux/notice/notice.actions";
import { environment } from "src/environments/environment";


@Component({
    selector: "app-notice",
    templateUrl: "./notice.component.html",
    styleUrls: ["./notice.component.scss"],
})

export class NoticeComponent implements OnInit, OnDestroy{
    lastSearch$: Observable<string> = of(null);
    noticeData$: Observable<NoticeData[]> = of([]);
    noticeDataFilters$: Observable<DynamicQueryPart> = of({});
    isLoading$: Observable<boolean>;

    personalTotalRecords$: Observable<number> = of(0);
    generalTotalRecords$: Observable<number> = of(0);
    personalNotices$: Observable<NoticeData[]> = of([]);
    generalNotices$: Observable<NoticeData[]> = of([]);
    
    expandedMap: { [key: number]: boolean } = {};

    currentDate = new Date();
    formattedDate = this.formatDateToDDMMYYYY(this.currentDate);

    private formatDateToDDMMYYYY(date: Date): string {
        date.setDate(date.getDate()+1);  //tomorrow
        const day = date.getDate().toString().padStart(2, '0'); 
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
      
        return `${day}/${month}/${year}`;
    }

    private _defaultND: Partial<NoticeData> = {
        noticeId: 0,
        noticeState: false,
        noticeDateTime: "01012023",
        noticeTitle: "dummy",
        noticeObject: "dummy",
        noticeDesc: "dummy",
    };
    
    globalFiltersFields = Object.keys(this._defaultND);
    filtersSubj$ = new Subject<Action>();
    filtersSub: Subscription;

    private _firstQuery: boolean = true;
    private _selectedNoticeData: NoticeData;
    get selectedNoticeData() {
        return this._selectedNoticeData;
    }
    set selectedNoticeData(value: NoticeData) {
        this._selectedNoticeData = value;
    }

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private route: ActivatedRoute
    ){
        this.isLoading$ = store.select(selectIsLoading).pipe(distinctUntilChanged());
        this.noticeDataFilters$ = store.select(selectNoticeDataFilters);
        this.filtersSub = this.filtersSubj$.asObservable().pipe(debounceTime(1000)).subscribe((a) => this.store.dispatch(a));
        this.lastSearch$ = store.select(selectNoticeDataFilters).pipe(take(1), map((f) => f.filtering && f.filtering.length > 0 ? f.filtering[0].value : ""));
        this.noticeData$.subscribe((data) => { data.forEach((notice) => {this.expandedMap[notice.noticeId] = false })});
    }

    async filter(value: string) {
        const currentQueryParams = await firstValueFrom(this.noticeDataFilters$.pipe(take(1)));
        const newQueryParams: DynamicQueryPart = {
            ...currentQueryParams,
            paging: currentQueryParams.paging
                ? currentQueryParams.paging
                : { skip: 0, take: environment.defaultNumberOfRowsPerPage },
            filtering: value
                ? [{ column: this.globalFiltersFields.join(","), predicate: "LK", value: value, kind: "STRING" } as Filtering]
                : []
        };
        this.filtersSubj$.next(changeNoticeDataFilters({ queryParams: newQueryParams, _id: getRandomId() }));
    }

    async sort($event: LazyLoadEvent) {
        if (this._firstQuery) {
            this._firstQuery = false;
            return;
        }
        const currentQueryParams = await firstValueFrom(this.noticeDataFilters$.pipe(take(1)));
        const newQueryParams = {
            ...currentQueryParams,
            ordering: $event.sortField
                ? [{ column: $event.sortField, columnPrefix: "", descending: $event.sortOrder > 0 }]
                : [],
            paging: currentQueryParams.paging
                ? ($event.first !== null || $event.first !== undefined)
                    ? { skip: $event.first, take: $event.rows }
                    : currentQueryParams.paging
                : { skip: 0, take: environment.defaultNumberOfRowsPerPage }
        };
        this.filtersSubj$.next(changeNoticeDataFilters({ queryParams: newQueryParams, _id: getRandomId() }));
    }

    toggleRow(noticeId: number) {
        this.expandedMap[noticeId] = !this.expandedMap[noticeId];
    }

    isRowExpanded(noticeId: number): boolean {
        return this.expandedMap[noticeId];
    }

    ngOnInit(): void {
        this.noticeData$ = this.store.select(selectNoticeData).pipe(startWith(this.route.snapshot.data.NoticeData));
        this.noticeData$.pipe(
            filter(data => !!data)
        ).subscribe((data) => {
            this.personalNotices$ = of(data.filter((data) => data.userId !== null));
            this.generalNotices$ = of(data.filter((data) => data.userId === null));            

            this.personalTotalRecords$ = this.personalNotices$.pipe(map((x) => (x ? x.length : 0)));
            this.generalTotalRecords$ = this.generalNotices$.pipe(map((x) => (x ? x.length : 0)));
        });
    }

    ngOnDestroy(): void {
        this.filtersSub?.unsubscribe();
    }
}

