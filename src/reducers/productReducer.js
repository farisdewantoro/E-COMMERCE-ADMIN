import { CREATE_PRODUCT, LOADING_PRODUCT, STOP_LOADING_PRODUCT, SET_PRODUCT, PRODUCT_EDIT, CREATE_DISCOUNT} from '../actions/types';
const initialState = {
    loading: false,
    product: null,
    product_variant:null,
    product_attribute:[],
    product_discount:null,
    product_category:null,
    product_image:[],
    status:null,
    product_size:[]
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_PRODUCT:
            return {
                ...state,
                loading: true
            }
        case STOP_LOADING_PRODUCT:
            return{
                ...state,
                loading:false
            }
        case PRODUCT_EDIT:
            return{
                ...state,
                loading:false,
                product:action.payload.product,
                product_variant:action.payload.product_variant,
                product_attribute:action.payload.product_attribute,
                product_discount:action.payload.product_discount,
                product_category:action.payload.product_category,
                product_image:action.payload.product_image,
                product_size:action.payload.product_size
            }
        case SET_PRODUCT:
            return{
                ...state,
                loading:false,
                product:action.payload
            }
        case CREATE_PRODUCT:
            return {
                ...state,
                loading: false,
                status:action.payload
            }
        case CREATE_DISCOUNT:
            return{
                ...state,
                loading:false,
                status: action.payload
            }
        default:
            return state;
    }
}