import { createReducer, on, Action } from "@ngrx/store";
import { CoursesData, initialCoursesDataState as initialCoursesDataState, initialCoursesDataFiltersState as initialCoursesDataFiltersState } from "./courses.state";
import { DynamicQueryPart, WithId } from "../state";
import { addCoursesDataError, addCoursesDataSuccess, changeCoursesDataFilters, deleteCoursesDataError, deleteCoursesDataSuccess, searchCoursesDataError, searchCoursesDataSuccess, updateCoursesDataError, updateCoursesDataSuccess } from "./courses.actions";


//search filters CourseData
const _coursesDataFiltersReducer = createReducer(
    initialCoursesDataFiltersState,
    on(changeCoursesDataFilters, (_, a) => ({...a.queryParams, _id: a._id}))
);
export function coursesDataFiltersReducer(state: DynamicQueryPart & WithId, action: Action): DynamicQueryPart & WithId{
    return _coursesDataFiltersReducer(state, action);
}


const  _coursesDataReducer = createReducer(
    initialCoursesDataState,
    on(searchCoursesDataSuccess, (_, a) =>
        Object.assign([...a.result ? a.result : []], { _id: a._id})),
    on(searchCoursesDataError, (_1, a) => Object.assign([], {_id: a._id})),
  );

export function coursesDataReducer(state: CoursesData[] & WithId, action: Action): CoursesData[] & WithId{
    return _coursesDataReducer(state, action);
}

//ADD
const  _addCoursesDataReducer = createReducer(
    initialCoursesDataState,
    on(addCoursesDataSuccess, (_, a) =>
        Object.assign([...a.result ? a.result : []], { _id: a._id})),
    on(addCoursesDataError, (_1, a) => Object.assign([], {_id: a._id})),
  );

export function addCoursesDataReducer(state: CoursesData[] & WithId, action: Action): CoursesData[] & WithId{
    return _addCoursesDataReducer(state, action);
}

//DELETE
const  _deleteCoursesDataReducer = createReducer(
    initialCoursesDataState,
    on(deleteCoursesDataSuccess, (_, a) =>
        Object.assign([...a.result ? a.result : []], { _id: a._id})),
    on(deleteCoursesDataError, (_1, a) => Object.assign([], {_id: a._id})),
  );

export function deleteCoursesDataReducer(state: CoursesData[] & WithId, action: Action): CoursesData[] & WithId{
    return _deleteCoursesDataReducer(state, action);
}

//UPDATE
const  _updateCoursesDataReducer = createReducer(
    initialCoursesDataState,
    on(updateCoursesDataSuccess, (state, action) => ({ ...state, _id: action._id, coursesData: action.result })),
    on(updateCoursesDataError, (state, action) => ({ ...state, _id: action._id, error: action.error }))
);

export function updateCoursesDataReducer(state: CoursesData[] & WithId, action: Action): CoursesData[] & WithId{
    return _updateCoursesDataReducer(state, action);
}
