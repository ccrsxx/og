import { appEnv } from '../../core/utils/env.ts';
import { logger } from '../../core/loaders/pino.ts';
import { AppError, HttpError } from '../../core/utils/error.ts';
import { getCachedData } from '../../core/utils/cache.ts';
import type { CurrentlyPlaying } from '../../core/utils/types/currently-playing.ts';

type AccessToken = {
  scope: string;
  expires_in: number;
  token_type: string;
  access_token: string;
};

/**
 * Returns the access token from the Spotify API.
 */
async function fetchNewAccessToken(): Promise<AccessToken> {
  const token = Buffer.from(
    `${appEnv.SPOTIFY_CLIENT_ID}:${appEnv.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const tokenBody = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: appEnv.SPOTIFY_REFRESH_TOKEN
  });

  let response: Response;

  try {
    response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: tokenBody
    });
  } catch (error) {
    throw new AppError({
      message: 'Failed to fetch Spotify access token',
      cause: error
    });
  }

  if (!response.ok) {
    logger.error(
      { status: response.status, statusText: response.statusText },
      'Error while fetching Spotify access token'
    );

    throw new HttpError(502, {
      message: 'Failed to fetch Spotify access token'
    });
  }

  let data: AccessToken;

  try {
    data = (await response.json()) as AccessToken;
  } catch (err) {
    throw new AppError({
      message: 'Spotify returned malformed JSON for access token',
      cause: err
    });
  }

  return data;
}

/**
 * Returns the access token from the Spotify API, caching it for subsequent calls.
 * If the cached token is still valid, it will return that instead of fetching a new one.
 */
async function getAccessToken(): Promise<string> {
  // Add a 60 second buffer to the expiry time to ensure the token is valid when used.
  const bufferExpiryOffset = 60;

  let tokenData: AccessToken;

  try {
    tokenData = await getCachedData({
      key: 'api:spotify:access_token',
      provider: 'memory',
      fetcher: fetchNewAccessToken,
      expiryInSeconds: (data) => data.expires_in - bufferExpiryOffset
    });
  } catch (error) {
    throw new AppError({
      message: 'Failed to get Spotify access token',
      cause: error
    });
  }

  return tokenData.access_token;
}

/**
 * Returns the currently playing song from the Spotify API.
 */
async function getCurrentlyPlaying(): Promise<CurrentlyPlaying | null> {
  const accessToken = await getAccessToken();

  let response: Response;

  try {
    response = await fetch(
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      logger.error(
        { status: response.status, statusText: response.statusText },
        'Error while fetching currently playing track from Spotify'
      );

      return {
        item: null,
        platform: 'spotify',
        isPlaying: false
      };
    }
  } catch (error) {
    throw new AppError({
      message: 'Failed to fetch currently playing track from Spotify',
      cause: error
    });
  }

  if (response.status === 204) {
    logger.info('No currently playing track found on Spotify');

    return {
      item: null,
      platform: 'spotify',
      isPlaying: false
    };
  }

  let data: SpotifyApi.CurrentlyPlayingResponse;

  try {
    data = (await response.json()) as SpotifyApi.CurrentlyPlayingResponse;
  } catch (err) {
    throw new AppError({
      message: 'Spotify returned malformed JSON',
      cause: err
    });
  }

  // TODO: Support episode type in the future
  const isTrackType = data.item?.type === 'track';

  if (!isTrackType) {
    return {
      item: null,
      platform: 'spotify',
      isPlaying: false
    };
  }

  const item = data.item as SpotifyApi.TrackObjectFull;
  const isPlaying = data.is_playing;

  const trackName = item.name;
  const albumName = item.album.name;

  const isLocal = item.is_local;

  const trackUrl = isLocal ? null : item.external_urls.spotify;
  const albumImageUrl = isLocal ? null : item.album.images[0].url;

  const artistName = item.artists.map(({ name }) => name).join(', ');

  const progressMs = data.progress_ms ?? 0;
  const durationMs = data.item?.duration_ms ?? 0;

  const currentlyPlaying: CurrentlyPlaying = {
    platform: 'spotify',
    isPlaying: isPlaying,
    item: {
      trackUrl,
      trackName,
      albumName,
      artistName,
      progressMs,
      durationMs,
      albumImageUrl
    }
  };

  return currentlyPlaying;
}

export const SpotifyService = {
  getCurrentlyPlaying
};
