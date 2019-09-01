import { AUTH_SET_ADMIN, LOADING_AUTH_ADMIN, AUTH_ADMIN_LOGOUT, STOP_LOADING_AUTH} from '../actions/types';
import isEmpty from '../validation/is-empty'
const initialState = {
    loading: false,
    isAuthenticated: false,
    admin: {},
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_AUTH_ADMIN:
            return {
                ...state,
                loading: true
            }
        case STOP_LOADING_AUTH:
        return{
            ...state,
            loading:false
        }
        case AUTH_ADMIN_LOGOUT:
            return{
                ...state,
                loading:false,
                isAuthenticated:false,
                admin:{}
            }
        case AUTH_SET_ADMIN:
            return {
                ...state,
                loading: false,
                isAuthenticated:!isEmpty(action.payload),
                admin: action.payload
            }

        default:
            return state;
    }
}