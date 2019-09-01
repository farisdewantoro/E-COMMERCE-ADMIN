import keys from '../config/keys';
export const ensureAuthenticated = (req,res,next)=>{
    
    if (req.isAuthenticated()) {
        return next();
    }else{
        req.logout();
        res.clearCookie();
        req.session.destroy(function (err) {
            // cannot access session here
        });
        // return res.redirect(keys.origin.url+'/sign-in');

        return res.status(400).json({ error: true, isAuthenticated: false, message: "YOU ARE NOT AUTHENTICATED" });
    }

}