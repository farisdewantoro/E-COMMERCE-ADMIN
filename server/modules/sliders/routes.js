import {Router} from 'express';
import * as SliderController from './controller';
const routes = new Router();

routes.post('/slider/update',SliderController.updateSlider);
routes.get('/slider/get', SliderController.getHomeSlider);
export default routes;

