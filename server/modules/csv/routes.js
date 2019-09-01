import { Router } from 'express';
import * as CsvController from './controller';
import passport from 'passport';
const routes = new Router();

routes.get('/csv/data-feed', CsvController.getDataFeed);

export default routes;