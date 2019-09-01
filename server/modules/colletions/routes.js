import {Router} from 'express';
import * as CollectionController from './controller';
const routes = new Router();

routes.post('/collection/create',CollectionController.createNewCollection);
routes.get('/collection/getall',CollectionController.getAllCollection);
routes.get('/collection/edit/:id',CollectionController.editCollection);
routes.put('/collection/update/:id', CollectionController.updateCollection);
routes.delete('/collection/delete',CollectionController.deleteCollection);
routes.post('/collection/addto',CollectionController.addToCollection);
export default routes;