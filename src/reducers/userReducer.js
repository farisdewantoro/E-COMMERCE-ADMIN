import { USER} from '../actions/types';
const initialState = {
    user:[],
    loading:false,
    pagination:{}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case USER.getAll:
            return{
                ...state,
                user:action.payload.users,
                pagination: action.payload.pagination,
                loading:false
            }
        case USER.loading:
            return{
                ...state,
                loading:true
            }
        default:
            return state;
    }
}