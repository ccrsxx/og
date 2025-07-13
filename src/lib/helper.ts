import { readFile } from 'fs/promises';

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
