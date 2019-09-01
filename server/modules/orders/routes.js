import {Router} from 'express';
import * as OrderController from './controller';

const routes = new Router();

routes.get('/order/get/:category',OrderController.getOrder);
routes.delete('/order/delete',OrderController.deleteSelectedOrder);
routes.put('/order/update/status',OrderController.updateSelectedOrder);
routes.get('/order/detail/:id',OrderController.getOrderById);
routes.get('/order/data-order',OrderController.downloadDataFull);
routes.put('/order/update/resi',OrderController.updateOrderResi);

export default routes;