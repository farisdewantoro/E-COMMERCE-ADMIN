import axios from 'axios';
import { AUTH_SET_ADMIN, GET_ERRORS, LOADING_AUTH_ADMIN, STOP_LOADING_AUTH, AUTH_ADMIN_LOGOUT} from './types';
import jwt_decode from 'jwt-decode';
import jwt from 'jsonwebtoken';
import {setNotification} from './notifActions';

export const setAuthAdmin = (data)=>disbatch=>{
    disbatch(loadingAuth());
    axios.post('/api/auth/login',data)
        .then(res=>{
            localStorage.setItem('hammerauth',res.data);
            const decoded = jwt_decode(res.data);
            disbatch(setCurrentAdmin(decoded.user))
        })
        .catch(err=>{
            localStorage.clear();
            disbatch(removeLoading());
            disbatch({
                type: GET_ERRORS,
                payload:err.response.data
            });
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            disbatch(setNotification(notification));
            disbatch(logoutAdmin());
        })
}

export const logoutAuthAdmin = ()=>disbatch=>{
    axios.post('/api/auth/logout')
        .then(res=>{
            localStorage.removeItem('hammerauth');
            disbatch(logoutAdmin());
        })
        .catch(err=>{
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
            }
        
            disbatch(removeLoading());
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

export const loadingAuth = ()=>{
    return{
        type:LOADING_AUTH_ADMIN
    }
}
export const removeLoading = ()=>{
    return{
        type: STOP_LOADING_AUTH
    }
}

export const setCurrentAdmin = decoded=>{
    return{
        type: AUTH_SET_ADMIN,
        payload:decoded
    }
}

export const logoutAdmin = ()=>{
    localStorage.clear();
    return{
        type: AUTH_ADMIN_LOGOUT
    }
}