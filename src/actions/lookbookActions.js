import axios from 'axios';
import { GET_ALL_LOOKBOOK, LOADING_LOOKBOOK, GET_ERRORS, EDIT_LOOKBOOK, CLEAR_LOOKBOOK} from './types';
import {setNotification} from './notifActions';

export const loadingLookbook = ()=>{
    return{
        type: LOADING_LOOKBOOK
    }
}

export const createNewLookbook = (data,history)=>disbatch=>{
    disbatch(loadingLookbook());
    axios.post('/api/lookbook/create',data)
        .then(res=>{
            disbatch(setNotification(res.data.notification));
            history.push('/lookbook');
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
            disbatch(loadingLookbook());
            disbatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            disbatch(setNotification(notification));
        })
}

export const editLookbook = (data) => disbatch=>{
    disbatch(loadingLookbook());
    axios.get('/api/lookbook/edit/'+data)
        .then(res=>{
            disbatch({
                type: EDIT_LOOKBOOK,
                payload:res.data
            })
            
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
            disbatch(loadingLookbook());
            disbatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            disbatch(setNotification(notification));
        })
}

export const updateLookbook = (id,data,history) =>disbatch=>{
    disbatch(loadingLookbook());
    axios.put('/api/lookbook/update/'+id,data)
        .then(res => {
            disbatch(setNotification(res.data.notification));
            history.push('/lookbook');
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
            disbatch(loadingLookbook());
            disbatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            disbatch(setNotification(notification));
        })
}

export const deleteLookbook = (data)=>disbatch=>{
    disbatch(loadingLookbook());
    axios.delete('/api/lookbook/delete',{data:data})
        .then(res => {
            if(res.data.data){
                disbatch({
                    type: GET_ALL_LOOKBOOK,
                    payload: res.data.data
                })
            } else {
                disbatch(clearLookbook());
            }
            
            if (res.data.notification){
                disbatch(setNotification(res.data.notification));
            }
          
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
            disbatch(loadingLookbook());
            disbatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            disbatch(setNotification(notification));
        })
}

export const getAllLookbook = ()=>disbatch=>{
    disbatch(loadingLookbook());
    axios.get('/api/lookbook/getall')
        .then(res=>{
            disbatch({
                type:GET_ALL_LOOKBOOK,
                payload:res.data
            })
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
            disbatch(loadingLookbook());
            disbatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            disbatch(setNotification(notification));
        })

}

export const clearLookbook = ()=>{
    return{
        type: CLEAR_LOOKBOOK
    }
}