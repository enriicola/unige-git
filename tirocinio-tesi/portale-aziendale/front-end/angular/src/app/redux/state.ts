import {AwaiterState} from './awaiter/awaiter.state';
import {MessagesState} from './message/message.state';
import {NoticeData} from './notice/notice.state';
import {OfficesData} from './offices/offices.state';

import {CoursesData} from './courses/courses.state';

export interface WithId {
    _id: string;
}

type FilterPredicate =
    /*EQUALS*/                  'EQ' |
    /*NOT_EQUALS*/              'NE' |
    /*LESSER_THAN*/             'LT' |
    /*GREATER_THAN*/            'GT' |
    /*LESSER_OR_EQUALS_TO*/     'LE' |
    /*GREATER_OR_EQUALS_TO*/    'GE' |
    /*LIKE*/                    'LK' |
    /*IN*/                      'IN' |
    /*IS_NULL*/                 'NL' |
    /*IS_NOT_NULL*/             'NN';

type ValueKind = 'BOOL' | 'INTEGER' | 'FLOAT' | 'STRING' | 'DATE' | 'ARRAYINT' | 'ARRAYSTRING';

export function getFilter(property: string, value: unknown, predicate: FilterPredicate): Filtering {
    return {
        column: property,
        kind: typeof(value) === 'string' ? 'STRING' :
              typeof(value) === 'number' && Number.isSafeInteger(value) ? 'INTEGER' :
              typeof(value) === 'number' ? 'FLOAT' :
              value instanceof Date ? 'DATE' :
              Array.isArray(value) && typeof(value[0]) === 'string' ? 'ARRAYSTRING' : 'ARRAYINT',
        predicate: predicate,
        prefix: '',
        value: value+''
    };
}
export function getFilters(x: unknown, predicate: FilterPredicate): Filtering[] {
    return Object.keys(x).map(p => getFilter(p, x[p], predicate));
}

export interface DynamicQueryPart {
    ordering?: Ordering[];
    paging?: Paging;
    filtering?: Filtering[];
}

export interface Ordering {
    column: string;
    descending: boolean;
    columnPrefix: string;
}

export interface Paging {
    skip: number;
    take: number;
}

export interface Filtering {
    column: string;
    predicate: FilterPredicate;
    kind: ValueKind;
    value: string;
    prefix: string;
}

export interface AppState {
    awaiter: AwaiterState;
    messages: MessagesState;

    noticeData: NoticeData[] & WithId;
    noticeDataFilters: DynamicQueryPart & WithId;

    officesData: OfficesData[] & WithId;
    officesDataFilters: DynamicQueryPart & WithId;

    coursesData: CoursesData[] & WithId;
    coursesDataFilters: DynamicQueryPart & WithId;
}
