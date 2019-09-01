import { LOADING_CATEGORY, 
    GET_ALL_CATEGORY, 
    GET_ALL_CATEGORY_TAG, 
    GET_CATEGORY_WITH_PARAMS, 
    GET_CATEGORY_TYPE_WITH_PARAMS,
    CLEAR_CATEGORY_TYPE,
    GET_CATEGORY_BANNER_CATEGORY,
    GET_CATEGORY_BANNER_CATEGORY_ID,
    GET_CATEGORY_BANNER_TAG,
    GET_CATEGORY_BANNER_TAG_ID,
    GET_CATEGORY_BANNER_TYPE,
    GET_CATEGORY_BANNER_TYPE_ID,
    GET_CATEGORY_BANNER_DEFAULT,
    GET_CATEGORY_BANNER_DEFAULT_ID
} from '../actions/types';

const initialState = {
    loading: false,
    category:[],
    image_desktop:[],
    image_mobile:[],
    image_desktop_promo:[],
    image_mobile_promo:[],
    tag: [],
    type: [],
    default:[]
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_CATEGORY:
            return {
                ...state,
                loading: true
            }
        case GET_CATEGORY_BANNER_DEFAULT:
            return{
                ...state,
                loading: false,
                image_desktop: action.payload.image_desktop,
                image_mobile: action.payload.image_mobile,
                image_desktop_promo: action.payload.image_desktop_promo,
                image_mobile_promo: action.payload.image_mobile_promo,
                default: action.payload.default
            }
        case GET_CATEGORY_BANNER_DEFAULT_ID:
            return{
                ...state,
                loading: false,
                image_desktop: action.payload.image_desktop,
                image_mobile: action.payload.image_mobile,
                image_desktop_promo: action.payload.image_desktop_promo,
                image_mobile_promo: action.payload.image_mobile_promo,
                default: action.payload.default
            }
        case GET_CATEGORY_BANNER_CATEGORY_ID:
            return{
                ...state,
                loading:false,
                image_desktop: action.payload.image_desktop,
                image_mobile: action.payload.image_mobile,
                image_desktop_promo:action.payload.image_desktop_promo,
                image_mobile_promo:action.payload.image_mobile_promo,
                category: action.payload.category
            }
        case GET_CATEGORY_BANNER_TAG_ID:
            return{
                ...state,
                loading:false,
                image_desktop: action.payload.image_desktop,
                image_mobile: action.payload.image_mobile,
                image_desktop_promo: action.payload.image_desktop_promo,
                image_mobile_promo: action.payload.image_mobile_promo,
                tag: action.payload.tag
            }
            
        case GET_CATEGORY_BANNER_TAG:
            return{
                ...state,
                loading: false,
                image_desktop: action.payload.image_desktop,
                image_mobile: action.payload.image_mobile,
                image_desktop_promo: action.payload.image_desktop_promo,
                image_mobile_promo: action.payload.image_mobile_promo,
                tag: action.payload.tag
            }
        case GET_CATEGORY_BANNER_TYPE:
            return {
                ...state,
                loading: false,
                image_desktop: action.payload.image_desktop,
                image_mobile: action.payload.image_mobile,
                image_desktop_promo: action.payload.image_desktop_promo,
                image_mobile_promo: action.payload.image_mobile_promo,
                type: action.payload.type
            }
        case GET_CATEGORY_BANNER_TYPE_ID:
            return{
                ...state,
                loading: false,
                image_desktop: action.payload.image_desktop,
                image_mobile: action.payload.image_mobile,
                image_desktop_promo: action.payload.image_desktop_promo,
                image_mobile_promo: action.payload.image_mobile_promo,
                type: action.payload.type
            }
        case GET_CATEGORY_BANNER_CATEGORY:
            return{
                ...state,
                loading:false,
                image_desktop:action.payload.image_desktop,
                image_mobile:action.payload.image_mobile,
                image_desktop_promo: action.payload.image_desktop_promo,
                image_mobile_promo: action.payload.image_mobile_promo,
                category:action.payload.category
            }
        case GET_ALL_CATEGORY_TAG:
            return {
                ...state,
                loading: false,
                tag: action.payload
            }
        case CLEAR_CATEGORY_TYPE:
            return{
                ...state,
                type:[]
            }
        case GET_CATEGORY_WITH_PARAMS:
            return {
                ...state,
                loading: false,
                type: action.payload.type,
                category: action.payload.category[0]
            }
        case GET_ALL_CATEGORY:
            return {
                ...state,
                loading: false,
                category: action.payload
            }
        case GET_CATEGORY_TYPE_WITH_PARAMS:
            return {
                ...state,
                loading: false,
                type: action.payload
            }

        default:
            return state;
    }
}