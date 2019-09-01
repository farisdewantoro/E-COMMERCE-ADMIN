import {Router} from 'express';
import db from '../../config/conn';
import jwt from 'jsonwebtoken';
import keys from '../../config/keys';



const routes = new Router();

routes.get('/track/token',(req,res)=>{

    if(req.user){

    let queryFindAdmin = `SELECT a.id,a.username,a.email,a.created_at,a.updated_at 
    FROM admin as a 
    LEFT JOIN admin_session as ass on a.id = ass.admin_id 
    where ass.session_id = '${req.sessionID}' `;
    
    db.query(queryFindAdmin,(err,result)=>{
        if(err)return res.status(400).json({error:true,message:"ERROR FROM ADMIN TOKEN"});
        if(result.length > 0){
            let admin = result[0];
            let payload ={admin};
           let token_a =  jwt.sign(payload,keys.loginJwt.secretOrPrivateKey,{expiresIn:keys.loginJwt.expiresIn});

            return res.status(200).json({ token_a:token_a });
        }else{
            let notification = {
                error: true,
                message: "ERROR",
                notification: true
            }
            return res.status(400).json({ notification: notification });
        }
    })

    }else{
        let notification = {
            error: true,
            message: "ERROR",
            notification: true
        }
        return res.status(400).json({ notification: notification });
    }

    
});

export default routes;