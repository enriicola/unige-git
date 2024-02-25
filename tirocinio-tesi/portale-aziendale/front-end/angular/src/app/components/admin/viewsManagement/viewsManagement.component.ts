import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { AppState, DynamicQueryPart, Filtering} from "src/app/redux/state";
import { Action, Store } from "@ngrx/store";
import { Observable, Subject, Subscription, debounceTime, distinctUntilChanged, filter, firstValueFrom, map, of, startWith, take } from "rxjs";
import { OfficesData } from "src/app/redux/offices/offices.state";
import { ActivatedRoute, Router } from "@angular/router";
import { selectIsLoading } from "src/app/redux/awaiter/awaiter.selectors";
import { selectOfficesData, selectOfficesDataFilters } from "src/app/redux/offices/offices.selectors";
import { environment } from "src/environments/environment";
import { changeOfficesDataFilters } from "src/app/redux/offices/offices.actions";
import { getRandomId } from "src/app/redux/actions";
import { LazyLoadEvent } from "primeng/api";

@Component({
    selector: "app-viewsManagement",
    templateUrl: "./viewsManagement.component.html",
    styleUrls: ["./viewsManagement.component.scss"],
})

export class ViewsManagementComponent  implements OnInit, OnDestroy{

    officesData$: Observable<OfficesData[]> = of([]);
    office: Partial<OfficesData> = {
        officesName : '',
        officesCapacity : null,
        officesType: null,
        userId: null,
    };

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
        private router: Router,
        private route: ActivatedRoute
    ){
        this.officesData$.subscribe((data) => {
            if(data) { data.forEach((office) => {this.expandedMap[office.officesId] = false; });} });
        this.isLoading$ = store.select(selectIsLoading).pipe(distinctUntilChanged());
        this.officesDataFilters$ = store.select(selectOfficesDataFilters);
        this.filtersSub = this.filtersSubj$.asObservable().pipe(debounceTime(1000)).subscribe((a) => this.store.dispatch(a));
        this.lastSearch$ = store.select(selectOfficesDataFilters).pipe(take(1), map((f) => f.filtering && f.filtering.length > 0 ? f.filtering[0].value : ""));

    }

    currentDate = new Date();
    formattedDate = this.formatDateToDDMMYYYY(this.currentDate);

    private formatDateToDDMMYYYY(date: Date): string {
        date.setDate(date.getDate()+1);  //tomorrow
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();

        return `${day}/${month}/${year}`;
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
                ? ($event.first !== null || $event.first !== undefined)
                    ? { skip: $event.first, take: $event.rows }
                    : currentQueryParams.paging
                : { skip: 0, take: environment.defaultNumberOfRowsPerPage }
        };
        this.filtersSubj$.next(changeOfficesDataFilters({ queryParams: newQueryParams, _id: getRandomId() }));
    }

    toggleRow(officesId: number) {
        this.expandedMap[officesId] = !this.expandedMap[officesId];
    }

    isRowExpanded(officesId: number): boolean {
        return this.expandedMap[officesId];
    }

    ngOnInit(){

        //this.getOffices();
        this.officesData$ = this.store.select(selectOfficesData);
        this.totalRecords$ = this.officesData$.pipe(map((x) => (x ? (x[0] ? x[0].count : 0) : 0)));

    }

    ngOnDestroy(){
        this.filtersSub?.unsubscribe();
    }

}
