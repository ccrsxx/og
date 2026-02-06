import { json, type Application } from 'express';

export default (app: Application): void => {
  app.use(json());
};
