import axios from 'axios';
import {MEDIA} from './types';
import qs from 'query-string';
import { setNotification } from './notifActions';

export const loadingMedia = () => {
    return {
        type: MEDIA.loading
    }
}

export const getMediaList = (data,search,pagination) => async (disbatch)=>{
    
    let url = '/api/media/get/media?media=' + data;
    if(search){
       url = `/api/media/get/media?media=${data}&search=${search}`;
    }
    if(pagination){
        pagination = qs.stringify(pagination);
    }
    if (pagination && !search) {
        url = `/api/media/get/media?media=${data}&${pagination}`;
    }
    if(pagination && search){
        url = `/api/media/get/media?media=${data}&search=${search}&${pagination}`;
    }
   
   try{
       const res = await axios.get(url);
       disbatch({
           type:MEDIA.getMedia,
           payload:res.data
       })
   }
   catch(err){
       let notification = {
           error: true,
           message: "There is an error !",
           notification: true
       }
       if(err.response.data){
           disbatch(setNotification(err.response.data));
       }else{
           disbatch(setNotification(notification));
       }
      
   }
}
export const deleteImageMedia = (data,media)=>async (disbatch)=>{
    try {
        const res = await axios.delete('/api/media/delete/media?media=' + media,{
            data:data
        });
        disbatch({
            type:MEDIA.delete,
            payload:res.data
        })
    }
    catch (err) {
        let notification = {
            error: true,
            message: "There is an error !",
            notification: true
        }
        if (err.response.data) {
            disbatch(setNotification(err.response.data));
            disbatch({
                type: MEDIA.removeLoading
            })
        } else {
            disbatch(setNotification(notification));
            disbatch({
                type: MEDIA.removeLoading
            })
        }
    }
}
export const uploadMedia = (data,media)=>async (disbatch)=>{
    try{
        disbatch(loadingMedia());
        const res = await axios.post('/api/media/upload?media=' + media, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: progressEvent => {

                disbatch({
                    type: MEDIA.loading_percent,
                    payload: parseInt(
                        Math.round(((progressEvent.loaded * 100) / progressEvent.total))
                    ) === 100 ? '...PROCESSING' : Math.round(((progressEvent.loaded * 100) / progressEvent.total)) + "%"
                });
                disbatch({
                    type:MEDIA.loadingProcess
                })

            }
        });
        disbatch({
            type: MEDIA.success,
            payload:res.data
        });
        // disbatch(getMediaList(media))
    }
    catch(err){
        let notification = {
            error: true,
            message: "There is an error !",
            notification: true
        }
        if (err.response.data) {
            disbatch(setNotification(err.response.data));
            disbatch({
                type: MEDIA.removeLoading
            })
        } else {
            disbatch(setNotification(notification));
            disbatch({
                type: MEDIA.removeLoading
            })
        }
    }

}