import { DynamicQueryPart, WithId } from "../state";

export interface OfficesData {
    officesId: number;
    officesName: string;
    officesCapacity: number;
    officesType: string;
    userId: string | null;    
    count: number;
}

export const initialOfficesDataState: OfficesData[] & WithId = Object.assign([], {_id: ''});

export const initialOfficesDataFiltersState: DynamicQueryPart & WithId = {_id: ''};
