import { useCallback } from 'react';
import { useSelector, TypedUseSelectorHook, useDispatch } from 'react-redux';
import { RootState } from './store';
import { Fn, ThunkActionFn, ThunkReturnType } from '@state/types';

export function useAppAction<T extends Fn>(
  action: T
): (
  ...args: Parameters<T>
) => T extends ThunkActionFn ? ThunkReturnType<T> : ReturnType<T> {
  const dispatch = useDispatch();

  return useCallback((...args: Parameters<T>) => dispatch(action(...args)), []);
}

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
