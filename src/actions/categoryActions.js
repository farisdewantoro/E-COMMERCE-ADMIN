import axios from 'axios';
import { 
    LOADING_CATEGORY, 
    GET_ALL_CATEGORY, 
    GET_ALL_CATEGORY_TAG, 
    CREATE_NEW_CATEGORY, 
    GET_ERRORS, 
    REMOVE_ERRORS,
    GET_CATEGORY_WITH_PARAMS,
    GET_CATEGORY_TYPE_WITH_PARAMS,
    GET_CATEGORY_BANNER_CATEGORY,
    GET_CATEGORY_BANNER_CATEGORY_ID,
    GET_CATEGORY_BANNER_TAG,
    GET_CATEGORY_BANNER_TAG_ID,
    CLEAR_CATEGORY_TYPE,
    GET_CATEGORY_BANNER_TYPE,
    GET_CATEGORY_BANNER_TYPE_ID,
    GET_CATEGORY_BANNER_DEFAULT,
    GET_CATEGORY_BANNER_DEFAULT_ID
} from './types';
import {setNotification} from './notifActions';
export const getAllCategory = ()=> disbatch => {
    disbatch(loadingGetCategory());
    axios.get('/api/category/getall')
        .then(res=>{
            disbatch({
                type:GET_ALL_CATEGORY,
                payload:res.data
            });
        })
        .catch(err=>{
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                localStorage.clear();
                return window.location.href = "/sign-in";
                
            }
      
        })
};



export const editCategoryBannerCategory = (id)=>disbatch=>{
    disbatch(loadingGetCategory());
    axios.get('/api/category/edit/banner-category/'+id)
        .then(res=>{
            disbatch({
                type: GET_CATEGORY_BANNER_CATEGORY_ID,
                payload:res.data
            })
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                localStorage.clear();
                return window.location.href = "/sign-in";

            }

        })
}

export const editCategoryBannerCategoryDefault = (id) => disbatch => {
    disbatch(loadingGetCategory());
    axios.get('/api/category/edit/banner-default/' + id)
        .then(res => {
            disbatch({
                type: GET_CATEGORY_BANNER_DEFAULT_ID,
                payload: res.data
            })
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                localStorage.clear();
                return window.location.href = "/sign-in";

            }

        })
}

export const editCategoryBannerCategoryType = (id)=>disbatch=>{
    disbatch(loadingGetCategory());
    axios.get('/api/category/edit/banner-type/' + id)
        .then(res => {
            disbatch({
                type: GET_CATEGORY_BANNER_TYPE_ID,
                payload: res.data
            })
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                localStorage.clear();
                return window.location.href = "/sign-in";

            }

        })
}

export const editCategoryBannerCategoryTag = (id) => disbatch => {
    disbatch(loadingGetCategory());
    axios.get('/api/category/edit/banner-tag/' + id)
        .then(res => {
            disbatch({
                type: GET_CATEGORY_BANNER_TAG_ID,
                payload: res.data
            })
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                localStorage.clear();
                return window.location.href = "/sign-in";

            }

        })
}
export const getAllCategoryBannerCategory = () => disbatch => {
    disbatch(loadingGetCategory());
    axios.get('/api/category/getall/banner-category')
        .then(res => {
            disbatch({
                type: GET_CATEGORY_BANNER_CATEGORY,
                payload: res.data
            });
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                localStorage.clear();
                return window.location.href = "/sign-in";

            }

        })
};

export const getAllCategoryBannerTag = () => disbatch => {
    disbatch(loadingGetCategory());
    axios.get('/api/category/getall/banner-tag')
        .then(res => {
            disbatch({
                type: GET_CATEGORY_BANNER_TAG,
                payload: res.data
            });
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                localStorage.clear();
                return window.location.href = "/sign-in";

            }

        })
};

export const getAllCategoryBannerType = () => disbatch => {
    disbatch(loadingGetCategory());
    axios.get('/api/category/getall/banner-type')
        .then(res => {
            disbatch({
                type: GET_CATEGORY_BANNER_TYPE,
                payload: res.data
            });
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                localStorage.clear();
                return window.location.href = "/sign-in";

            }

        })
};
export const getAllCategoryBannerDefault = () => disbatch => {
    disbatch(loadingGetCategory());
    axios.get('/api/category/getall/banner-default')
        .then(res => {
            disbatch({
                type: GET_CATEGORY_BANNER_DEFAULT,
                payload: res.data
            });
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                localStorage.clear();
                return window.location.href = "/sign-in";

            }

        })
};


