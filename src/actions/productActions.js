import axios from 'axios';
import { 
    LOADING_PRODUCT, 
    CREATE_PRODUCT, 
    GET_ERRORS, 
    STOP_LOADING_PRODUCT, 
    REMOVE_ERRORS, 
    SET_PRODUCT,
    PRODUCT_EDIT,
    CREATE_DISCOUNT } from './types';
import { setCollection} from './collectionActions';
import { setNotification } from './notifActions';
import { setSizing} from './sizingActions';

export const removeRecommendation = (data,history)=>disbatch=>{
    disbatch(loadingProduct());
    axios.post('/api/product/remove/recommendation', data)
        .then(res => {
            disbatch(getProduct('?filter=our-recommendation'));
            
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
            disbatch(stopLoadingProduct());
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
export const addToRecommendation = (data,history) =>disbatch=>{
    disbatch(loadingProduct());
    axios.post('/api/product/add/recommendation', data)
        .then(res => {
            disbatch(setNotification(res.data.notification));
            history.push('/product?filter=our-recommendation')
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
            disbatch(stopLoadingProduct());
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
export const createProduct = (productData,history) => disbatch =>{
    disbatch(loadingProduct());
    axios.post('/api/product/create',productData)
        .then(res=>{
            disbatch({
                type: REMOVE_ERRORS
            })
            disbatch({
                type: CREATE_PRODUCT,
                payload:res.data
            });
            disbatch(setNotification(res.data.notification));
        })
        .catch(err=>{
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
            disbatch(stopLoadingProduct());
            disbatch({
                type: GET_ERRORS,
                payload:err.response.data
            })
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            disbatch(setNotification(notification));
        })
};

export const addToCollection = (data,history)=>disbatch=>{
    axios.post('/api/collection/addto', data)
        .then(res => {
            disbatch({
                type: SET_PRODUCT,
                payload: res.data.products
            })
            disbatch(setNotification(res.data.notification));
            history.push('/product');
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                localStorage.clear();
                return window.location.href = "/sign-in";
               
            }
            disbatch(stopLoadingProduct());

            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            disbatch(setNotification(notification));
        })
}

export const makeDiscount = (data)=>disbatch=>{
    axios.post('/api/product/create/discount',data)
        .then(res=>{
            disbatch({
                type: REMOVE_ERRORS
            })
            disbatch({
                type: CREATE_DISCOUNT,
                payload: res.data
            });
            disbatch({
                type: SET_PRODUCT,
                payload: res.data.product
            })
            disbatch(setNotification(res.data.notification));
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                localStorage.clear();
                return window.location.href = "/sign-in";
               
            }
            disbatch(stopLoadingProduct());
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

export const updateProduct = (slug,id,data,history) => disbatch => {
    disbatch(loadingProduct());
    axios.put(`/api/product/update/${slug}/${id}`, data)
        .then(res => {
            disbatch({
                type: REMOVE_ERRORS
            })
            disbatch(setNotification(res.data.notification));
            history.push('/product');
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                localStorage.clear();
                return window.location.href = "/sign-in";
               
            }
            disbatch(stopLoadingProduct());
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
};

export const getProduct = (category)=>disbatch=>{
    disbatch(loadingProduct());
    let url ;
    if(typeof category !== "undefined"){
        url = '/api/product/get'+category;
    }else{
        url = '/api/product/get';
    }
    axios.get(url)
        .then(res=>{
            disbatch({
                type: SET_PRODUCT,
                payload:res.data.products
            });
            disbatch(setCollection(res.data.collections));
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                localStorage.clear();
                return window.location.href = "/sign-in";
               
            }
            if (err.response.data.errors) {
                disbatch({
                    type: GET_ERRORS,
                    payload: err.response.data.errors
                })
            }
        })
}

export const deleteProduct = (data)=>disbatch=>{
    disbatch(loadingProduct());
    axios.delete('/api/product/delete',{data:data})
        .then(res=>{
            disbatch(setNotification(res.data.notification));
            disbatch({
                type: SET_PRODUCT,
                payload: res.data.data
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

export const editProduct = (slug,id)=>disbatch=>{
    disbatch(loadingProduct());
    axios.get('/api/product/edit/'+slug+'/'+id)
        .then(res => {
            disbatch({
                type: PRODUCT_EDIT,
                payload: res.data
            });
            
            disbatch(setSizing(res.data.sizing));
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

export const loadingProduct = () =>{
    return{
        type: LOADING_PRODUCT
    }
}

export const stopLoadingProduct = () =>{
    return{
        type:STOP_LOADING_PRODUCT
    }
}