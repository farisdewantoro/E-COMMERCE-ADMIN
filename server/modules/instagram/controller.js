import db from '../../config/conn';
import async from 'async';
import keys from '../../config/keys';
import axios from 'axios';
export const activation = (req,res)=>{
    return res.status(200).json(`https://www.instagram.com/oauth/authorize/?client_id=${keys.instagram.clientID}&redirect_uri=${keys.instagram.redirect}&response_type=code`);

    // axios.get(`https://www.instagram.com/oauth/authorize/?client_id=${keys.instagram.clientID}&redirect_uri=${keys.instagram.redirect}&response_type=code`)
    // .then(result=>{
    //     res.send(result.data);
    // })
}