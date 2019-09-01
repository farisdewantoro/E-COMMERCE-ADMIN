import axios from 'axios';
import { GET_ALL_ORDER, LOADING_ORDER, GET_ORDER_BY_ID, DOWNLOAD_DATA_ORDER, REMOVE_LOADING } from './types';
import { setNotification } from './notifActions';
import qs from 'query-string';
export const loadingOrder = () => {
    return {
        type: LOADING_ORDER
    }
}

export const getOrderById = (id) => disbatch=>{
    disbatch(loadingOrder());
    axios.get('/api/order/detail/'+id)
        .then(res=>{
            disbatch({
                type:GET_ORDER_BY_ID,
                payload:res.data.data
            })
        })
        .catch(err=>{
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                localStorage.clear();
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

export const getInvoicePDF = (newWindow,data) =>disbatch=>{
    disbatch(loadingOrder());
    axios({
        method:"post",
        url:"/api/order/pdf/invoice",
        // responseType:"arraybuffer",
        // headers: {
        //     'Accept': 'application/pdf'
        // },
        data:{
            data
        }
    })
        .then(res => {
            // const file = new Blob([res.data], {
            //     type: "application/pdf"
            // });
            disbatch({
                type: REMOVE_LOADING
            })
            
            //Build a URL from the file
            // const fileURL = URL.createObjectURL(file);
        
            // const url = window.URL.createObjectURL(file);

            newWindow.document.write(res.data);
           

            setTimeout(function () {
                newWindow.print();
          
                // newWindow.close();
            }, 250);
          
            (function () {
                var reloadPage = function () {
                    newWindow.location.reload();
                };
                if (newWindow.matchMedia) {
                    // FOR CHROME
                    var mediaQueryList = newWindow.matchMedia('print');

                    mediaQueryList.addListener(function (mql) {
                        if (!mql.matches) {
                           reloadPage();
                        } 
                    });
                }

            //    fireFOX
                newWindow.onafterprint = reloadPage;
            }());
    
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                localStorage.clear();
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

export const getAllOrder = (category,search) => disbatch => {
    let filter = qs.parse(search);
    disbatch(loadingOrder());
    axios.get('/api/order/get/'+category,{
        params:filter
    })
        .then(res => {
            disbatch({
                type: GET_ALL_ORDER,
                payload: res.data
            })
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                localStorage.clear();
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

export const downloadDataOrder = ()=>disbatch=>{
    axios({
        method: 'GET',
        responseType: 'blob', // important
        url: '/api/order/data-order'
    })
        .then(res => {
            
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');


            link.href = url;
            link.setAttribute('download', 'order-data-all.csv');
            document.body.appendChild(link);
            link.click();
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                localStorage.clear();
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


export const deleteOrderSelected = (data) => disbatch => {
    disbatch(loadingOrder());
    axios.delete('/api/order/delete',{data:data})
        .then(res => {
            disbatch(setNotification(res.data.notification));
            window.location.reload();
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                localStorage.clear();
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

export const changeStatusOrder = (id,order_status_id)=>disbatch=>{
    disbatch(loadingOrder());
    let dataBody ={
        id,
        order_status_id
    }
    axios.put('/api/order/update/status', dataBody)
        .then(res => {
            disbatch(setNotification(res.data.notification));
            window.location.reload();
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                localStorage.clear();
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

export const updateKodeResi = (data) => disbatch => {
    disbatch(loadingOrder());
    axios.put('/api/order/update/resi', data)
        .then(res => {
            disbatch(setNotification(res.data.notification));
            window.location.reload();
        })
        .catch(err => {
            if (!err.response.data.isAuthenticated && typeof err.response.data.isAuthenticated !== "undefined") {
                localStorage.clear();
                return window.location.href = "/sign-in";
            }
            disbatch({
                type: REMOVE_LOADING
            })
            let notification = {
                error: true,
                message: "There is an error !",
                notification: true
            }
            disbatch(setNotification(notification));
        })
}

