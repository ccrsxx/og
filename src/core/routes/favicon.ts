import express, { type Application } from 'express';

export default (app: Application): void => {
  app.use('/favicon.ico', express.static('public/favicon.ico'));
};
