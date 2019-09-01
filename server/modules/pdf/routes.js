import { Router } from 'express';
import * as PdfController from './controller';

const routes = new Router();

routes.post('/order/pdf/invoice', PdfController.getPDF);

export default routes;