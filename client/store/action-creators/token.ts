import { TokenAction, TokenActionTypes } from '../../types/token';


export const setToken = (token:string): TokenAction => {
  return {type: TokenActionTypes.SET, payload: token}
}
