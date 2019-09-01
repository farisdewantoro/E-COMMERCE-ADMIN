import db from '../../config/conn';
import {ValidationLogin} from './validation';
import bcrypt from 'bcryptjs';
import keys from '../../config/keys';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import UAparser from 'ua-parser-js'
import async from 'async';
export const loginAdmin =(req,res,next)=>{

  
    const { errors, isValid } = ValidationLogin(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // let ua = UAparser(req.headers['user-agent']);
    // let ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // if (ip_address.substr(0, 7) == "::ffff:") {
    //     ip_address = ip_address.substr(7)
    // }
    // if (ip_address == "::1") {
    //     ip_address = "127.0.0.1"
    // }
    // let queryInsertSession = `INSERT INTO session (id) values ('${req.sessionID}')`;
    // let queryInsertSessionBrowserAndEngineOs = (table) => {
    //     return `INSERT INTO ${table} set session_id = (SELECT ss.id from session as ss where id = '${req.sessionID}' ), ?   `;
    // }
    // let queryInsertAdminSession = `INSERT INTO admin_session set admin_id = ?,session_id = '${req.sessionID}'`;
    // let queryInsertDevice = `INSERT INTO session_device set session_id = (SELECT ss.id from session as ss where id = '${req.sessionID}' , ?`;
    // let querySelectSession = `
    // SELECT ss.id from session as ss
    // LEFT JOIN session_browser as sb on ss.id = sb.session_id
    // LEFT JOIN session_os as so on ss.id = sb.session_id
    // LEFT JOIN session_engine as se on ss.id = se.session_id
    // LEFT JOIN session_device as sd on ss.id = se.session_id
    // whereand ss.id = '${req.sessionID}' and sb.name = '${ua.browser.name}' and sb.version = '${ua.browser.version}' and so.name = '${ua.os.name}' and so.version = '${ua.os.version}' and se.name = '${ua.engine.name}' and se.version = '${ua.engine.version}' 
    // ${ua.device.model ? ` and sd.model='${ua.device.model}'` : ''} 
    // ${ua.device.type ? ` and sd.type='${ua.device.type}'` : ''} 
    // ${ua.device.vendor ? ` and sd.vendor='${ua.device.vendor}'` : ''}
    // group by ss.id,ss.ip_address`;
    // let querySelectOnlySession = `SELECT ss.id from session as ss where  ss.id = '${req.sessionID}'  group by ss.id`;
    // let querySelectAdminSession = `SELECT ass.id from admin_session as ass where ass.admin_id = ? and ass.session_id = '${req.sessionID}' `;
    // let queryCheckSession = `${querySelectOnlySession}; ${querySelectSession};${querySelectAdminSession};`;


    passport.authenticate('local', function (err, user, info) {
        
        if (err) { return next(err); }
        if (!user) { return res.status(400).json({message:info.message}) }
        req.login(user, function (err) {
            if (err) { return next(err); }
            if (user) {
                let payload = { user };
                jwt.sign(
                    payload,
                    keys.loginJwt.secretOrPrivateKey,
                    {
                        expiresIn: keys.loginJwt.expiresIn
                    }, (err, token) => {
                        return res.status(200).json(token)
                    });
            }
        });
     
     
        

    })(req, res, next);
    
 
}

export const logoutAdmin = (req,res)=>{
    req.logout();
    res.clearCookie();
    req.session.destroy(function (err) {
        // cannot access session here
    })
    return res.status(200).json("LOGOUT");
}

export const registerAdmin = (req,res)=>{
  
    let queryInsert = 'INSERT INTO admin SET ?';
    bcrypt.genSalt(15, (err, salt) => {
        //15 adalah berapa banyak karakter
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) {
                throw err;
            }
           
         
            db.query(queryInsert,{username:req.body.username,password:hash}, (error, result) => {
                if (error) return res.status(400).json(error);
                if (result) {
                    return res.status(200).json(result);
                }
            })
        });
    });
 
}