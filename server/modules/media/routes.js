import {Router} from 'express';
import * as MediaController from './controller';

const routes = new Router();

routes.post('/media/upload',MediaController.uploadImage);
routes.get('/media/get/media', MediaController.getMediaImage);
routes.delete('/media/delete/media',MediaController.deleteMediaImage);
// routes.get('/media/get-more/media', MediaController.getMoreMediaImage)
export default routes;