import { GET_ALL_COLLECTION, LOADING_COLLECTION, EDIT_COLLECTION, CLEAR_COLLECTION, SET_COLLECTION } from '../actions/types';
const initialState = {
    loading: false,
    collection: [],
    collection_image: [],
    collection_image_mobile:[]
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_COLLECTION:
            return {
                ...state,
                loading: true
            }
        case GET_ALL_COLLECTION:
            return {
                ...state,
                collection: action.payload,
                loading: false
            }
        case EDIT_COLLECTION:
            return {
                ...state,
                loading: false,
                collection: action.payload.collection,
                collection_image: action.payload.collection_image ? action.payload.collection_image : [],
                collection_image_mobile: action.payload.collection_image_mobile ? action.payload.collection_image_mobile : [] ,
            }
        case CLEAR_COLLECTION:
            return {
                ...state,
                loading: false,
                collection: [],
                collection_image: [],
                collection_image_mobile: []
            }
        case SET_COLLECTION:
            return{
                ...state,
                loading:false,
                collection:action.payload
            }
        default:
            return state;
    }
}