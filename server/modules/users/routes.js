import {Router} from 'express';
import * as UserController from './controller';
const routes = new Router();

routes.get('/user/get-all',UserController.getAll);
routes.get('/user/data-user', UserController.downloadDataUser);
routes.get('/user/data-user/email-phone', UserController.downloadOnlyEmailAndPhoneNumber);
routes.get('/user/data-user/phone', UserController.downloadOnlyPhone);

export default routes;

