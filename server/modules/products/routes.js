import { Router } from 'express';
import * as ProductController from './controller';

const routes = new Router();

routes.post('/product/create', ProductController.createProduct);
routes.get('/product/get',ProductController.getProduct);
routes.get('/product/edit/:product_slug/:id',ProductController.editProduct);
routes.put('/product/update/:product_slug/:id',ProductController.updateProduct);
routes.delete('/product/delete',ProductController.deleteProduct);
routes.post('/product/create/discount',ProductController.makeDiscount);
routes.post('/product/add/recommendation',ProductController.addToRecommendation);
routes.post('/product/remove/recommendation', ProductController.removeFromRecommendation);
export default routes;