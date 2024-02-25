import {Component, OnDestroy, OnInit} from "@angular/core";
import {NgForm} from "@angular/forms";

import {AppState, DynamicQueryPart, Filtering} from "src/app/redux/state";
import {Action, Store} from "@ngrx/store";

import {OfficesData} from "src/app/redux/offices/offices.state";
import {selectOfficesData, selectOfficesDataFilters} from "src/app/redux/offices/offices.selectors";

import {environment} from "src/environments/environment";
import {of} from "rxjs/internal/observable/of";
import {ActivatedRoute} from "@angular/router";
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    firstValueFrom,
    map,
    Observable,
    startWith,
    Subject,
    Subscription,
    take
} from "rxjs";
import {getRandomId} from "src/app/redux/actions";
import {
    addOfficesData,
    changeOfficesDataFilters,
    deleteOfficesData,
    updateOfficesData
} from "src/app/redux/offices/offices.actions";
import {LazyLoadEvent} from "primeng/api/lazyloadevent";
import {selectIsLoading} from "src/app/redux/awaiter/awaiter.selectors";

@Component({
    selector: "app-officesManagement",
    templateUrl: "./officesManagement.component.html",
    styleUrls: ["./officesManagement.component.scss"],
})

export class OfficesManagementComponent  implements OnInit, OnDestroy{

    officesData$: Observable<OfficesData[]> = of([]);

    public editedOffice: Partial<OfficesData> = {};

    office: Partial<OfficesData> = {
        officesName : '',
        officesCapacity : null,
        officesType: null,
        userId: null,
    };

    types: any = [
        { types: "Ufficio standard" },
        { types: "Sala riunioni" },
        { types: "Sala ristoro" },
        { types: "Ufficio amministrativo" },
        { types: "Ufficio dirigenti" },
    ];

    selectedType: any = null;

    //used to blocking some offices for only some user
    usersId: any[] = [  //to fill with keyclock users VIP or Amministrazione
        { usersId: "Utente 1" },
        { usersId: "Utente 2" },
        { usersId: "Utente 3" },
    ];

    selectedUsers: any[] = [];

    showAddForm = true;
    successAdd: boolean = false;
    successUpdate: boolean = false;


    expandedMap: { [key: number]: boolean } = {};

    lastSearch$: Observable<string> = of(null);
    officesDataFilters$: Observable<DynamicQueryPart> = of({});
    isLoading$: Observable<boolean>;
    totalRecords$: Observable<number> = of(0);
    globalFiltersFields = Object.keys(this.office);
    filtersSubj$ = new Subject<Action>();
    filtersSub: Subscription;

    private _firstQuery: boolean = true;
    private _selectedOfficesData: OfficesData;
    get selectedOfficesData() {
        return this._selectedOfficesData;
    }
    set selectedOfficesData(value: OfficesData) {
        this._selectedOfficesData = value;
    }

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute
    ){
        //this.officesData$ = store.select(selectOfficesData);
        this.officesData$.subscribe((data) => {
            if(data) { data.forEach((office) => {this.expandedMap[office.officesId] = false; });} });
        this.isLoading$ = store.select(selectIsLoading).pipe(distinctUntilChanged());
        this.officesDataFilters$ = store.select(selectOfficesDataFilters);
        this.filtersSub = this.filtersSubj$.asObservable().pipe(debounceTime(1000)).subscribe((a) => this.store.dispatch(a));
        this.lastSearch$ = store.select(selectOfficesDataFilters).pipe(take(1), map((f) => f.filtering && f.filtering.length > 0 ? f.filtering[0].value : ""));

    }

    //add officesData
    addOffice(form: NgForm) {
        if(this.selectedType) {
            this.office.officesType = this.selectedType.types;
        }
        if (this.selectedUsers.length > 0) {
            const selectedUsersIds: string[] = this.selectedUsers.map((user) => user.usersId);
            this.office.userId = selectedUsersIds.join(", ");
        }

        this.store.dispatch( addOfficesData({ item: this.office, _id: getRandomId() }) );

        this.resetFormFields(form);
        this.successAdd = true;
        this.successUpdate = false;
    }

    resetFormFields(form: NgForm) {
        form.resetForm();
        this.office = {
            officesName : '',
            officesCapacity : null,
            userId: null,
        };
        this.selectedType = null;
        this.selectedUsers = [];
    }

    //delete officesData
    deleteOfficesData(office:OfficesData){
        if (office){
            this.store.dispatch( deleteOfficesData({item: office, _id: getRandomId() }));
        }
    }

    //update officesData
    updateOfficesData(form: NgForm){
        if (this.selectedUsers.length > 0) {
            const selectedUsersIds: string[] = this.selectedUsers.map((user) => user.usersId);
            this.editedOffice.userId = selectedUsersIds.join(", ");
        }
        else{
            this.editedOffice.userId = null;
        }

        if (this.selectedType) {
            this.editedOffice.officesType = this.selectedType.types;
        }

        console.log(this.editedOffice);
        this.store.dispatch( updateOfficesData({ item: this.editedOffice , _id: getRandomId() }) );
        this.editedOffice = {};

        this.resetFormFields(form);
        this.successUpdate = true;
        this.successAdd = false;
        this.showAddForm = true;
    }

    editOfficesData(office: OfficesData) {
        this.editedOffice  = { ...office };
        this.showAddForm = false;
    }


    //filtering and pagination
    async filter(value: string) {
        const currentQueryParams = await firstValueFrom(this.officesDataFilters$.pipe(take(1)));
        const newQueryParams: DynamicQueryPart = {
            ...currentQueryParams,
            paging: currentQueryParams.paging
                ? currentQueryParams.paging
                : { skip: 0, take: environment.defaultNumberOfRowsPerPage },
            filtering: value
                ? [{ column: this.globalFiltersFields.join(","), predicate: "LK", value: value, kind: "STRING" } as Filtering]
                : []
        };
        this.filtersSubj$.next(changeOfficesDataFilters({ queryParams: newQueryParams, _id: getRandomId() }));
    }

    async sort($event: LazyLoadEvent) {
        if (this._firstQuery) {
            this._firstQuery = false;
            return;
        }
        const currentQueryParams = await firstValueFrom(this.officesDataFilters$.pipe(take(1)));
        const newQueryParams = {
            ...currentQueryParams,
            ordering: $event.sortField
                ? [{ column: $event.sortField, columnPrefix: "", descending: $event.sortOrder > 0}]
                : [],
            paging: currentQueryParams.paging
                ? ($event.first !== null || true)
                    ? { skip: $event.first, take: $event.rows }
                    : currentQueryParams.paging
                : { skip: 0, take: environment.defaultNumberOfRowsPerPage }
        };
        this.filtersSubj$.next(changeOfficesDataFilters({ queryParams: newQueryParams, _id: getRandomId() }));
    }

    ngOnInit(): void {
        this.officesData$ = this.store.select(selectOfficesData).pipe(startWith(this.route.snapshot.data.OfficesData));
        this.officesData$.pipe(
            filter(data => !!data)
        ).subscribe(() => {
            this.totalRecords$ = this.officesData$.pipe(map((x) => (x ? (x[0] ? x[0].count : 0) : 0)));
        });
    }

    ngOnDestroy(): void {
        this.filtersSub?.unsubscribe();
    }
}
