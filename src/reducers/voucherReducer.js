import {GET_ALL_VOUCHER_TYPE,
    GET_ALL_VOUCHER,LOADING_VOUCHER,
    EDIT_VOUCHER
    ,REMOVE_LOADING_VOUCHER} from '../actions/types';


const initialState={
    loading:false,
    voucher_type:[],
    voucher:[]
}


export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_VOUCHER:
            return{
                ...state,
                loading:true
            }
        case EDIT_VOUCHER:
            return{
                ...state,
                loading:false,
                voucher:action.payload
            }
        case GET_ALL_VOUCHER:
            return{
                ...state,
                loading:false,
                voucher:action.payload
            }
        case GET_ALL_VOUCHER_TYPE:
            return{
                ...state,
                loading:false,
                voucher_type:action.payload
            }
        case REMOVE_LOADING_VOUCHER:
            return {
                ...state,
                loading:false
            }
        default:
            return state;
    }
}