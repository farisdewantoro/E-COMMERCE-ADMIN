import { Router } from 'express';
import * as CategoryController from './controller';
import passport from 'passport';
const routes = new Router();

routes.post('/category/create',CategoryController.createCategory);
routes.get('/category/getall', CategoryController.getAllCategory);
routes.get('/category/getall/tag',CategoryController.getAllCategoryTag);
routes.get('/category/getall/banner-category', CategoryController.getAllCategoryBannerCategory);
routes.get('/category/edit/banner-category/:id',CategoryController.editCategoryBannerCategory);
routes.put('/category/banner-category/update/:id', CategoryController.updateCategoryBannerCategory)

routes.get('/category/getall/banner-tag', CategoryController.getAllCategoryBannerTag);
routes.get('/category/edit/banner-tag/:id', CategoryController.editCategoryBannerTag);
routes.put('/category/banner-tag/update/:id', CategoryController.updateCategoryBannerTag);

routes.get('/category/getall/banner-type', CategoryController.getAllCategoryBannerType);
routes.get('/category/edit/banner-type/:id', CategoryController.editCategoryBannerType);
routes.put('/category/banner-type/update/:id', CategoryController.updateCategoryBannerType);

routes.get('/category/getall/banner-default', CategoryController.getAllCategoryBannerDefault);
routes.get('/category/edit/banner-default/:id', CategoryController.editCategoryBannerDefault);
routes.put('/category/banner-default/update/:id', CategoryController.updateCategoryBannerDefault);

routes.put('/category/update/tag',CategoryController.updateCategoryTag);
routes.post('/category/create/tag',CategoryController.createCategoryTag);
routes.delete('/category/delete/tag/:id',CategoryController.deleteCategoryTag);
routes.delete('/category/delete/:id',CategoryController.deleteCategory);
routes.get('/category/get/:id',CategoryController.getCategoryWithParams);
routes.post('/category/update',CategoryController.updateCategory);
routes.get('/category/get/type/:category_id',CategoryController.getCategoryTypeWithParams);
export default routes;