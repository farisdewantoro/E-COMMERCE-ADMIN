import {
    LOADING_SIZING,
    REMOVE_LOADING_SIZING,
    GET_ALL_SIZING,
    EDIT_CURRENT_SIZE,
    SET_SIZING
} from '../actions/types';


const initialState = {
    loading: false,
    sizing:[],
    image:[]
}


export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_SIZING:
            return {
                ...state,
                loading: true
            }
        case SET_SIZING:
            return{
                ...state,
                sizing:action.payload
            }
        case REMOVE_LOADING_SIZING:
            return {
                ...state,
                loading: false
            }
        case GET_ALL_SIZING:
            return{
                ...state,
                loading:false,
                sizing:action.payload
            }
        case EDIT_CURRENT_SIZE:
            return{
                ...state,
                sizing:action.payload.sizing,
                image:action.payload.image
            }
        default:
            return state;
    }
}