import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject, Subscription, debounceTime, distinctUntilChanged, filter, firstValueFrom, map, of, startWith, take } from "rxjs";
import { CoursesData } from "src/app/redux/courses/courses.state";
import { AppState, DynamicQueryPart, Filtering } from "src/app/redux/state";
import { Action, Store } from "@ngrx/store";
import { ActivatedRoute, Router } from "@angular/router";
import { selectIsLoading } from "src/app/redux/awaiter/awaiter.selectors";
import { selectCoursesData, selectCoursesDataFilters } from "src/app/redux/courses/courses.selectors";
import { environment } from "src/environments/environment";
import { changeCoursesDataFilters } from "src/app/redux/courses/courses.actions";
import { getRandomId } from "src/app/redux/actions";
import { LazyLoadEvent } from "primeng/api";

import { CalendarOptions, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";

@Component({
    selector: "app-enrollment",
    templateUrl: "./enrollment.component.html",
    styleUrls: ["./enrollment.component.scss"],
})

export class EnrollmentComponent  implements OnInit, OnDestroy{
    coursesData$: Observable<CoursesData[]> = of([]);
    coursesReserved$: Observable<CoursesData[]> = of([]);
    courseData$: Observable<CoursesData[]> = of([]);
    course: Partial<CoursesData> = {
        coursesName : '',
        coursesCapacity : null,
        coursesType: '',
        coursesDate: ''
    };

    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin],
        weekends: false,
        events: [],
        headerToolbar: {
            left: 'title',
            right: 'today prev,next'
        }
    };

    events_array: EventInput[];
    tmp_event: EventInput;

    expandedMap: { [key: number]: boolean } = {};

    lastSearch$: Observable<string> = of(null);
    coursesDataFilters$: Observable<DynamicQueryPart> = of({});
    isLoading$: Observable<boolean>;
    totalRecords$: Observable<number> = of(0);
    totalResevations$: Observable<number> = of(0);
    globalFiltersFields = Object.keys(this.course);
    filtersSubj$ = new Subject<Action>();
    filtersSub: Subscription;

    private _firstQuery: boolean = true;
    private _selectedCoursesData: CoursesData;
    get selectedCoursesData() {
        return this._selectedCoursesData;
    }
    set selectedCoursesData(value: CoursesData) {
        this._selectedCoursesData = value;
    }

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private route: ActivatedRoute
    ){
        this.coursesData$.subscribe((data) => {
            if(data) { data.forEach((course) => {this.expandedMap[course.coursesId] = false; });} });
        this.isLoading$ = store.select(selectIsLoading).pipe(distinctUntilChanged());
        this.coursesDataFilters$ = store.select(selectCoursesDataFilters);
        this.filtersSub = this.filtersSubj$.asObservable().pipe(debounceTime(1000)).subscribe((a) => this.store.dispatch(a));
        this.lastSearch$ = store.select(selectCoursesDataFilters).pipe(take(1), map((f) => f.filtering && f.filtering.length > 0 ? f.filtering[0].value : ""));

    }


    //addEnrollment
    addEnrollment(){
        this.coursesData$.subscribe((data) => {
            if(data) {data.forEach((course) => {console.log(course); });}
        });
        //aggiungi course_corrente + dettagli
    }

    //deleteEnrollment
    deleteEnrollment(){

    }


    //date
    today: number = Date.now();


    //controlli su tipi di uffici già prenotati, massimo una prenotzione per tipologia

    //filtering and pagination
    async filter(value: string) {
        const currentQueryParams = await firstValueFrom(this.coursesDataFilters$.pipe(take(1)));
        const newQueryParams: DynamicQueryPart = {
            ...currentQueryParams,
            paging: currentQueryParams.paging
                ? currentQueryParams.paging
                : { skip: 0, take: environment.defaultNumberOfRowsPerPage },
            filtering: value
                ? [{ column: this.globalFiltersFields.join(","), predicate: "LK", value: value, kind: "STRING" } as Filtering]
                : []
        };
        this.filtersSubj$.next(changeCoursesDataFilters({ queryParams: newQueryParams, _id: getRandomId() }));
    }

    async sort($event: LazyLoadEvent) {
        if (this._firstQuery) {
            this._firstQuery = false;
            return;
        }
        const currentQueryParams = await firstValueFrom(this.coursesDataFilters$.pipe(take(1)));
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
        this.filtersSubj$.next(changeCoursesDataFilters({ queryParams: newQueryParams, _id: getRandomId() }));
    }


    toggleRow(courseId: number) {
        this.expandedMap[courseId] = !this.expandedMap[courseId];
    }

    isRowExpanded(courseId: number): boolean {
        return this.expandedMap[courseId];
    }

    ngOnInit(): void {
        this.coursesData$ = this.store.select(selectCoursesData).pipe(startWith(this.route.snapshot.data.CoursesData));
        this.coursesData$.pipe(
            filter(data => !!data)
        ).subscribe((data) => {
            this.totalRecords$ = this.coursesData$.pipe(map((x) => (x ? (x[0] ? x[0].count : 0) : 0)));

            let tmp = [];
            data.forEach((course) => {
                // this.calendarOptions.events = [{
                //     title: course.coursesName,
                //     date: course.coursesDate
                // }];

                let day:string = course.coursesDate[0] + course.coursesDate[1];
                let month:string = course.coursesDate[3] + course.coursesDate[4];
                let year:string = course.coursesDate[6] + course.coursesDate[7] + course.coursesDate[8] + course.coursesDate[9];

                // if (+day < 10) day = '0' + day;
                // if (+month < 10) month = '0' + month;

                // console.log("giorno-> "+day);
                // console.log("mese-> "+month);

                tmp.push({ title: course.coursesName, date: year + '-' + month + '-' + day }); // yyy-mm-dd
                console.log(tmp);
            });

            this.calendarOptions = {
                ...this.calendarOptions,
                events: tmp
            };

        });
    }


    ngOnDestroy(): void {
        this.filtersSub?.unsubscribe();
    }
}
