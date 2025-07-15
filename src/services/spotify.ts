import { appEnv } from '../lib/env.ts';
import type { CurrentlyPlaying } from '../lib/types/spotify/parsed.ts';
import type {
  SpotifyTrack,
  SpotifyCurrentlyPlaying
} from '../lib/types/spotify/currently-playing.ts';

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

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: tokenBody
  });

  const data = (await response.json()) as AccessToken;

  return data;
}

type CachedAccessToken = {
  accessToken: string;
  expiredAt: Date;
};

let cachedAccessToken: CachedAccessToken | null = null;

/**
 * Returns the access token from the Spotify API, caching it for subsequent calls.
 * If the cached token is still valid, it will return that instead of fetching a new one.
 */
async function getAccessToken(): Promise<string> {
  if (cachedAccessToken && cachedAccessToken.expiredAt > new Date()) {
    return cachedAccessToken.accessToken;
  }

  const { access_token, expires_in } = await fetchNewAccessToken();

  // Add a 60 second buffer to the expiry time to ensure the token is valid
  const bufferExpiryOffset = 60;

  const expiresAt = new Date(
    Date.now() + (expires_in - bufferExpiryOffset) * 1000
  );

  cachedAccessToken = {
    accessToken: access_token,
    expiredAt: expiresAt
  };

  return cachedAccessToken.accessToken;
}

/**
 * Returns the currently playing song from the Spotify API.
 */
async function getCurrentlyPlaying(): Promise<CurrentlyPlaying | null> {
  const access_token = await getAccessToken();

  const response = await fetch(
    'https://api.spotify.com/v1/me/player/currently-playing',
    {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }
  );

  if (!response.ok) return null;

  const data = (await response.json()) as SpotifyCurrentlyPlaying;

  // TODO: Support episode type in the future
  const isTrackType = data.item?.type === 'track';

  if (!isTrackType) {
    return {
      isPlaying: false,
      item: null
    };
  }

  const item = data.item as SpotifyTrack;
  const isPlaying = data.is_playing;

  const trackName = item.name;
  const albumName = item.album.name;

  const isLocal = item.is_local;

  const trackUrl = isLocal ? null : item.external_urls.spotify;
  const albumImageUrl = isLocal ? null : item.album.images[0].url;

  const artistName = item.artists.map(({ name }) => name).join(', ');

  const nowPlaying: CurrentlyPlaying = {
    isPlaying: isPlaying,
    item: {
      trackUrl,
      trackName,
      albumName,
      artistName,
      albumImageUrl
    }
  };

  return nowPlaying;
}

export const SpotifyService = {
  getCurrentlyPlaying
};
