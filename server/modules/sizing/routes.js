import {Router} from 'express';
import * as SizingController from './controller';
const routes = new Router();

routes.post('/sizing/create',SizingController.createSizing);
routes.get('/sizing/getall', SizingController.getAllSizing);
routes.get('/sizing/get/:id', SizingController.editSizing);
routes.put('/sizing/update/:id',SizingController.updateSizing);
routes.delete('/sizing/delete/:id',SizingController.deleteSizing);
export default routes;