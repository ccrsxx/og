import { appEnv } from '../../core/utils/env.ts';
import { logger } from '../../core/loaders/pino.ts';
import type { CurrentlyPlaying } from '../../core/utils/types/currently-playing.ts';
import type { SessionInfo } from '../../core/utils/types/jellyfin.ts';

// Cache state to handle transition gaps
let lastState: CurrentlyPlaying | null = null;
let lastStateTime = 0;

const GRACE_PERIOD_MS = 5000; // 5 seconds grace period

export async function getCurrentlyPlaying(): Promise<CurrentlyPlaying> {
  const response = await fetch(`${appEnv.JELLYFIN_URL}/Sessions`, {
    headers: {
      'X-MediaBrowser-Token': appEnv.JELLYFIN_API_KEY
    }
  });

  if (!response.ok) {
    logger.error(
      { status: response.status, statusText: response.statusText },
      'Error while fetching currently playing from Jellyfin'
    );

    return { platform: 'jellyfin', isPlaying: false, item: null };
  }

  const sessions = (await response.json()) as SessionInfo[];

  const playingSession = sessions.find(
    ({ NowPlayingItem, PlayState, UserName }) => {
      // Only specific user
      if (UserName !== appEnv.JELLYFIN_USERNAME) return false;

      // Must have an item and PlayState
      if (!NowPlayingItem || !PlayState) return false;

      // Must be audio type
      if (NowPlayingItem.Type !== 'Audio') return false;

      return true;
    }
  );

  if (!playingSession) {
    logger.info('No currently playing track found on Jellyfin');

    return getCachedStateOrEmpty();
  }

  type PlayingSession = SessionInfo & {
    PlayState: NonNullable<SessionInfo['PlayState']>;
    NowPlayingItem: NonNullable<SessionInfo['NowPlayingItem']>;
  };

  const { PlayState: playState, NowPlayingItem: nowPlayingItem } =
    playingSession as PlayingSession;

  const trackName = nowPlayingItem.Name ?? 'Unknown Track';

  const artistName = nowPlayingItem.Artists?.join(', ') ?? 'Unknown Artist';

  const albumName =
    nowPlayingItem.Album ?? nowPlayingItem.OriginalTitle ?? 'Unknown Album';

  const albumImageUrl = `${appEnv.JELLYFIN_IMAGE_URL}/Items/${nowPlayingItem.Id}/Images/Primary`;

  // Jellyfin does not have a public track URL, user must be logged in to the server to access it
  const trackUrl = null;

  // Jellyfin uses "Ticks". 1 ms = 10,000 Ticks. Convert to ms.
  const durationMs = nowPlayingItem.RunTimeTicks
    ? Math.floor(nowPlayingItem.RunTimeTicks / 10000)
    : 0;

  const progressMs = playState.PositionTicks
    ? Math.floor(playState.PositionTicks / 10000)
    : 0;

  const currentState: CurrentlyPlaying = {
    platform: 'jellyfin',
    isPlaying: !playState.IsPaused,
    item: {
      trackUrl,
      trackName,
      albumName,
      artistName,
      durationMs,
      progressMs,
      albumImageUrl
    }
  };

  // Update cache
  lastState = currentState;
  lastStateTime = Date.now();

  return currentState;
}

function getCachedStateOrEmpty(): CurrentlyPlaying {
  const shouldUseCache =
    lastState &&
    lastState.isPlaying &&
    Date.now() - lastStateTime < GRACE_PERIOD_MS;

  if (shouldUseCache) {
    return getExtrapolatedState();
  }

  return { platform: 'jellyfin', isPlaying: false, item: null };
}

function getExtrapolatedState(): CurrentlyPlaying {
  if (!lastState || !lastState.item) {
    return { platform: 'jellyfin', isPlaying: false, item: null };
  }

  const elapsed = Date.now() - lastStateTime;
  const extrapolatedProgress = lastState.item.progressMs + elapsed;

  // Clamp progress to duration
  const progressMs = Math.min(lastState.item.durationMs, extrapolatedProgress);

  return {
    ...lastState,
    item: {
      ...lastState.item,
      progressMs
    }
  };
}

export const JellyfinService = {
  getCurrentlyPlaying
};
