import { Injectable } from '@angular/core';
import { ofType, createEffect, Actions } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { CustomHttpClient } from '../../services/custom-http-client.service';
import { environment } from '../../../environments/environment';  //  src/environments/environment';
import { addCoursesData, addCoursesDataError, addCoursesDataSuccess, changeCoursesDataFilters, deleteCoursesData, deleteCoursesDataError, deleteCoursesDataSuccess, searchCoursesData, searchCoursesDataError, searchCoursesDataSuccess, updateCoursesData, updateCoursesDataError, updateCoursesDataSuccess,} from './courses.actions';
import { CoursesData } from './courses.state';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';

@Injectable()
// @Injectable({providedIn: 'root'})
export class CoursesEffect{

    constructor(
        private actions$: Actions,
        private httpClient: CustomHttpClient
    ){ }


    //search CoursesData
    _serachCoursesData = createEffect(
        () => this.actions$.pipe(
            ofType(searchCoursesData),
            mergeMap(a => {
                const response$ = this.httpClient.post<CoursesData[]>(`${environment.apiUrl}/courses/searchCoursesData`, a.queryParams, { responseType: 'json'});
                return response$.pipe(
                    map(r => r ?? []),
                    map(r => searchCoursesDataSuccess({result: r, _id: a._id })),
                    catchError((err: HttpErrorResponse, _) => {
                        return [searchCoursesDataError({error: err.message, _id: a._id})];
                    }));
            }))
    );

    _changeCoursesDataFilters = createEffect(
        () => this.actions$.pipe(
            ofType(changeCoursesDataFilters),
            map(a => searchCoursesData({queryParams: a.queryParams, _id: a._id}))
            )
    );

    //add CoursesData 
    _addCoursesData = createEffect(
        () => this.actions$.pipe(
            ofType(addCoursesData),
            mergeMap(a => {
                const response$ = this.httpClient.post<CoursesData[]>(`${environment.apiUrl}/courses/addCoursesData`, [a.item], { responseType: 'json'});
                return response$.pipe(
                    map(r => r ?? []),
                    map(r => addCoursesDataSuccess({result: r, _id: a._id })),
                    catchError((err: HttpErrorResponse, _) => {
                        return [addCoursesDataError({error: err.message, _id: a._id})];
                    }));
            }))
    );


    //delete CoursesData
    _deleteCoursesData = createEffect(
        () => this.actions$.pipe(
            ofType(deleteCoursesData),
            mergeMap(a => {
                const response$ = this.httpClient.delete<CoursesData[]>(`${environment.apiUrl}/courses/deleteCoursesData/${a.item.coursesId}` , { responseType: 'json'});
                return response$.pipe(
                    map(r => r ?? []),
                    map(r => deleteCoursesDataSuccess({result: r, _id: a._id })),
                    catchError((err: HttpErrorResponse, _) => {
                        return [deleteCoursesDataError({error: err.message, _id: a._id})];
                    }));
            }))
    );

    //update CoursesData
    _updateCoursesData = createEffect(() =>
        this.actions$.pipe(
            ofType(updateCoursesData),
            mergeMap(a => 
                this.httpClient.put<CoursesData[]>(`${environment.apiUrl}/courses/updateCoursesData`, [a.item], { responseType: 'json' }
                ).pipe(
                    map(r => r ?? []),
                    map(r => updateCoursesDataSuccess({ result: r, _id: a._id })),
                    catchError((err: HttpErrorResponse, _) =>
                        of(updateCoursesDataError({ error: err.message, _id: a._id }))
                    )
                )
            )
        )
    );
}