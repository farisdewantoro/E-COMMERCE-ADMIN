import axios from 'axios';
import {USER} from './types';
import { setNotification } from './notifActions';
import qs from 'query-string';
export const loadingUser = ()=>{
    return{
        type:USER.loading
    }
}

export const getAllUser = (params)=>disbatch=>{
    disbatch(loadingUser());
    let url = '/api/user/get-all';
    let filter = qs.parse(params);
    axios.get(url, { params: filter})
        .then(res=>{
            disbatch({
                type:USER.getAll,
                payload:res.data
            })
        })
        .catch(err=>{
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
            }
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            disbatch(setNotification(notification));
        })
}

export const downloadCsvUser = ()=>disbatch=>{
    axios({
        method: 'GET',
        responseType: 'blob', // important
        url:'/api/user/data-user'
    })
        .then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'user-data.csv');
            document.body.appendChild(link);
            link.click();
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
            }
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            disbatch(setNotification(notification));
        })
}



export const downloadCsvUserPhone = () => disbatch => {
    axios({
        method: 'GET',
        responseType: 'blob', // important
        url: '/api/user/data-user/phone'
    })
        .then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
         

            link.href = url;
            link.setAttribute('download', 'user-data-phone.csv');
            document.body.appendChild(link);
            link.click();
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
            }
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            disbatch(setNotification(notification));
        })
}

export const downloadCsvUserPhoneEmail = () => disbatch => {
    axios({
        method: 'GET',
        responseType: 'blob', // important
        url: '/api/user/data-user/email-phone'
    })
        .then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');


            link.href = url;
            link.setAttribute('download', 'user-data-phone-email.csv');
            document.body.appendChild(link);
            link.click();
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
            }
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            disbatch(setNotification(notification));
        })
}

