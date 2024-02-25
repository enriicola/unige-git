import { Filtering } from "./redux/state";

export type Empty<T> = null | undefined;
export type Full<T> = { value: T };
export type Maybe<T> = Full<T> | Empty<T>;

export const empty: <T>() => Empty<T> = () => null;
export const from: <T>(value: T) => Maybe<T> = (value) => value ? { value } : empty();

export function isEmpty<T>(mb: Maybe<T>): boolean {
// export function isEmpty<T>(mb: Maybe<T>): mb is Empty<T> {
    return mb === null || mb === undefined;
}
export function hasValue<T>(mb: Maybe<T>): mb is Full<T> {
    return mb !== null && mb !== undefined && mb['value'] !== undefined;
}

export function formatDate(date: Date): string {
    return date.toISOString();
}

export const addOrReplaceBetweenDatesFilter: <T>(startDateColumn: keyof T, stopDateColumn: keyof T)
                                             => (startValue: string, stopValue: string, filtering?: Filtering[]) => Filtering[]
                                           = (startDateColumn, stopDateColumn) =>
                                             (startValue: string, stopValue: string,filtering?: Filtering[]) =>
{
  return [
      ...(filtering && filtering.length > 0 ? filtering.filter(f => f.column !== startDateColumn && f.column !== stopDateColumn) : []),
      { column: startDateColumn, kind: 'DATE', predicate: 'GE', value: startValue, prefix: ''} as Filtering,
      { column: stopDateColumn, kind: 'DATE', predicate: 'LE', value: stopValue, prefix: ''} as Filtering
  ];
}

export const addOrReplaceGEDateFilter: <T>(startDateColumn: keyof T, stopDateColumn: keyof T) => (startValue: string, filtering?: Filtering[]) => Filtering[]
                                    = (startDateColumn, stopDateColumn) => (startValue, filtering) =>
{
    return [
        ...(filtering && filtering.length > 0 ? filtering.filter(f => f.column !== startDateColumn && f.column !== stopDateColumn ) : []),
        { column: startDateColumn, kind: 'DATE', predicate: 'GE', value: startValue, prefix: ''} as Filtering
    ];
}

export const addOrReplaceLEDateFilter: <T>(startDateColumn: keyof T, stopDateColumn: keyof T) => (startValue: string, filtering?: Filtering[]) => Filtering[]
                                     = (startDateColumn, stopDateColumn) => (startValue, filtering) =>
{
    return [
        ...(filtering && filtering.length > 0 ? filtering.filter(f => f.column !== startDateColumn && f.column !== stopDateColumn) : []),
        { column: stopDateColumn, kind: 'DATE', predicate: 'LE', value: startValue, prefix: ''} as Filtering
    ];
}
