import {Router} from 'express';
import * as InstagramController from './controller';
const routes = new Router();

routes.post('/instagram/activation',InstagramController.activation);
export default routes;