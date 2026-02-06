import { kv } from './kv.ts';
import { FatalError } from './error.ts';
import { getCachedData } from './cache.ts';

export async function enforceKillSwitch(): Promise<void> {
  const killSwitchKey = 'api:state:kill-switch';

  const killSwitchEnabled = await getCachedData({
    key: killSwitchKey,
    provider: 'memory',
    expiryInSeconds: 60,
    fetcher: () => kv.get(killSwitchKey)
  });

  if (killSwitchEnabled) {
    throw new FatalError({
      message:
        'Application kill switch is enabled. The application is forced to stop due critical issues.'
    });
  }
}
