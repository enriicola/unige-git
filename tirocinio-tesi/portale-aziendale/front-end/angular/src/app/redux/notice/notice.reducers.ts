import { createReducer, on, Action } from "@ngrx/store";
import { NoticeData, initialNoticeDataState as initialNoticeDataState, initialNoticeDataFiltersState as initialNoticeDataFiltersState } from "./notice.state";
import { DynamicQueryPart, WithId } from "../state";
import { searchNoticeDataSuccess, searchNoticeDataError, changeNoticeDataFilters, updateNoticeDataSuccess, updateNoticeDataError} from "./notice.actions";
import { sendNoticeDataSuccess, sendNoticeDataError, deleteNoticeDataSuccess, deleteNoticeDataError} from "./notice.actions";


//search filters NoticeData
const _noticeDataFiltersReducer = createReducer(
    initialNoticeDataFiltersState,
    on(changeNoticeDataFilters, (_, a) => ({...a.queryParams, _id: a._id}))
);
export function noticeDataFiltersReducer(state: DynamicQueryPart & WithId, action: Action): DynamicQueryPart & WithId{
    return _noticeDataFiltersReducer(state, action);
}


const  _noticeDataReducer = createReducer(
    initialNoticeDataState,
    on(searchNoticeDataSuccess, (_, a) =>
        Object.assign([...a.result ? a.result : []], { _id: a._id})),
    on(searchNoticeDataError, (_1, a) => Object.assign([], {_id: a._id})),
  );

export function noticeDataReducer(state: NoticeData[] & WithId, action: Action): NoticeData[] & WithId{
    return _noticeDataReducer(state, action);
}


//ADD
const  _sendNoticeDataReducer = createReducer(
    initialNoticeDataState,
    on(sendNoticeDataSuccess, (_, a) =>
        Object.assign([...a.result ? a.result : []], { _id: a._id})),
    on(sendNoticeDataError, (_1, a) => Object.assign([], {_id: a._id})),
  );

export function sendNoticeDataReducer(state: NoticeData[] & WithId, action: Action): NoticeData[] & WithId{
    return _sendNoticeDataReducer(state, action);
}

//DELETE
const  _deleteNoticeDataReducer = createReducer(
    initialNoticeDataState,
    on(deleteNoticeDataSuccess, (_, a) =>
        Object.assign([...a.result ? a.result : []], { _id: a._id})),
    on(deleteNoticeDataError, (_1, a) => Object.assign([], {_id: a._id})),
  );

export function deleteNoticeDataReducer(state: NoticeData[] & WithId, action: Action): NoticeData[] & WithId{
    return _deleteNoticeDataReducer(state, action);
}

//UPDATE
const  _updateNoticeDataReducer = createReducer(
    initialNoticeDataState,
    on(updateNoticeDataSuccess, (state, action) => ({ ...state, _id: action._id, noticeData: action.result })),
    on(updateNoticeDataError, (state, action) => ({ ...state, _id: action._id, error: action.error }))
);

export function updateNoticeDataReducer(state: NoticeData[] & WithId, action: Action): NoticeData[] & WithId{
    return _updateNoticeDataReducer(state, action);
}
