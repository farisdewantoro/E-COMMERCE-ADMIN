import { LOADING_SIZING, 
    REMOVE_LOADING_SIZING,
     GET_ERRORS, REMOVE_ERRORS,
      GET_ALL_SIZING, 
      EDIT_CURRENT_SIZE,
    SET_SIZING} from './types';
import {setNotification} from './notifActions';
import axios from 'axios';

export const setSizing = (data)=>{
    return{
        type: SET_SIZING,
        payload:data
    }
}
export const submitCreateSize = (data,history)=>disbatch=>{
    disbatch(loadingSizing());
    axios.post('/api/sizing/create',data)
        .then(res=>{
            disbatch(setNotification(res.data.notification));
            history.push('/sizing');
            disbatch({
                type: REMOVE_ERRORS
            })
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }

            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            disbatch(setNotification(notification));
            disbatch(removeLoadingSizing());
        })
}

export const submitUpdateSize = (id,data, history) => disbatch => {
    disbatch(loadingSizing());
    axios.put('/api/sizing/update/'+id, data)
        .then(res => {
            disbatch(setNotification(res.data.notification));
            history.push('/sizing');
            disbatch({
                type: REMOVE_ERRORS
            })
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }

            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            disbatch(setNotification(notification));
            disbatch(removeLoadingSizing());
        })
}



export const getAllSize = ()=>disbatch=>{
    axios.get('/api/sizing/getall')
        .then(res=>{
            disbatch({
                type: GET_ALL_SIZING,
                payload:res.data
            })
        }).catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }

            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            disbatch(setNotification(notification));
            disbatch(removeLoadingSizing());
        })
}

export const editSizing = (id) => disbatch => {
    axios.get('/api/sizing/get/'+id)
        .then(res => {
            disbatch({
                type: EDIT_CURRENT_SIZE,
                payload: res.data
            })
        }).catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }

            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            disbatch(setNotification(notification));
            disbatch(removeLoadingSizing());
        })
}

export const deleteSizing = (id,history)=>disbatch=>{
    axios.delete('/api/sizing/delete/'+id)
        .then(res=>{
            disbatch(setNotification(res.data.notification));
            history.push('/sizing');
            disbatch({
                type: REMOVE_ERRORS
            })
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }

            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            disbatch(setNotification(notification));
            disbatch(removeLoadingSizing());
        })
}
export const loadingSizing = ()=>{
    return{
        type: LOADING_SIZING
    }
}

export const removeLoadingSizing =()=>{
    return{
        type: REMOVE_LOADING_SIZING
    }
}