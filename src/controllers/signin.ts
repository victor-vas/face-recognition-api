import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import database from '../database';

const signinHandler = async (
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Response<any, Record<string, any>>> => {
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
};

export default signinHandler;
