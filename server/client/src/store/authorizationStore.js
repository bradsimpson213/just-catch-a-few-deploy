import { baseUrl } from '../config';

const TOKEN_KEY = 'pokemon/authentication/TOKEN_KEY';
const SET_TOKEN = 'pokemon/authentication/SET_TOKEN';
const REMOVE_TOKEN = 'pokemon/authentication/REMOVE_TOKEN';


export const removeToken = token => ({ type: REMOVE_TOKEN });
export const setToken = token => ({ type: SET_TOKEN, token });

export const loadToken = () => async dispatch => {
    const token = window.localStorage.getItem('TOKEN_KEY');
    if (token) {
        dispatch(setToken(token));
    }
};

export const login = (userName, password) => async dispatch => {
  
    const response = await fetch(`${baseUrl}/users/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, password }),
    });

    if (response.ok) {
        const { token, user } = await response.json();
        console.log(user)
        window.localStorage.setItem('TOKEN_KEY', token);
        window.localStorage.setItem('USER_INFO', JSON.stringify(user) );
        dispatch(setToken(token));
    }
};

// export const logout = () => async (dispatch, getState) => {
//     const { authentication: { token } } = getState();
//     const response = await fetch(`${baseUrl}/session`, {
//         method: 'delete',
//         headers: { Authorization: `Bearer ${token}` },
//     });

//     if (response.ok) {
//         window.localStorage.removeItem(TOKEN_KEY);
//         dispatch(removeToken());
//     }
// }

export default function authReducer(state = {}, action) {
    switch (action.type) {
        case SET_TOKEN: {
            return {
                ...state,
                token: action.token,
            };
        }

        case REMOVE_TOKEN: {
            const newState = { ...state };
            delete newState.token;
            return newState;
        }

        default: return state;
    }
}