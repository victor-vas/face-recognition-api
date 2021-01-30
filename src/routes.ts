import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import database from './database';

const routes = Router();
const saltRounds = 10;

routes.get('/users', async (request: Request, response: Response) => {
  try {
    const data = await database.select('*').from('users');

    return response.json(data);
  } catch (error) {
    return response.status(400).json('error getting users');
  }
});

routes.post('/signin', async (request: Request, response: Response) => {
  const { email, password } = request.body;

  try {
    const [{ hash }] = await database
      .from('login')
      .select('hash')
      .where('email', '=', email);

    const isValid = bcrypt.compareSync(password, hash);

    if (!isValid) return response.status(404).json('credentials error');

    const [user] = await database
      .select('*')
      .from('users')
      .where('email', '=', email);

    return response.json(user);
  } catch (error) {
    return response.status(404).json('credentials error');
  }
});

routes.post('/signup', async (request: Request, response: Response) => {
  const { name, email, password } = request.body;

  const hash = bcrypt.hashSync(password, saltRounds);

  database.transaction(async (trx) => {
    try {
      const [loginEmail] = await trx
        .insert({ hash, email })
        .into('login')
        .returning('email');

      const [user] = await trx('users')
        .returning('*')
        .insert({ email: loginEmail, name, joined: new Date() });

      await trx.commit;

      return response.json(user);
    } catch (error) {
      await trx.rollback;

      return response.status(400).json('unable to register');
    }
  });
});

routes.get('/profile/:id', async (request: Request, response: Response) => {
  const { id } = request.params;

  try {
    const [user] = await database.select('*').where({ id }).from('users');

    if (!user.length) return response.status(404).json('no such user');

    return response.json(user);
  } catch (error) {
    return response.status(404).json('error getting user');
  }
});

routes.put('/image', async (request: Request, response: Response) => {
  const { id } = request.body;

  try {
    const [entries] = await database('users')
      .where('id', '=', id)
      .increment('entries', 1)
      .returning('entries');

    return response.json(entries);
  } catch (error) {
    return response.status(404).json('unable to get entries');
  }
});

export default routes;
