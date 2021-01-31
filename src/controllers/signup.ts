/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import database from '../database';

const saltRounds = 10;

const signupHandler = async (
  request: Request,
  response: Response,
  // eslint-disable-next-line consistent-return
): Promise<Response<any, Record<string, any>> | undefined> => {
  const { name, email, password } = request.body;

  if (!name || !email || !password)
    return response.status(400).json('incorrect form submission');

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
};

export default signupHandler;
