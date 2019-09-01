import { EDIT_SLIDER_HOME} from '../actions/types';
const initialState = {
    home_image:{
        image_desktop:[],
        image_mobile:[]
    }
};

export default function (state = initialState, action) {
    switch (action.type) {
        case EDIT_SLIDER_HOME:
            return{
                ...state,
                home_image:{
                    image_desktop: action.payload.image_desktop,
                    image_mobile: action.payload.image_mobile
                }
          
            }
        default:
            return state;
    }
}