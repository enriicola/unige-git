import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DynamicQueryPart, WithId } from "../state";
import { OfficesData } from "./offices.state";

export const selectOfficesDataState = createFeatureSelector<OfficesData[]>('officesData');
export const selectOfficesDataFiltersState = createFeatureSelector<DynamicQueryPart>('officesDataFilters');

export const selectOfficesData = createSelector(selectOfficesDataState, (state: OfficesData[] & WithId) => state);
export const selectOfficesDataFilters = createSelector(selectOfficesDataFiltersState, (state: DynamicQueryPart & WithId) => state);
