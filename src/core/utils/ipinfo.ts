import { IPinfoWrapper } from 'node-ipinfo';
import { appEnv } from './env.ts';

export const ipinfo = new IPinfoWrapper(appEnv.IPINFO_TOKEN);
