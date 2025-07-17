export type Track = {
  trackUrl: string | null;
  trackName: string;
  albumName: string;
  artistName: string;
  timestamps: TrackTimestamps;
  albumImageUrl: string | null;
};

export type TrackTimestamps = {
  start: number;
  end: number;
};

export type CurrentlyPlaying = {
  isPlaying: boolean;
  item: Track | null;
};
