import { Router } from 'express';
import * as ResiController from './controller';

const routes = new Router();

routes.post('/resi/cek-resi', ResiController.cekResi);
export default routes;