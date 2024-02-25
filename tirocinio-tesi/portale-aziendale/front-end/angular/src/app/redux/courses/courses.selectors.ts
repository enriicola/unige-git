import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DynamicQueryPart, WithId } from "../state";
import { CoursesData } from "./courses.state";

export const selectCoursesDataState = createFeatureSelector<CoursesData[]>('coursesData');
export const selectCoursesDataFiltersState = createFeatureSelector<DynamicQueryPart>('coursesDataFilters');

export const selectCoursesData = createSelector(selectCoursesDataState, (state: CoursesData[] & WithId) => state);
export const selectCoursesDataFilters = createSelector(selectCoursesDataFiltersState, (state: DynamicQueryPart & WithId) => state);
