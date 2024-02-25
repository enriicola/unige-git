import { createAction, props} from '@ngrx/store';
import {DynamicQueryPart, WithId} from '../state';
import {SuccessPayload, ErrorPayload} from '../message/message.actions';
import { NoticeData } from './notice.state';

//search NoticeData in db
export const searchNoticeData = createAction('[API] Search Notice Data', props<{queryParams: DynamicQueryPart} & WithId>());
export const searchNoticeDataSuccess = createAction('[API] Search Notice Data Success', props<SuccessPayload<{result: NoticeData[]}> & WithId>());
export const searchNoticeDataError = createAction('[API] Search Notice Data Error', props<ErrorPayload & WithId>());
export const changeNoticeDataFilters = createAction('[API] Change Notice Data Filters', props<{queryParams: DynamicQueryPart} & WithId>());

//add NoticeData in db
export const sendNoticeData = createAction('[API] Add Notice Data', props<{ item: Partial<NoticeData> } & WithId>());
export const sendNoticeDataSuccess = createAction('[API] Add Notice Data Success', props<SuccessPayload<{result: NoticeData[]}> & WithId>());
export const sendNoticeDataError = createAction('[API] Add Notice Data Error', props<ErrorPayload & WithId>());

//delete NoticeData from db
export const deleteNoticeData = createAction('[API] Delete Notice Data', props<{ item: Partial<NoticeData> } & WithId>());
export const deleteNoticeDataSuccess = createAction('[API] Delete Notice Data Success', props<SuccessPayload<{result: NoticeData[]}> & WithId>());
export const deleteNoticeDataError = createAction('[API] Delete Notice Data Error', props<ErrorPayload & WithId>());

//update NoticeData from db
export const updateNoticeData = createAction('[API] Update Notice Data', props<{ item: Partial<NoticeData> } & WithId>());
export const updateNoticeDataSuccess = createAction('[API] Update Notice Data Success', props<SuccessPayload<{result: NoticeData[]}> & WithId>());
export const updateNoticeDataError = createAction('[API] Update Notice Data Error', props<ErrorPayload & WithId>());
