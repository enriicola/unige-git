import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { AppState, DynamicQueryPart, Filtering } from "src/app/redux/state";
import { Action, Store } from "@ngrx/store";

import { NoticeData } from "src/app/redux/notice/notice.state";
import { selectNoticeData, selectNoticeDataFilters } from "src/app/redux/notice/notice.selectors";
import { changeNoticeDataFilters, sendNoticeData, deleteNoticeData, updateNoticeData, searchNoticeData } from "src/app/redux/notice/notice.actions";
import { environment } from "src/environments/environment";
import { of } from "rxjs/internal/observable/of";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject, Subscription, count, debounceTime, distinctUntilChanged, filter, firstValueFrom, map, startWith, take } from "rxjs";
import { getRandomId } from "src/app/redux/actions";
import { selectIsLoading } from "src/app/redux/awaiter/awaiter.selectors";
import { LazyLoadEvent } from "primeng/api/lazyloadevent";


@Component({
    selector: "app-noticesManagement",
    templateUrl: "./noticesManagement.component.html",
    styleUrls: ["./noticesManagement.component.scss"],    
})

export class NoticesManagementComponent implements OnInit, OnDestroy { 

    noticeData$: Observable<NoticeData[]> = of([]);

    public editedNotice: Partial<NoticeData> = {};

    notification: Partial<NoticeData> = {
        noticeState: false,
        noticeDateTime: '01012023',
        noticeTitle: '',
        noticeObject: '',
        noticeDesc: '',
        userId: null,
      };

    usersId: any[] = [  //to fill with keyclock users
        { usersId: "Utente 1" },
        { usersId: "Utente 2" },
        { usersId: "Utente 3" },
        { usersId: "Utente 4" },
        { usersId: "Utente 5" },
        { usersId: "Utente 6" },
    ];

    selectedUsers: any[] = [];
    showAddForm = true;
    successAdd: boolean = false;
    successUpdate: boolean = false;


    // notices table
    lastSearch$: Observable<string> = of(null);
    noticeDataFilters$: Observable<DynamicQueryPart> = of({});
    isLoading$: Observable<boolean>;
    totalRecords$: Observable<number> = of(0);
    
    expandedMap: { [key: number]: boolean } = {};
    
    globalFiltersFields = Object.keys(this.notification);
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

        //notices table
        this.noticeData$.subscribe((data) => {
            if(data) { data.forEach((notice) => {this.expandedMap[notice.noticeId] = false; });} });
        this.isLoading$ = store.select(selectIsLoading).pipe(distinctUntilChanged());
        this.noticeDataFilters$ = store.select(selectNoticeDataFilters);
        this.filtersSub = this.filtersSubj$.asObservable().pipe(debounceTime(1000)).subscribe((a) => this.store.dispatch(a));
        this.lastSearch$ = store.select(selectNoticeDataFilters).pipe(take(1), map((f) => f.filtering && f.filtering.length > 0 ? f.filtering[0].value : ""));
        
    }

    //ADD
    addNoticeData(form: NgForm) {
        if (this.selectedUsers.length > 0) {
            const selectedUsersIds: string[] = this.selectedUsers.map((user) => user.usersId);
            const usersIdAsString: string = selectedUsersIds.join(", ");
            this.notification.userId = usersIdAsString;
        }
        console.log(this.notification);
        this.store.dispatch( sendNoticeData({ item: this.notification, _id: getRandomId() }) );
    
        this.resetFormFields(form);
        this.successAdd = true;
        this.successUpdate = false;
    }

    resetFormFields(form: NgForm) {
        form.resetForm();
        this.notification = {
            noticeState: false,
            noticeDateTime: "01012023",
            noticeTitle: "",
            noticeObject: "",
            noticeDesc: "",
            userId: null,
        };
        this.selectedUsers = [];
    }

    //DELETE
    deleteNoticeData(notice:NoticeData){
        if (notice){
            this.store.dispatch( deleteNoticeData({item: notice, _id: getRandomId() }));
        }
    }

    //UPDATE
    updateNoticeData(form: NgForm){
        if (this.selectedUsers.length > 0) {
            const selectedUsersIds: string[] = this.selectedUsers.map((user) => user.usersId);
            const usersIdAsString: string = selectedUsersIds.join(", ");
            this.editedNotice.userId = usersIdAsString;
        }
        else{
            this.editedNotice.userId = null;
        }

        this.store.dispatch( updateNoticeData({ item: this.editedNotice , _id: getRandomId() }) );
        this.editedNotice = {};

        this.resetFormFields(form);
        this.successUpdate = true;
        this.successAdd = false;
        this.showAddForm = true;
    }

    editNoticeData(notice: NoticeData) {
        this.editedNotice  = { ...notice }; 
        this.showAddForm = false;
    }


    //notices table functions
    
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
                ? [{ column: $event.sortField, columnPrefix: "", descending: $event.sortOrder > 0}]
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
            this.totalRecords$ = this.noticeData$.pipe(map((x) => (x ? (x[0] ? x[0].count : 0) : 0)));
        });

    }

    ngOnDestroy(): void {
        this.filtersSub?.unsubscribe();
    }
}
