import type { Request, Response } from 'express';
import type { ParsedQs } from 'qs';

export type OgService = {
  getOg(query: ParsedQs): Promise<Buffer>;
};

export type OgControllerConfig = {
  isProduction: boolean;
};

export class OgController {
  private service: OgService;
  private config: OgControllerConfig;

  constructor(service: OgService, config: OgControllerConfig) {
    this.service = service;
    this.config = config;
  }

  getOg = async (req: Request, res: Response<Buffer>): Promise<void> => {
    const og = await this.service.getOg(req.query);

    if (this.config.isProduction) {
      res.set(
        'Cache-Control',
        'public, immutable, no-transform, max-age=31536000'
      );
    }

    res.contentType('image/png').send(og);
  };
}
