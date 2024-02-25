import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AppState, DynamicQueryPart, Filtering } from 'src/app/redux/state';
import { Action, Store } from '@ngrx/store';

import { CoursesData } from 'src/app/redux/courses/courses.state';
import { selectCoursesData, selectCoursesDataFilters } from 'src/app/redux/courses/courses.selectors';

import { environment } from 'src/environments/environment';
import { of } from 'rxjs/internal/observable/of';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription, debounceTime, distinctUntilChanged, filter, firstValueFrom, map, startWith, take } from 'rxjs';
import { getRandomId } from 'src/app/redux/actions';
import { addCoursesData, changeCoursesDataFilters, deleteCoursesData, updateCoursesData } from 'src/app/redux/courses/courses.actions';
import { LazyLoadEvent } from 'primeng/api/lazyloadevent';
import { selectIsLoading } from 'src/app/redux/awaiter/awaiter.selectors';

@Component({
    selector: 'app-educationManagementComponent',
    templateUrl: './educationManagementComponent.component.html',
    styleUrls: ['./educationManagementComponent.component.scss'],
})

export class EducationManagementComponentComponent  implements OnInit, OnDestroy{

    coursesData$: Observable<CoursesData[]> = of([]);

    public editedCourse: Partial<CoursesData> = {};

    course: Partial<CoursesData> = {
        coursesName : '',
        coursesCapacity : null,
        coursesType: '',
        coursesDate: '',
    };

    types: any = [
        { types: 'Udemy' },
        { types: 'Coursera' },
        { types: 'brilliant' },
        { types: 'UniGe' },
        { types: 'Angular University' }
    ];

    selectedType: any = null;

    // used to blocking some courses for only some user
    usersId: any[] = [  // to fill with keyclock users VIP or Amministrazione
        { usersId: 'Utente 1' },
        { usersId: 'Utente 2' },
        { usersId: 'Utente 3' },
    ];

    selectedUsers: any[] = [];

    showAddForm = true;
    successAdd = false;
    successUpdate = false;


    expandedMap: { [key: number]: boolean } = {};

    lastSearch$: Observable<string> = of(null);
    coursesDataFilters$: Observable<DynamicQueryPart> = of({});
    isLoading$: Observable<boolean>;
    totalRecords$: Observable<number> = of(0);
    globalFiltersFields = Object.keys(this.course);
    filtersSubj$ = new Subject<Action>();
    filtersSub: Subscription;

    private firstQuery = true;
    // tslint:disable-next-line:variable-name
    private _selectedCoursesData: CoursesData;
    get selectedCoursesData() {
        return this._selectedCoursesData;
    }
    set selectedCoursesData(value: CoursesData) {
        this._selectedCoursesData = value;
    }

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute
    ){
        // this.coursesData$ = store.select(selectCoursesData);
        this.coursesData$.subscribe((data) => {
            if (data) { data.forEach((course) => {this.expandedMap[course.coursesId] = false; }); } });
        this.isLoading$ = store.select(selectIsLoading).pipe(distinctUntilChanged());
        this.coursesDataFilters$ = store.select(selectCoursesDataFilters);
        this.filtersSub = this.filtersSubj$.asObservable().pipe(debounceTime(1000)).subscribe((a) => this.store.dispatch(a));
        // tslint:disable-next-line:max-line-length
        this.lastSearch$ = store.select(selectCoursesDataFilters).pipe(take(1), map((f) => f.filtering && f.filtering.length > 0 ? f.filtering[0].value : ''));

    }

    // add coursesData
    addCourse(form: NgForm) {
        if (this.selectedType) {
            this.course.coursesType = this.selectedType.types;
        }
        if (this.selectedUsers.length > 0) {
            this.selectedUsers.map((user) => user.usersId);
// this.course.userId = selectedUsersIds.join(', ');
        }

        this.store.dispatch( addCoursesData({ item: this.course, _id: getRandomId() }) );

        this.resetFormFields(form);
        this.successAdd = true;
        this.successUpdate = false;
    }

    resetFormFields(form: NgForm) {
        form.resetForm();
        this.course = {
            coursesId: null,
            coursesName: '',
            coursesCapacity : null,
            // userId: null,
            coursesDate: null,
        };
        this.selectedType = null;
        this.selectedUsers = [];
    }

    // delete coursesData
    deleteCoursesData(course: CoursesData){
        if (course){
            this.store.dispatch( deleteCoursesData({item: course, _id: getRandomId() }));
        }
    }

    // update coursesData
    updateCoursesData(form: NgForm){
        if (this.selectedUsers.length > 0) {
            this.selectedUsers.map((user) => user.usersId);
// this.editedCourse.userId = selectedUsersIds.join(', ');
        }
        else{
            // this.editedCourse.userId = null;
        }

        if (this.selectedType) {
            this.editedCourse.coursesType = this.selectedType.types;
        }

        console.log(this.editedCourse);
        this.store.dispatch( updateCoursesData({ item: this.editedCourse , _id: getRandomId() }) );
        this.editedCourse = {};

        this.resetFormFields(form);
        this.successUpdate = true;
        this.successAdd = false;
        this.showAddForm = true;
    }

    editCoursesData(course: CoursesData) {
        this.editedCourse  = { ...course };
        this.showAddForm = false;
    }


    // filtering and pagination
    async filter(value: string) {
        const currentQueryParams = await firstValueFrom(this.coursesDataFilters$.pipe(take(1)));
        const newQueryParams: DynamicQueryPart = {
            ...currentQueryParams,
            paging: currentQueryParams.paging
                ? currentQueryParams.paging
                : { skip: 0, take: environment.defaultNumberOfRowsPerPage },
            filtering: value
                ? [{ column: this.globalFiltersFields.join(','), predicate: 'LK', value, kind: 'STRING' } as Filtering]
                : []
        };
        this.filtersSubj$.next(changeCoursesDataFilters({ queryParams: newQueryParams, _id: getRandomId() }));
    }

    async sort($event: LazyLoadEvent) {
        if (this.firstQuery) {
            this.firstQuery = false;
            return;
        }
        const currentQueryParams = await firstValueFrom(this.coursesDataFilters$.pipe(take(1)));
        const newQueryParams = {
            ...currentQueryParams,
            ordering: $event.sortField
                ? [{ column: $event.sortField, columnPrefix: '', descending: $event.sortOrder > 0}]
                : [],
            paging: currentQueryParams.paging
                ? ($event.first !== null || true)
                    ? { skip: $event.first, take: $event.rows }
                    : currentQueryParams.paging
                : { skip: 0, take: environment.defaultNumberOfRowsPerPage }
        };
        this.filtersSubj$.next(changeCoursesDataFilters({ queryParams: newQueryParams, _id: getRandomId() }));
    }

    ngOnInit(): void {
        this.coursesData$ = this.store.select(selectCoursesData).pipe(startWith(this.route.snapshot.data.CoursesData));
        this.coursesData$.pipe(
            filter(data => !!data)
        ).subscribe(() => {
            this.totalRecords$ = this.coursesData$.pipe(map((x) => (x ? (x[0] ? x[0].count : 0) : 0)));
        });
    }

    ngOnDestroy(): void {
        this.filtersSub?.unsubscribe();
    }
}
