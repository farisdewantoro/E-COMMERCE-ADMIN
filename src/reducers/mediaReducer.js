import { MEDIA } from '../actions/types';
const initialState = {
    loading:false,
    file_image:[],
    loading_percent:0,
    media_list:[],
    pagination:{},
    loading_process:false
};



export default function (state = initialState, action) {
   
    switch (action.type) {
        case MEDIA.removeLoading:
            return{
                ...state,
                loading:false,
                loading_process:false,
                loading_percent: 0
            }
        case MEDIA.loadingProcess:
            return{
                ...state,
                loading_process:true
            }
        case MEDIA.delete:
            return{
                ...state,
                loading:false,
                media_list: state.media_list.filter(a => action.payload.image_normal.indexOf(a.link) === -1)
            }
        case MEDIA.loading:
            return{
                ...state,
                loading_process: false,
                loading:true,
                
            }
        case MEDIA.loading_percent:
            return{
                ...state,
                loading_percent:action.payload
            }
        case MEDIA.success:
            return{
                ...state,
                loading:false,
                loading_percent:0,
                loading_process:false,
                media_list: action.payload.concat(state.media_list)
            }
        case MEDIA.getMedia:
            return{
                ...state,
                media_list:action.payload.listFile,
                pagination:action.payload.pagination
            }
            
        default:
            return state;
    }
}