import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './state';
import { awaiterReducer } from './awaiter/awaiter.reducer';
import { messagesReducer } from './message/message.reducers';

import {noticeDataReducer, noticeDataFiltersReducer} from './notice/notice.reducers';
import {officesDataReducer, officesDataFiltersReducer} from './offices/offices.reducers';

import {coursesDataReducer, coursesDataFiltersReducer} from './courses/courses.reducers';

export const reducers: ActionReducerMap<AppState> = {
    awaiter: awaiterReducer,
    messages: messagesReducer,

    noticeData: noticeDataReducer,
    noticeDataFilters: noticeDataFiltersReducer,

    officesData: officesDataReducer,
    officesDataFilters: officesDataFiltersReducer,

    coursesData: coursesDataReducer,
    coursesDataFilters: coursesDataFiltersReducer,
};
