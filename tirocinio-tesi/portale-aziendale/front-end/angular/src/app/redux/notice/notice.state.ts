import { DynamicQueryPart, WithId } from "../state";

export interface NoticeData {
    noticeId: number;
    noticeState: boolean;
    noticeDateTime: string;
    noticeTitle: string;
    noticeObject: string;
    noticeDesc: string;
    userId: string | null;
    count: number;
}

export const initialNoticeDataState: NoticeData[] & WithId = Object.assign([], {_id: ''});

export const initialNoticeDataFiltersState: DynamicQueryPart & WithId = {_id: ''};
