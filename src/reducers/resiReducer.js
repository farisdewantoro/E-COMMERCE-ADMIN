import {
    RESI
} from '../actions/types';


const initialState = {
    loading: false,
    data:{}
}


export default function (state = initialState, action) {
    switch (action.type) {
        case RESI.loading:
            return {
                ...state,
                loading: true
            }
        case RESI.get:
            return{
                ...state,
                loading:false,
                data:action.payload
            }
        default:
            return state;
    }
}