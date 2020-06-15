
import { baseUrl } from '../config'

const initialState = [];

const LOAD = "pokemon/pokemon/LOAD";

export const load = (pokemon) => ({ type: LOAD, pokemon });

export const loadPokemon = () => async (dispatch) => {
    for (let i = 1; i <= 4; i++) {
        const response = await fetch(`${baseUrl}/pokemon`);
        if (response.ok) {
            const pokemon = await response.json();
            // console.log("inside load pokemon");
            // console.log(pokemon);
            dispatch(load(pokemon));
        };
    };
};

export default function pokeReducer(state = initialState, action) {
    Object.freeze(state);
    if(action.type === LOAD){
        const newState = [...state]
        if(newState.length < 4) {
            newState.push({ pokemon: action.pokemon });
            // console.log("inside of pokeReducer")
            // console.log(newState);
            return newState;
        } else return newState;
    } else return state;
};