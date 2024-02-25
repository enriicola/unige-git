export interface AwaiterItem {
  message: string;
  perc: number;
}

export interface AwaiterState {
  items: AwaiterItem[];
}

export const initialAwaiterState: AwaiterState = { items: [] };
