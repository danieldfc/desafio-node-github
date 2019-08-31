import { Router } from 'express';

import UserController from './app/controllers/UserController';
import ProviderController from './app/controllers/ProviderController';
import GithubController from './app/controllers/GithubController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

import ValidateUserStore from './app/validators/UserStore';
import ValidateUserUpdate from './app/validators/UserUpdate';
import ValidateSessionStore from './app/validators/SessionStore';
import ValidateGithubStore from './app/validators/GithubStore';
import ValidateGithubUpdate from './app/validators/GithubUpdate';

const routes = new Router();

routes.post('/users', ValidateUserStore, UserController.store);
routes.post('/sessions', ValidateSessionStore, SessionController.store);

routes.use(authMiddleware);

routes.get('/users', ProviderController.index);
routes.get('/users/:name', ProviderController.show);

routes.put('/users', ValidateUserUpdate, UserController.update);

routes.post('/github', ValidateGithubStore, GithubController.store);
routes.put('/github', ValidateGithubUpdate, GithubController.update);
routes.delete('/github/:id', GithubController.delete);

export default routes;
