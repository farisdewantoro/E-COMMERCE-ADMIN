import axios from 'axios';
import { RESI, REMOVE_ERRORS, GET_ERRORS, } from './types';
import { setNotification } from './notifActions';
export const loadingResi = ()=>{
    return{
        type: RESI.loading
    }
}


export const cekResi = (data)=>disbatch=>{
    disbatch(loadingResi());
    axios.post('/api/resi/cek-resi',data)
        .then(res=>{
            disbatch({
                type:RESI.get,
                payload:res.data.rajaongkir
            })
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                return window.location.href = "/sign-in";
                localStorage.clear();
            }
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