import { Injectable } from '@angular/core';
import { ofType, createEffect, Actions } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { CustomHttpClient } from '../../services/custom-http-client.service';
import { environment } from '../../../environments/environment';  //  src/environments/environment';
import { addOfficesData, addOfficesDataError, addOfficesDataSuccess, changeOfficesDataFilters, deleteOfficesData, deleteOfficesDataError, deleteOfficesDataSuccess, searchOfficesData, searchOfficesDataError, searchOfficesDataSuccess, updateOfficesData, updateOfficesDataError, updateOfficesDataSuccess,} from './offices.actions';
import { OfficesData } from './offices.state';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';

@Injectable()
export class OfficesEffect{

    constructor(
        private actions$: Actions,
        private httpClient: CustomHttpClient
    ){ }


    //search OfficesData
    _serachOfficesData = createEffect(
        () => this.actions$.pipe(
            ofType(searchOfficesData),
            mergeMap(a => {
                const response$ = this.httpClient.post<OfficesData[]>(`${environment.apiUrl}/offices/searchOfficesData`, a.queryParams, { responseType: 'json'});
                return response$.pipe(
                    map(r => r ?? []),
                    map(r => searchOfficesDataSuccess({result: r, _id: a._id })),
                    catchError((err: HttpErrorResponse, _) => {
                        return [searchOfficesDataError({error: err.message, _id: a._id})];
                    }));
            }))
    );

    _changeOfficesDataFilters = createEffect(
        () => this.actions$.pipe(
            ofType(changeOfficesDataFilters),
            map(a => searchOfficesData({queryParams: a.queryParams, _id: a._id}))
            )
    );

    //add OfficesData 
    _addOfficesData = createEffect(
        () => this.actions$.pipe(
            ofType(addOfficesData),
            mergeMap(a => {
                const response$ = this.httpClient.post<OfficesData[]>(`${environment.apiUrl}/offices/addOfficesData`, [a.item], { responseType: 'json'});
                return response$.pipe(
                    map(r => r ?? []),
                    map(r => addOfficesDataSuccess({result: r, _id: a._id })),
                    catchError((err: HttpErrorResponse, _) => {
                        return [addOfficesDataError({error: err.message, _id: a._id})];
                    }));
            }))
    );


    //delete OfficesData
    _deleteOfficesData = createEffect(
        () => this.actions$.pipe(
            ofType(deleteOfficesData),
            mergeMap(a => {
                const response$ = this.httpClient.delete<OfficesData[]>(`${environment.apiUrl}/offices/deleteOfficesData/${a.item.officesId}` , { responseType: 'json'});
                return response$.pipe(
                    map(r => r ?? []),
                    map(r => deleteOfficesDataSuccess({result: r, _id: a._id })),
                    catchError((err: HttpErrorResponse, _) => {
                        return [deleteOfficesDataError({error: err.message, _id: a._id})];
                    }));
            }))
    );

    //update OfficesData
    _updateOfficesData = createEffect(() =>
        this.actions$.pipe(
            ofType(updateOfficesData),
            mergeMap(a => 
                this.httpClient.put<OfficesData[]>(`${environment.apiUrl}/offices/updateOfficesData`, [a.item], { responseType: 'json' }
                ).pipe(
                    map(r => r ?? []),
                    map(r => updateOfficesDataSuccess({ result: r, _id: a._id })),
                    catchError((err: HttpErrorResponse, _) =>
                        of(updateOfficesDataError({ error: err.message, _id: a._id }))
                    )
                )
            )
        )
    );

}
