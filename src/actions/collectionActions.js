import axios from 'axios';
import { GET_ALL_COLLECTION, LOADING_COLLECTION, 
    GET_ERRORS, EDIT_COLLECTION, 
    CLEAR_COLLECTION,SET_COLLECTION } from './types';
import { setNotification } from './notifActions';

export const loadingCollection = () => {
    return {
        type: LOADING_COLLECTION
    }
}

export const createNewCollection = (data, history) => disbatch => {
    disbatch(loadingCollection());
    axios.post('/api/collection/create', data)
        .then(res => {
            disbatch(setNotification(res.data.notification));
            history.push('/collection');
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
            disbatch(loadingCollection());
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

export const editCollection = (data) => disbatch => {
    disbatch(loadingCollection());
    axios.get('/api/collection/edit/' + data)
        .then(res => {
            disbatch({
                type: EDIT_COLLECTION,
                payload: res.data
            })

        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
            disbatch(loadingCollection());
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

export const updateCollection = (id, data, history) => disbatch => {
    disbatch(loadingCollection());
    axios.put('/api/collection/update/' + id, data)
        .then(res => {
            disbatch(setNotification(res.data.notification));
            history.push('/collection');
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
            disbatch(loadingCollection());
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

export const deleteCollection = (data) => disbatch => {
    disbatch(loadingCollection());
    axios.delete('/api/collection/delete', { data: data })
        .then(res => {
            if (res.data.data) {
                disbatch({
                    type: GET_ALL_COLLECTION,
                    payload: res.data.data
                })
            } else {
                disbatch(clearCollection());
            }

            if (res.data.notification) {
                disbatch(setNotification(res.data.notification));
            }

        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
            disbatch(loadingCollection());
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

export const getAllCollection = () => disbatch => {
    disbatch(loadingCollection());
    axios.get('/api/collection/getall')
        .then(res => {
            disbatch({
                type: GET_ALL_COLLECTION,
                payload: res.data
            })
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
            disbatch(loadingCollection());
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

export const clearCollection = () => {
    return {
        type: CLEAR_COLLECTION
    }
}

export const setCollection = (data) => {
    return {
        type: SET_COLLECTION,
        payload:data
    }
}