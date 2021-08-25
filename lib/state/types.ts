import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { Action } from 'redux';
import { AwilixContainer } from 'awilix';

import { Cradle } from '@infra/container';
import { RootState } from './store';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  AwilixContainer<Cradle>,
  Action<string>
>;

export type AppThunkDispatch = ThunkDispatch<
  RootState,
  AwilixContainer<Cradle>,
  Action<string>
>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-undef
export type FirstArgType<T> = T extends (arg: infer B) => any ? B : never;

export type AppAction<A extends Action, T = any> = ThunkAction<
  T,
  RootState,
  unknown,
  A
>;

export type Fn<R = any> = (...args: any[]) => R;

export type ThunkActionFn = Fn<ThunkAction<any, any, any, any>>;

export type ThunkReturnType<
  T extends (...args: any[]) => ThunkAction<any, any, any, any>
> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-undef
  T extends (...args: any[]) => ThunkAction<infer R, any, any, any> ? R : any;
