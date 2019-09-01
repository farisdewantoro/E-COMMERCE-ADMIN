import axios from 'axios';

// export default setCSRF;
export const setCSRF = store => next => action => {
    let csrf = store.getState();
    if(csrf.token){
        axios.defaults.headers.common['csrf-token'] = csrf.token;
    }
    return next(action)
}