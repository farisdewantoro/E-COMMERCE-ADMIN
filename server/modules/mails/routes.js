import {Router} from 'express';
import * as MailController from './controller';
const routes = new Router();

routes.get('/mail/send', MailController.sendMail);
routes.get('/mail/preview', MailController.previewMail);
export default routes;