import { IPinfoWrapper } from 'node-ipinfo';
import { appEnv } from '../config/env.ts';

export const ipinfo = new IPinfoWrapper(appEnv.IPINFO_TOKEN);
