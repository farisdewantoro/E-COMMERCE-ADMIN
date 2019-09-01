import {Router} from 'express';
import * as AuthController from './controller';
import passport from 'passport';
const routes = new Router();
// routes.post('/auth/login',
//     passport.authenticate('local'),
//     function (req, res) {
//         return res.status(200).json(req.user);
//     });
routes.post('/auth/login',  AuthController.loginAdmin);
routes.post('/auth/register',AuthController.registerAdmin);
routes.post('/auth/logout',AuthController.logoutAdmin);
export default routes;