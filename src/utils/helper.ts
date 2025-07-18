import { readFile } from 'fs/promises';
import { type Request } from 'express';

export async function getArrayBufferFromFile(
  path: string
): Promise<ArrayBuffer> {
  const file = await readFile(path);

  const arrayBuffer = file.buffer.slice(
    file.byteOffset,
    file.byteOffset + file.byteLength
  ) as ArrayBuffer;

  return arrayBuffer;
}

export function getIpAddressFromRequest(req: Request): string {
  return req.ip ?? 'Unknown IP';
}
