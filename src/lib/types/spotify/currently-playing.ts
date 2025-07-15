export type SpotifyCurrentlyPlaying = {
  timestamp: number;
  context: SpotifyContext | null;
  progress_ms: number | null;
  item: PlayableItem | null;
  currently_playing_type: CurrentlyPlayingType;
  device: SpotifyDevice;
  repeat_state: RepeatState;
  shuffle_state: boolean;
  is_playing: boolean;
  actions: SpotifyActions;
};

export type PlayableItem = SpotifyTrack | SpotifyEpisode;

export type SpotifyTrack = {
  album: SpotifyAlbum;
  artists: SpotifyArtistSimplified[];
  available_markets: string;
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: SpotifyExternalIds;
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  is_playable?: boolean;
  linked_from?: object;
  restrictions?: SpotifyRestrictions;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: 'track';
  uri: string;
  is_local: boolean;
};

export type SpotifyEpisode = {
  audio_preview_url: string | null;
  description: string;
  html_description: string;
  duration_ms: number;
  explicit: boolean;
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage;
  is_externally_hosted: boolean;
  is_playable: boolean;
  language?: string;
  languages: string;
  name: string;
  release_date: string;
  release_date_precision: ReleaseDatePrecision;
  resume_point?: SpotifyResumePoint;
  type: 'episode';
  uri: string;
  restrictions?: SpotifyRestrictions;
  show: SpotifyShow;
};

export type SpotifyAlbum = {
  album_type: AlbumType;
  total_tracks: number;
  available_markets: string;
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: ReleaseDatePrecision;
  restrictions?: SpotifyRestrictions;
  type: 'album';
  uri: string;
  artists: SpotifyArtistSimplified;
};

export type SpotifyShow = {
  available_markets: string;
  copyrights: SpotifyCopyright;
  description: string;
  html_description: string;
  explicit: boolean;
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage;
  is_externally_hosted: boolean;
  languages: string;
  media_type: string;
  name: string;
  publisher: string;
  type: 'show';
  uri: string;
  total_episodes: number;
};

export type SpotifyDevice = {
  id: string | null;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number | null;
  supports_volume: boolean;
};

export type SpotifyContext = {
  type: string;
  href: string;
  external_urls: SpotifyExternalUrls;
  uri: string;
};

export type SpotifyActions = {
  interrupting_playback?: boolean;
  pausing?: boolean;
  resuming?: boolean;
  seeking?: boolean;
  skipping_next?: boolean;
  skipping_prev?: boolean;
  toggling_repeat_context?: boolean;
  toggling_shuffle?: boolean;
  toggling_repeat_track?: boolean;
  transferring_playback?: boolean;
};

export type SpotifyImage = {
  url: string;
  height: number | null;
  width: number | null;
};

export type SpotifyArtistSimplified = {
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  name: string;
  type: 'artist';
  uri: string;
};

export type SpotifyExternalUrls = {
  spotify: string;
  [key: string]: string;
};

export type SpotifyExternalIds = {
  isrc?: string;
  ean?: string;
  upc?: string;
};

export type SpotifyRestrictions = {
  reason: RestrictionReason;
};

export type SpotifyCopyright = {
  text: string;
  type: 'C' | 'P';
};

export type SpotifyResumePoint = {
  fully_played: boolean;
  resume_position_ms: number;
};

export type RepeatState = 'off' | 'track' | 'context';

export type CurrentlyPlayingType = 'track' | 'episode' | 'ad' | 'unknown';

export type AlbumType = 'album' | 'single' | 'compilation';

export type ReleaseDatePrecision = 'year' | 'month' | 'day';

export type RestrictionReason = 'market' | 'product' | 'explicit';
