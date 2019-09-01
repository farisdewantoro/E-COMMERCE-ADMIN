import axios from 'axios'
import keys from '../../config/keys'



export const getStatusMode = (req,res) =>{
    return res.status(200).json(keys.mode);
}

export const changeStatusMode = async (req,res)=>{
    try{
        const mode = req.body;
        mode.active = !mode.active;
        const new_mode = await axios.post(mode.api, mode);
        if(new_mode){
            keys.mode.active = mode.active
        }
        return res.status(200).json(mode)
    }
    catch(err){
        return res.status(400).json('ERROR');
    }
}