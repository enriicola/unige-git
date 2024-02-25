import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DynamicQueryPart, WithId } from "../state";
import { NoticeData } from "./notice.state";

export const selectNoticeDataState = createFeatureSelector<NoticeData[]>('noticeData');
export const selectNoticeDataFiltersState = createFeatureSelector<DynamicQueryPart>('noticeDataFilters');

export const selectNoticeData = createSelector(selectNoticeDataState, (state: NoticeData[] & WithId) => state);
export const selectNoticeDataFilters = createSelector(selectNoticeDataFiltersState, (state: DynamicQueryPart & WithId) => state);
