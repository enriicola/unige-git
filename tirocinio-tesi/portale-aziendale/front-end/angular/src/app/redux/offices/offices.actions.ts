import { createAction, props} from '@ngrx/store';
import {DynamicQueryPart, WithId} from '../state';
import {SuccessPayload, ErrorPayload} from '../message/message.actions';
import { OfficesData } from './offices.state';

//search OfficesData in db
export const searchOfficesData = createAction('[API] Search Offices Data', props<{queryParams: DynamicQueryPart} & WithId>());
export const searchOfficesDataSuccess = createAction('[API] Search Offices Data Success', props<SuccessPayload<{result: OfficesData[]}> & WithId>());
export const searchOfficesDataError = createAction('[API] Search Offices Data Error', props<ErrorPayload & WithId>());
export const changeOfficesDataFilters = createAction('[API] Change Offices Data Filters', props<{queryParams: DynamicQueryPart} & WithId>());

//add OfficesData
export const addOfficesData = createAction('[API] Add Offices Data', props<{item: Partial<OfficesData>} & WithId>());
export const addOfficesDataSuccess = createAction('[API] Add Offices Data Success', props<SuccessPayload<{result: OfficesData[]}> & WithId>());
export const addOfficesDataError = createAction('[API] Add Offices Data Error', props<ErrorPayload & WithId>());

//delete OfficesData
export const deleteOfficesData = createAction('[API] Delete Offices Data', props<{item: Partial<OfficesData>} & WithId>());
export const deleteOfficesDataSuccess = createAction('[API] Delete Offices Data Success', props<SuccessPayload<{result: OfficesData[]}> & WithId>());
export const deleteOfficesDataError = createAction('[API] Delete Offices Data Error', props<ErrorPayload & WithId>());

//update OfficesData from db
export const updateOfficesData = createAction('[API] Update Offices Data', props<{ item: Partial<OfficesData> } & WithId>());
export const updateOfficesDataSuccess = createAction('[API] Update Offices Data Success', props<SuccessPayload<{result: OfficesData[]}> & WithId>());
export const updateOfficesDataError = createAction('[API] Update Offices Data Error', props<ErrorPayload & WithId>());
