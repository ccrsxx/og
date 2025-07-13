import type { Request, Response } from 'express';

export function ping(_req: Request, res: Response): void {
  res.status(200).json({ message: 'Ping successfully' });
}

export const RootController = {
  ping
};
