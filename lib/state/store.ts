import {
  combineReducers,
  applyMiddleware,
  Middleware,
  createStore,
  Store,
} from 'redux';
import { StateType } from 'typesafe-actions';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createWrapper, MakeStore } from 'next-redux-wrapper';

// application
import container from '@infra/container';
import reducers from './reducers';
import { FirstArgType } from './types';

export const rootReducer = combineReducers(reducers);

const bindMiddleware = (...middleware: Middleware[]) => {
  if (process.env.NODE_ENV !== 'production') {
    return composeWithDevTools(applyMiddleware(...middleware));
  }

  return applyMiddleware(...middleware);
};

// define RootState type
export type RootState = StateType<typeof rootReducer>;

export const makeStore: MakeStore<Store<RootState>> = () =>
  createStore(rootReducer, bindMiddleware(thunk.withExtraArgument(container)));

export const store: Store<RootState> = createStore(
  rootReducer,
  bindMiddleware(thunk)
);

export const wrapper = createWrapper<Store<RootState>>(makeStore);

export type GetServerSidePropsContext = FirstArgType<
  FirstArgType<typeof wrapper.getServerSideProps>
>;
