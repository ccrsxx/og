import { z } from 'zod';
import { ipinfo } from '../utils/ipinfo.ts';
import { formatZodError, validIpSchema } from '../utils/validation.ts';
import { HttpError } from '../utils/error.ts';
import { getIpAddressFromRequest } from '../utils/helper.ts';
import type { Request, Response } from 'express';
import type { ApiResponse } from '../utils/types/api.ts';
import type { IPinfo } from 'node-ipinfo';
import type { IncomingHttpHeaders } from 'http';

function getIpAddress(req: Request, res: Response<string>): void {
  const ipAddress = getIpAddressFromRequest(req);

  res.status(200).send(ipAddress);
}

async function getIpAddressInfo(
  req: Request,
  res: Response<ApiResponse<IPinfo>>
): Promise<void> {
  const { data, error } = validIpSchema
    .optional()
    .or(z.literal(''))
    .safeParse(req.query.ip);

  if (error) {
    throw new HttpError(
      400,
      formatZodError(error, {
        preferSingleError: true
      })
    );
  }

  const ipAddress = data ?? getIpAddressFromRequest(req);

  const ipAddressInfo = await ipinfo.lookupIp(ipAddress);

  res.status(200).json({
    data: ipAddressInfo
  });
}

function getRequestHeader(
  req: Request,
  res: Response<ApiResponse<IncomingHttpHeaders>>
): void {
  res.status(200).json({
    data: req.headers
  });
}

export const ToolController = {
  getIpAddress,
  getIpAddressInfo,
  getRequestHeader
};
