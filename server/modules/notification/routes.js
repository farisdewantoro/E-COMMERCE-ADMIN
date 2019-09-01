import {Router} from 'express';
import * as NotificationController from './controller';

const routes = new Router();

routes.post('/notification/order', NotificationController.getNotification);

export default routes;