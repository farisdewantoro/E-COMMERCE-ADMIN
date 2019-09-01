import {Router} from 'express'
import * as ModeController from './controller'
const routes = new Router();
routes.get('/mode/get/status', ModeController.getStatusMode);
routes.post('/mode/change/status',ModeController.changeStatusMode);
export default routes;