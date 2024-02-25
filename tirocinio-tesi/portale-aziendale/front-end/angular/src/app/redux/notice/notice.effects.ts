import { Injectable } from '@angular/core';
import { ofType, createEffect, Actions } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { CustomHttpClient } from '../../services/custom-http-client.service';
import { environment } from '../../../environments/environment';  //  src/environments/environment';
import { changeNoticeDataFilters, searchNoticeData, searchNoticeDataError, searchNoticeDataSuccess, updateNoticeData, updateNoticeDataError, updateNoticeDataSuccess} from './notice.actions';
import { sendNoticeData, sendNoticeDataSuccess, sendNoticeDataError, deleteNoticeData, deleteNoticeDataSuccess, deleteNoticeDataError} from "./notice.actions";
import { NoticeData } from './notice.state';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';

@Injectable()
export class NoticeEffect{

    constructor(
        private actions$: Actions,
        private httpClient: CustomHttpClient
    ){ }


    //search NoticeData
    _serachNoticeData = createEffect(
        () => this.actions$.pipe(
            ofType(searchNoticeData),
            mergeMap(a => {
                const response$ = this.httpClient.post<NoticeData[]>(`${environment.apiUrl}/notice/searchNoticeData`, a.queryParams, { responseType: 'json'});
                return response$.pipe(
                    map(r => r ?? []),
                    map(r => searchNoticeDataSuccess({result: r, _id: a._id })),
                    catchError((err: HttpErrorResponse, _) => {
                        return [searchNoticeDataError({error: err.message, _id: a._id})];
                    }));
            }))
    );

    _changeNoticeDataFilters = createEffect(
        () => this.actions$.pipe(
            ofType(changeNoticeDataFilters),
            map(a => searchNoticeData({queryParams: a.queryParams, _id: a._id}))
            )
    );



    //add NoticeData 
    _sendNoticeData = createEffect(
        () => this.actions$.pipe(
            ofType(sendNoticeData),
            mergeMap(a => {
                const response$ = this.httpClient.post<NoticeData[]>(`${environment.apiUrl}/notice/sendNoticeData`, [a.item], { responseType: 'json'});
                return response$.pipe(
                    map(r => r ?? []),
                    map(r => sendNoticeDataSuccess({result: r, _id: a._id })),
                    catchError((err: HttpErrorResponse, _) => {
                        return [sendNoticeDataError({error: err.message, _id: a._id})];
                    }));
            }))
    );

    //delete NoticeData
    _deleteNoticeData = createEffect(
        () => this.actions$.pipe(
            ofType(deleteNoticeData),
            mergeMap(a => {
                const response$ = this.httpClient.delete<NoticeData[]>(`${environment.apiUrl}/notice/deleteNoticeData/${a.item.noticeId}` , { responseType: 'json'});
                return response$.pipe(
                    map(r => r ?? []),
                    map(r => deleteNoticeDataSuccess({result: r, _id: a._id })),
                    catchError((err: HttpErrorResponse, _) => {
                        return [deleteNoticeDataError({error: err.message, _id: a._id})];
                    }));
            }))
    );

    //update NoticeData
    _updateNoticeData = createEffect(() =>
        this.actions$.pipe(
            ofType(updateNoticeData),
            mergeMap(a => 
                this.httpClient.put<NoticeData[]>(`${environment.apiUrl}/notice/updateNoticeData`, [a.item], { responseType: 'json' }
                ).pipe(
                    map(r => r ?? []),
                    map(r => updateNoticeDataSuccess({ result: r, _id: a._id })),
                    catchError((err: HttpErrorResponse, _) =>
                        of(updateNoticeDataError({ error: err.message, _id: a._id }))
                    )
                )
            )
        )
    );

}
