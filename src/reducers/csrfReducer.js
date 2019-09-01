import { SET_CSRF } from '../actions/types';
const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_CSRF:
            return action.payload;

        default:
            return state;
    }
}