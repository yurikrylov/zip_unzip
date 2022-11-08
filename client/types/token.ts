export interface TokenState {
    token: string;
}

export enum TokenActionTypes {
    SET = 'SET'
}

interface SetToken {
    type: TokenActionTypes.SET
    payload: string;
}

export type TokenAction =
    SetToken;
