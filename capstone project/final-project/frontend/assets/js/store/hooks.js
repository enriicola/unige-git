// Use throughout your app instead of plain `useDispatch` and `useSelector`
import { useDispatch, useSelector, useStore } from 'react-redux';

export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
export const useAppStore = useStore;
