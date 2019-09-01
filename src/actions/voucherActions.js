import { GET_ALL_VOUCHER_TYPE, GET_ALL_VOUCHER, 
    EDIT_VOUCHER,LOADING_VOUCHER, REMOVE_LOADING_VOUCHER, GET_ERRORS, REMOVE_ERRORS} from './types';
import axios from 'axios';
import { setNotification } from './notifActions';

export const getAllVoucherType = ()=>disbatch=>{
    disbatch(loadingVoucher());
    axios.get('/api/voucher/type/get')
        .then(res=>{
          disbatch({
              type: GET_ALL_VOUCHER_TYPE,
              payload:res.data
          })
        })
        .catch(err=>{
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
            disbatch(removeLoadingVoucher());
        })
}

export const editVoucher = (data)=>disbatch=>{
    disbatch(loadingVoucher());
    axios.get('/api/voucher/edit/'+data)
        .then(res => {
            disbatch({
                type:EDIT_VOUCHER,
                payload:res.data
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
            disbatch(removeLoadingVoucher());
        })
}

export const getAllVoucher = () =>disbatch=>{
    disbatch(loadingVoucher());
    axios.get('/api/voucher/getall')
        .then(res => {
            disbatch({
                type: GET_ALL_VOUCHER,
                payload: res.data
            })
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
        
            disbatch(removeLoadingVoucher());
        })
}

export const createVoucher = (data,history) =>disbatch=>{
    disbatch(loadingVoucher());
    axios.post('/api/voucher/create', data)
        .then(res=>{
            disbatch(setNotification(res.data.notification));
            history.push('/voucher');
            disbatch({
                type: REMOVE_ERRORS
            })
        })
        .catch(err=>{
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
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            disbatch(setNotification(notification));
            disbatch(removeLoadingVoucher());
        })
}

export const updateVoucher = (id,data, history) => disbatch => {
    disbatch(loadingVoucher());
    axios.put('/api/voucher/update/'+id, data)
        .then(res => {
            disbatch(setNotification(res.data.notification));
            history.push('/voucher');
            disbatch({
                type: REMOVE_ERRORS
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
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            disbatch(setNotification(notification));
            disbatch(removeLoadingVoucher());
        })
}

export const deleteVoucher = (id) => disbatch => {
    disbatch(loadingVoucher());
    axios.delete('/api/voucher/delete/' + id)
        .then(res => {
            disbatch(setNotification(res.data.notification));
            disbatch({
                type: GET_ALL_VOUCHER,
                payload: res.data.vouchers
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
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            disbatch(setNotification(notification));
            disbatch(removeLoadingVoucher());
        })
}

export const loadingVoucher =()=>{
    return{
        type: LOADING_VOUCHER
    }
}

export const removeLoadingVoucher = ()=>{
    return{
        type:REMOVE_LOADING_VOUCHER
    }
}
