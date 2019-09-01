import { EDIT_SLIDER_HOME, GET_ERRORS} from './types';
import axios from 'axios';
import {setNotification} from './notifActions';

export const updateSliderHome = (data,history)=>disbatch=>{
    axios.post('/api/slider/update',data)
        .then(res=>{
            if(res.data.data){
                disbatch({
                    type: EDIT_SLIDER_HOME,
                    payload: res.data.data
                })
            }
            if(res.data.notification){
                disbatch(setNotification(res.data.notification));
            }
            history.push('/home-slider');
        
        })
           .catch (err=> {
    if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
        return window.location.href = "/sign-in";
        localStorage.clear();
    }

    if(err.response.data.notification){
        disbatch(setNotification(err.response.data.notification));
    }
    if (err.response.data.errors) {
        disbatch({
            type: GET_ERRORS,
            payload: err.response.data.errors
        })
    }
})
}

export const getSliderHome = ()=>disbatch=>{
    axios.get('/api/slider/get')
        .then(res => {
            disbatch({
                type: EDIT_SLIDER_HOME,
                payload: res.data
            })
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
            if (err.response.data.errors) {
                disbatch({
                    type: GET_ERRORS,
                    payload: err.response.data.errors
                })
            }
        })
}