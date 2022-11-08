import { TokenActionTypes, TokenState } from '../../types/token';


const initialState: TokenState = {
  token: ''
}

export function tokenReducer(state=initialState, action) {
  switch (action.type) {
    case TokenActionTypes.SET:
      return {...state, token: action.payload}
    default:
      return state
  }
}

