import {Router} from 'express';
import * as LookbookController from './controller';
const routes = new Router();

routes.post('/lookbook/create',LookbookController.createNewLookbook);
routes.get('/lookbook/getall',LookbookController.getAllLookbook);
routes.get('/lookbook/edit/:id',LookbookController.editLookbook);
routes.put('/lookbook/update/:id', LookbookController.updateLookbook);
routes.delete('/lookbook/delete',LookbookController.deleteLookbook);
export default routes;