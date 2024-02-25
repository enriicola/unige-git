import { DynamicQueryPart, WithId } from "../state";

export interface CoursesData {
    coursesId: number;
    coursesName: string;
    coursesCapacity: number;
    coursesType: string;
    coursesDate: string;
    count: number;
}

export const initialCoursesDataState: CoursesData[] & WithId = Object.assign([], {_id: ''});

export const initialCoursesDataFiltersState: DynamicQueryPart & WithId = {_id: ''};
