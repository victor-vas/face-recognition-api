import { Router } from 'express';
import signinHandler from './controllers/signin';
import signupHandler from './controllers/signup';
import { profileHandler, usersHandler } from './controllers/profile';
import { imageHandler, apiClarifaiHandler } from './controllers/image';

const routes = Router();

routes.get('/users', usersHandler);

routes.post('/signin', signinHandler);

routes.post('/signup', signupHandler);

routes.get('/profile/:id', profileHandler);

routes.put('/image', imageHandler);

routes.post('/imageurl', apiClarifaiHandler);

export default routes;
