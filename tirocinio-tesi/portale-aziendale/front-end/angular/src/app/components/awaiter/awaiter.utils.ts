
import { Store } from '@ngrx/store';
import { AppState } from '../../redux/state';
import { awaitItem } from './../../redux/awaiter/awaiter.actions';

export const CreateAwait: (
  store: Store<AppState>
) => (message: string) => (perc: number) => void = store => message => perc =>
  store.dispatch(awaitItem({ item: { message: message, perc: perc } }));

export type Stopper = () => void;

export function AwaitAndGetStopper(
  store: Store<AppState>,
  message: string = Math.floor(Math.random() * 10000000).toFixed()
): Stopper {
  const f = CreateAwait(store)(message)(0);
  return () => CreateAwait(store)(message)(100);
}
