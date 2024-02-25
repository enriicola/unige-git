import { createReducer, on, Action } from "@ngrx/store";
import { OfficesData, initialOfficesDataState as initialOfficesDataState, initialOfficesDataFiltersState as initialOfficesDataFiltersState } from "./offices.state";
import { DynamicQueryPart, WithId } from "../state";
import { addOfficesDataError, addOfficesDataSuccess, changeOfficesDataFilters, deleteOfficesDataError, deleteOfficesDataSuccess, searchOfficesDataError, searchOfficesDataSuccess, updateOfficesDataError, updateOfficesDataSuccess } from "./offices.actions";


//search filters OfficeData
const _officesDataFiltersReducer = createReducer(
    initialOfficesDataFiltersState,
    on(changeOfficesDataFilters, (_, a) => ({...a.queryParams, _id: a._id}))
);
export function officesDataFiltersReducer(state: DynamicQueryPart & WithId, action: Action): DynamicQueryPart & WithId{
    return _officesDataFiltersReducer(state, action);
}


const  _officesDataReducer = createReducer(
    initialOfficesDataState,
    on(searchOfficesDataSuccess, (_, a) =>
        Object.assign([...a.result ? a.result : []], { _id: a._id})),
    on(searchOfficesDataError, (_1, a) => Object.assign([], {_id: a._id})),
  );

export function officesDataReducer(state: OfficesData[] & WithId, action: Action): OfficesData[] & WithId{
    return _officesDataReducer(state, action);
}

//ADD
const  _addOfficesDataReducer = createReducer(
    initialOfficesDataState,
    on(addOfficesDataSuccess, (_, a) =>
        Object.assign([...a.result ? a.result : []], { _id: a._id})),
    on(addOfficesDataError, (_1, a) => Object.assign([], {_id: a._id})),
  );

export function addOfficesDataReducer(state: OfficesData[] & WithId, action: Action): OfficesData[] & WithId{
    return _addOfficesDataReducer(state, action);
}

//DELETE
const  _deleteOfficesDataReducer = createReducer(
    initialOfficesDataState,
    on(deleteOfficesDataSuccess, (_, a) =>
        Object.assign([...a.result ? a.result : []], { _id: a._id})),
    on(deleteOfficesDataError, (_1, a) => Object.assign([], {_id: a._id})),
  );

export function deleteOfficesDataReducer(state: OfficesData[] & WithId, action: Action): OfficesData[] & WithId{
    return _deleteOfficesDataReducer(state, action);
}

//UPDATE
const  _updateOfficesDataReducer = createReducer(
    initialOfficesDataState,
    on(updateOfficesDataSuccess, (state, action) => ({ ...state, _id: action._id, officesData: action.result })),
    on(updateOfficesDataError, (state, action) => ({ ...state, _id: action._id, error: action.error }))
);

export function updateOfficesDataReducer(state: OfficesData[] & WithId, action: Action): OfficesData[] & WithId{
    return _updateOfficesDataReducer(state, action);
}
