/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import database from '../database';

export const usersHandler = async (
  request: Request,
  response: Response,
): Promise<Response<any, Record<string, any>>> => {
  try {
    const data = await database.select('*').from('users');

    return response.json(data);
  } catch (error) {
    return response.status(400).json('error getting users');
  }
};

export const profileHandler = async (
  request: Request,
  response: Response,
): Promise<Response<any, Record<string, any>>> => {
  const { id } = request.params;

  try {
    const [user] = await database.select('*').where({ id }).from('users');

    if (!user.length) return response.status(404).json('no such user');

    return response.json(user);
  } catch (error) {
    return response.status(404).json('error getting user');
  }
};
