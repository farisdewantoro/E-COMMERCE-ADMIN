import { GET_ALL_ORDER, LOADING_ORDER, GET_ORDER_BY_ID, REMOVE_LOADING } from '../actions/types';
const initialState = {
    loading:false,
    detail:false,
    order:[],
    order_item:[],
    order_shipment:[],
    order_billing:[],
    order_voucher:[],
    order_payment:[],
    order_resi:[],
    pagination:{}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case REMOVE_LOADING:
            return{
                ...state,
                loading:false
            }
        case LOADING_ORDER:
            return{
                ...state,
                loading:true
            }
        case GET_ALL_ORDER:
            return {
                ...state,
                order:action.payload.orders,
                pagination:action.payload.pagination,
                loading:false,
                detail:false
            }
        case GET_ORDER_BY_ID:
            return{
                ...state,
                detail:true,
                loading: false,
                order: action.payload.orders,
                order_item: action.payload.order_item,
                order_voucher: action.payload.order_voucher,
                order_shipment: action.payload.order_shipment,
                order_billing: action.payload.order_billing,
                order_payment: action.payload.order_payment,
                order_resi:action.payload.order_resi,
                order_confirm:action.payload.order_confirm
            }
        default:
            return state;
    }
}