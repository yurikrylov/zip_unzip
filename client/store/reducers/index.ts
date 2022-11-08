import { combineReducers } from 'redux';
import { tokenReducer } from './tokenReducer';
import { HYDRATE } from 'next-redux-wrapper';


export const rootReducer = combineReducers({
  token: tokenReducer
})

export const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    if (state.count) nextState.count = state.count; // preserve count value on client side navigation
    return nextState;
  } else {
    return rootReducer(state, action);
  }
};

export type RootState = ReturnType<typeof reducer>
