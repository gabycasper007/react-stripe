import { applyMiddleware, compose, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const __DEV__ = process.env.NODE_ENV !== 'production';

// Declare initial Redux state
const initialState = {};

// Declare list of middlewares
const middleware = [thunk];

if (__DEV__) {
  middleware.push(logger);
}

export const store = createStore(
  rootReducer,
  initialState,
  compose(applyMiddleware(...middleware))
);
