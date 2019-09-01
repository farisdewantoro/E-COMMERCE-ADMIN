import { Router } from 'express';
import * as TransactionController from './controller';
const routes = new Router();

routes.post('/transaction/bukti/upload', TransactionController.uploadFileTransaction);
routes.post('/transaction/bukti/download', TransactionController.downloadFileTransaction);
export default routes;
