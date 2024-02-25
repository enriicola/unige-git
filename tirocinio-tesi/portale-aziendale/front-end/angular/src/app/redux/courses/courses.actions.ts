import {createAction, props} from '@ngrx/store';
import {DynamicQueryPart, WithId} from '../state';
import {SuccessPayload, ErrorPayload} from '../message/message.actions';
import {CoursesData} from './courses.state';

// search CoursesData in db
export const searchCoursesData = createAction('[API] Search Courses Data', props<{queryParams: DynamicQueryPart} & WithId>());
export const searchCoursesDataSuccess = createAction('[API] Search Courses Data Success', props<SuccessPayload<{result: CoursesData[]}> & WithId>());
export const searchCoursesDataError = createAction('[API] Search Courses Data Error', props<ErrorPayload & WithId>());
export const changeCoursesDataFilters = createAction('[API] Change Courses Data Filters', props<{queryParams: DynamicQueryPart} & WithId>());

// add CoursesData
export const addCoursesData = createAction('[API] Add Courses Data', props<{item: Partial<CoursesData>} & WithId>());
export const addCoursesDataSuccess = createAction('[API] Add Courses Data Success', props<SuccessPayload<{result: CoursesData[]}> & WithId>());
export const addCoursesDataError = createAction('[API] Add Courses Data Error', props<ErrorPayload & WithId>());

// delete CoursesData
export const deleteCoursesData = createAction('[API] Delete Courses Data', props<{item: Partial<CoursesData>} & WithId>());
export const deleteCoursesDataSuccess = createAction('[API] Delete Courses Data Success', props<SuccessPayload<{result: CoursesData[]}> & WithId>());
export const deleteCoursesDataError = createAction('[API] Delete Courses Data Error', props<ErrorPayload & WithId>());

// update CoursesData from db
export const updateCoursesData = createAction('[API] Update Courses Data', props<{ item: Partial<CoursesData> } & WithId>());
export const updateCoursesDataSuccess = createAction('[API] Update Courses Data Success', props<SuccessPayload<{result: CoursesData[]}> & WithId>());
export const updateCoursesDataError = createAction('[API] Update Courses Data Error', props<ErrorPayload & WithId>());
