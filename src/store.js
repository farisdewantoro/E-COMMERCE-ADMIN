import { createStore, applyMiddleware,compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { setCSRF} from './utils/setCSRF';
const initialState={};

const middleware = [thunk, setCSRF];

const store = createStore(rootReducer,initialState,
    composeWithDevTools(
        applyMiddleware(...middleware)
        )   
    );


export default store;