export const updateCategoryBannerDefault = (id, data, history) => disbatch => {
    disbatch(loadingGetCategory());
    axios.put('/api/category/banner-default/update/' + id, data)
        .then(ress => {
            history.push('/category/banner-default');
            disbatch({
                type: REMOVE_ERRORS
            })
            disbatch(setNotification(ress.data.notification));

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
export const updateCategoryBannerType = (id, data, history) => disbatch => {
    disbatch(loadingGetCategory());
    axios.put('/api/category/banner-type/update/' + id, data)
        .then(ress => {
            history.push('/category/banner-type');
            disbatch({
                type: REMOVE_ERRORS
            })
            disbatch(setNotification(ress.data.notification));

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

export const updateCategoryBannerTag = (id, data, history) => disbatch => {
    disbatch(loadingGetCategory());
    axios.put('/api/category/banner-tag/update/' + id, data)
        .then(ress => {
            history.push('/category/banner-tag');
            disbatch({
                type: REMOVE_ERRORS
            })
            disbatch(setNotification(ress.data.notification));

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
export const updateCategoryBannerCategory = (id,data, history) => disbatch => {
    disbatch(loadingGetCategory());
    axios.put('/api/category/banner-category/update/'+id, data)
        .then(ress => {
            history.push('/category/banner-category');
            disbatch({
                type: REMOVE_ERRORS
            })
            disbatch(setNotification(ress.data.notification));

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

export const getCategoryWithParam = (data)=>disbatch=>{
    disbatch(loadingGetCategory());
    axios.get('/api/category/get/'+data)
        .then(res=>{
            if(res.data){
                disbatch({
                    type: GET_CATEGORY_WITH_PARAMS,
                    payload:res.data
                })
            }
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                localStorage.clear();
                return window.location.href = "/sign-in";
                
            }
       
        })
}

export const getCategoryTypeWithParam = (data)=>disbatch=>{
    disbatch(loadingGetCategory());
    axios.get('/api/category/get/type/'+data)
        .then(res=>{
            if(res.data){
                disbatch({
                    type: GET_CATEGORY_TYPE_WITH_PARAMS,
                    payload:res.data.type
                })
            }
            
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }

        })
}

export const updateCategory = (data,history)=>disbatch=>{
    disbatch(loadingGetCategory());
    axios.post('/api/category/update', data)
        .then(ress => {
            history.push('/category');
            disbatch({
                type: REMOVE_ERRORS
            })
            disbatch(setNotification(ress.data.notification));
            
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


export const createNewCategory =(data,history)=>disbatch=>{
    disbatch(loadingGetCategory());
    axios.post('/api/category/create',data)
        .then(ress=>{ 
            disbatch({
                type: REMOVE_ERRORS
            }) 
            disbatch(setNotification(ress.data.notification));
            history.push('/category'); 
        })
        .catch(err=>{
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
            if(err.response.data.errors){
                disbatch({
                    type: GET_ERRORS,
                    payload: err.response.data.errors
                })
            }
        })
}

export const getAllCategoryTag = ()=>disbatch=>{
    disbatch(loadingGetCategory());
    axios.get('/api/category/getall/tag')
        .then(res=>{
            disbatch({
                type: GET_ALL_CATEGORY_TAG,
                payload:res.data
            })
        })
        .catch(err=>{
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
            if (typeof err.response.data.isEmpty !== "undefined" && err.response.data.isEmpty){
                return 
            }
        })
}

export const updateCategoryTag = (data)=>disbatch=>{
    disbatch(loadingGetCategory());
    axios.put('/api/category/update/tag',data)
        .then(res=>{
            if(res.data.notification){
                disbatch(setNotification(res.data.notification));
            }
            if(res.data.data){
                disbatch({
                    type: GET_ALL_CATEGORY_TAG,
                    payload: res.data.data
                });
            }
          
        })
        .catch(err=>{
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
            if (typeof err.response.data.isEmpty !== "undefined" && err.response.data.isEmpty) {
                return
            }
        })
}

export const createCategoryTag = (data) =>disbatch=>{
    disbatch(loadingGetCategory());
    axios.post('/api/category/create/tag', data)
        .then(res => {
            if (res.data.notification) {
                disbatch(setNotification(res.data.notification));
            }
            if (res.data.data) {
                disbatch({
                    type: GET_ALL_CATEGORY_TAG,
                    payload: res.data.data
                });
            }

        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
            console.log(err.response.data.isAuthenticated);
            if (typeof err.response.data.isEmpty !== "undefined" && err.response.data.isEmpty) {
                return
            }
        
        })
}
export const deleteCategoryTag = (data) => disbatch => {
    disbatch(loadingGetCategory());
    axios.delete('/api/category/delete/tag/'+data)
        .then(res => {
            if (res.data.notification) {
                disbatch(setNotification(res.data.notification));
            }
            if (res.data.data) {
                disbatch({
                    type: GET_ALL_CATEGORY_TAG,
                    payload: res.data.data
                });
            }

        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
            if (typeof err.response.data.isEmpty !== "undefined" && err.response.data.isEmpty) {
                return
            }
        })
}

export const deleteCategory = (data) =>disbatch=>{
    disbatch(loadingGetCategory());
    axios.delete('/api/category/delete/'+data)
        .then(res => {
            if (res.data.notification) {
                disbatch(setNotification(res.data.notification));
            }
            if (res.data.data) {
                disbatch({
                    type: GET_ALL_CATEGORY,
                    payload: res.data.data
                });
            }

        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
            if (typeof err.response.data.isEmpty !== "undefined" && err.response.data.isEmpty) {
                return
            }
        })
}



export const loadingGetCategory = () =>{
    return {
        type:LOADING_CATEGORY
    }
}

export const clearCategoryType = ()=>{
    return{
        type: CLEAR_CATEGORY_TYPE
    }
}