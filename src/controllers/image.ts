/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import Clarifai from 'clarifai';
import dotenv from 'dotenv';
import database from '../database';

dotenv.config();

const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_kEY,
});

export const apiClarifaiHandler = async (
  request: Request,
  response: Response,
): Promise<Response<any, Record<string, any>>> => {
  const { input } = request.body;

  try {
    const res = await app.models.predict(
      'd02b4508df58432fbb84e800597b8959',
      input,
    );

    return response.json(res);
  } catch (error) {
    return response.status(400).json('unable to work with API');
  }
};

export const imageHandler = async (
  request: Request,
  response: Response,
): Promise<Response<any, Record<string, any>>> => {
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
};
