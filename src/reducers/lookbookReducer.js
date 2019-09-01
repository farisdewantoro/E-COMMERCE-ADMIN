import { GET_ALL_LOOKBOOK, LOADING_LOOKBOOK, EDIT_LOOKBOOK, CLEAR_LOOKBOOK } from '../actions/types';
const initialState = {
    loading:false,
    lookbook:[],
    lookbook_image:[]
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_LOOKBOOK:
            return{
                ...state,
                loading:true
            }
        case GET_ALL_LOOKBOOK:
            return {
                ...state,
                lookbook:action.payload,
                loading:false
            }
        case EDIT_LOOKBOOK:
            return{
                ...state,
                loading:false,
                lookbook:action.payload.lookbooks,
                lookbook_image:action.payload.lookbook_image
            }
        case CLEAR_LOOKBOOK:
            return{
                ...state,
                loading:false,
                lookbook:[],
                lookbook_image:[]
            }
        default:
            return state;
    }
}