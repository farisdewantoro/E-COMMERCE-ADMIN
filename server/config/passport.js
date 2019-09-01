
import keys from './keys';
import db from './conn';
import bcrypt from 'bcryptjs';
var passport = require('passport')
    ,LocalStrategy = require('passport-local').Strategy;




passport.use(new LocalStrategy(
    function (username, password, done) {
 
        let queryFindAdmin = 'select * from admin where username = ? ';
        db.query(queryFindAdmin, [username], (err, result) => {
        
            if (err) return done(err, null);
            if (result.length > 0) {
                let data = result[0];
                bcrypt.compare(password, data.password)
                    .then(isMatch=>{
                        if(isMatch){
                            
                            return done(null, data);
                        }else{
                            return done(null, false, { message: 'Incorrect password.' });
                        }
                        
                    })
              
            }else{
                return done(null, false, { message: 'Incorrect username.' });
            }
            
            
        })

    }
));

passport.serializeUser(function (user, done) {

    let tokenValue = {
    }
    if (user.id) tokenValue.id = user.id;

    done(null, tokenValue);
});

passport.deserializeUser(function (data, done) {
 
        let queryFindAdmin = `SELECT id,username,email,created_at,updated_at from admin where id = ${data.id}`;
        db.query(queryFindAdmin, (err, result) => {
            if (err) return done(err, null);
            if (result.length > 0) {
                return done(null, result[0]);
            }
            if(result.length === 0){
                return done(null, false);
            }
        })
  

});