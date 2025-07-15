import { z } from 'zod';

export const validStringSchema = z.string().trim().min(1);
