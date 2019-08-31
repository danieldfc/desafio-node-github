import { Router } from 'express';

import UserController from './app/controllers/UserController';
import ProviderController from './app/controllers/ProviderController';
import GithubController from './app/controllers/GithubController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/users', ProviderController.index);
routes.get('/users/:name', ProviderController.show);

routes.put('/users/:id', UserController.update);

routes.post('/github', GithubController.store);
routes.put('/github', GithubController.update);

export default routes;
