import {Router} from 'express';
import * as VoucherController from './controller';
const routes = new Router();

routes.get('/voucher/type/get',VoucherController.getAllVoucherType);
routes.post('/voucher/create',VoucherController.createVoucher);
routes.get('/voucher/getall',VoucherController.getAllVoucher);
routes.get('/voucher/edit/:id', VoucherController.editVoucher);
routes.put('/voucher/update/:id',VoucherController.updateVoucher);
routes.delete('/voucher/delete/:id',VoucherController.deleteVoucher);
export default routes;

