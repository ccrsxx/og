type MediaType = 'Unknown' | 'Video' | 'Audio' | 'Photo' | 'Book';

export type GeneralCommandType =
  | 'MoveUp'
  | 'MoveDown'
  | 'MoveLeft'
  | 'MoveRight'
  | 'PageUp'
  | 'PageDown'
  | 'PreviousLetter'
  | 'NextLetter'
  | 'ToggleOsd'
  | 'ToggleContextMenu'
  | 'Select'
  | 'Back'
  | 'TakeScreenshot'
  | 'SendKey'
  | 'SendString'
  | 'GoHome'
  | 'GoToSettings'
  | 'VolumeUp'
  | 'VolumeDown'
  | 'Mute'
  | 'Unmute'
  | 'ToggleMute'
  | 'SetVolume'
  | 'SetAudioStreamIndex'
  | 'SetSubtitleStreamIndex'
  | 'ToggleFullscreen'
  | 'DisplayContent'
  | 'GoToSearch'
  | 'DisplayMessage'
  | 'SetRepeatMode'
  | 'ChannelUp'
  | 'ChannelDown'
  | 'Guide'
  | 'ToggleStats'
  | 'PlayMediaSource'
  | 'PlayTrailers'
  | 'SetShuffleQueue'
  | 'PlayState'
  | 'PlayNext'
  | 'ToggleOsdMenu'
  | 'Play'
  | 'SetMaxStreamingBitrate'
  | 'SetPlaybackOrder';

export type PlayMethod = 'Transcode' | 'DirectStream' | 'DirectPlay';

export type RepeatMode = 'RepeatNone' | 'RepeatAll' | 'RepeatOne';

export type PlaybackOrder = 'Default' | 'Shuffle';

export type HardwareAccelerationType =
  | 'none'
  | 'amf'
  | 'qsv'
  | 'nvenc'
  | 'v4l2m2m'
  | 'vaapi'
  | 'videotoolbox'
  | 'rkmpp';

export type TranscodeReason =
  | 'ContainerNotSupported'
  | 'VideoCodecNotSupported'
  | 'AudioCodecNotSupported'
  | 'SubtitleCodecNotSupported'
  | 'AudioIsExternal'
  | 'SecondaryAudioNotSupported'
  | 'VideoProfileNotSupported'
  | 'VideoLevelNotSupported'
  | 'VideoResolutionNotSupported'
  | 'VideoBitDepthNotSupported'
  | 'VideoFramerateNotSupported'
  | 'RefFramesNotSupported'
  | 'AnamorphicVideoNotSupported'
  | 'InterlacedVideoNotSupported'
  | 'AudioChannelsNotSupported'
  | 'AudioProfileNotSupported'
  | 'AudioSampleRateNotSupported'
  | 'AudioBitDepthNotSupported'
  | 'ContainerBitrateExceedsLimit'
  | 'VideoBitrateNotSupported'
  | 'AudioBitrateNotSupported'
  | 'UnknownVideoStreamInfo'
  | 'UnknownAudioStreamInfo'
  | 'DirectPlayError'
  | 'VideoRangeTypeNotSupported'
  | 'VideoCodecTagNotSupported'
  | 'StreamCountExceedsLimit';

export type ExtraType =
  | 'Unknown'
  | 'Clip'
  | 'Trailer'
  | 'BehindTheScenes'
  | 'DeletedScene'
  | 'Interview'
  | 'Scene'
  | 'Sample'
  | 'ThemeSong'
  | 'ThemeVideo'
  | 'Featurette'
  | 'Short';

export type Video3DFormat =
  | 'HalfSideBySide'
  | 'FullSideBySide'
  | 'FullTopAndBottom'
  | 'HalfTopAndBottom'
  | 'MVC';

export type BaseItemKind =
  | 'AggregateFolder'
  | 'Audio'
  | 'AudioBook'
  | 'BasePluginFolder'
  | 'Book'
  | 'BoxSet'
  | 'Channel'
  | 'ChannelFolderItem'
  | 'CollectionFolder'
  | 'Episode'
  | 'Folder'
  | 'Genre'
  | 'ManualPlaylistsFolder'
  | 'Movie'
  | 'LiveTvChannel'
  | 'LiveTvProgram'
  | 'MusicAlbum'
  | 'MusicArtist'
  | 'MusicGenre'
  | 'MusicVideo'
  | 'Person'
  | 'Photo'
  | 'PhotoAlbum'
  | 'Playlist'
  | 'PlaylistsFolder'
  | 'Program'
  | 'Recording'
  | 'Season'
  | 'Series'
  | 'Studio'
  | 'Trailer'
  | 'TvChannel'
  | 'TvProgram'
  | 'UserRootFolder'
  | 'UserView'
  | 'Video'
  | 'Year';

export type LocationType = 'FileSystem' | 'Remote' | 'Virtual' | 'Offline';
export type IsoType = 'Dvd' | 'BluRay';
export type VideoType = 'VideoFile' | 'Iso' | 'Dvd' | 'BluRay';
export type ChannelType = 'TV' | 'Radio';
export type ProgramAudio =
  | 'Mono'
  | 'Stereo'
  | 'Dolby'
  | 'DolbyDigital'
  | 'Thx'
  | 'Atmos';
export type PlayAccess = 'Full' | 'None';
export type DayOfWeek =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

export type ImageOrientation =
  | 'TopLeft'
  | 'TopRight'
  | 'BottomRight'
  | 'BottomLeft'
  | 'LeftTop'
  | 'RightTop'
  | 'RightBottom'
  | 'LeftBottom';

export type PersonKind =
  | 'Unknown'
  | 'Actor'
  | 'Director'
  | 'Composer'
  | 'Writer'
  | 'GuestStar'
  | 'Producer'
  | 'Conductor'
  | 'Lyricist'
  | 'Arranger'
  | 'Engineer'
  | 'Mixer'
  | 'Remixer'
  | 'Creator'
  | 'Artist'
  | 'AlbumArtist'
  | 'Author'
  | 'Illustrator'
  | 'Penciller'
  | 'Inker'
  | 'Colorist'
  | 'Letterer'
  | 'CoverArtist'
  | 'Editor'
  | 'Translator';

export type DlnaProfileType =
  | 'Audio'
  | 'Video'
  | 'Photo'
  | 'Subtitle'
  | 'Lyric';
export type CodecType = 'Video' | 'VideoAudio' | 'Audio';
export type ProfileConditionType =
  | 'Equals'
  | 'NotEquals'
  | 'LessThanEqual'
  | 'GreaterThanEqual'
  | 'EqualsAny';
export type ProfileConditionValue =
  | 'AudioChannels'
  | 'AudioBitrate'
  | 'AudioProfile'
  | 'Width'
  | 'Height'
  | 'Has64BitOffsets'
  | 'PacketLength'
  | 'VideoBitDepth'
  | 'VideoBitrate'
  | 'VideoFramerate'
  | 'VideoLevel'
  | 'VideoProfile'
  | 'VideoTimestamp'
  | 'IsAnamorphic'
  | 'RefFrames'
  | 'NumAudioStreams'
  | 'NumVideoStreams'
  | 'IsSecondaryAudio'
  | 'VideoCodecTag'
  | 'IsAvc'
  | 'IsInterlaced'
  | 'AudioSampleRate'
  | 'AudioBitDepth'
  | 'VideoRangeType'
  | 'NumStreams';

export type SubtitleDeliveryMethod =
  | 'Encode'
  | 'Embed'
  | 'External'
  | 'Hls'
  | 'Drop';

export type MediaStreamProtocol = 'http' | 'hls';
export type TranscodeSeekInfo = 'Auto' | 'Bytes';
export type EncodingContext = 'Streaming' | 'Static';

export type MediaProtocol =
  | 'File'
  | 'Http'
  | 'Rtmp'
  | 'Rtsp'
  | 'Udp'
  | 'Rtp'
  | 'Ftp';
export type MediaSourceType = 'Default' | 'Grouping' | 'Placeholder';
export type TransportStreamTimestamp = 'None' | 'Zero' | 'Valid';
export type VideoRange = 'Unknown' | 'SDR' | 'HDR';
export type VideoRangeType =
  | 'Unknown'
  | 'SDR'
  | 'HDR10'
  | 'HLG'
  | 'DOVI'
  | 'DOVIWithHDR10'
  | 'DOVIWithHLG'
  | 'DOVIWithSDR'
  | 'DOVIWithEL'
  | 'DOVIWithHDR10Plus'
  | 'DOVIWithELHDR10Plus'
  | 'DOVIInvalid'
  | 'HDR10Plus';
export type AudioSpatialFormat = 'None' | 'DolbyAtmos' | 'DTSX';
export type MediaStreamType =
  | 'Audio'
  | 'Video'
  | 'Subtitle'
  | 'EmbeddedImage'
  | 'Data'
  | 'Lyric';

export type ProfileCondition = {
  Condition: ProfileConditionType;
  Property: ProfileConditionValue;
  Value: string | null;
  IsRequired: boolean;
};

export type DirectPlayProfile = {
  Container: string;
  AudioCodec: string | null;
  VideoCodec: string | null;
  Type: DlnaProfileType;
};

export type TranscodingProfile = {
  Container: string;
  Type: DlnaProfileType;
  VideoCodec: string;
  AudioCodec: string;
  Protocol: MediaStreamProtocol;
  EstimateContentLength: boolean;
  EnableMpegtsM2TsMode: boolean;
  TranscodeSeekInfo: TranscodeSeekInfo;
  CopyTimestamps: boolean;
  Context: EncodingContext;
  EnableSubtitlesInManifest: boolean;
  MaxAudioChannels: string | null;
  MinSegments: number;
  SegmentLength: number;
  BreakOnNonKeyFrames: boolean;
  Conditions: ProfileCondition[];
  EnableAudioVbrEncoding: boolean;
};

export type ContainerProfile = {
  Type: DlnaProfileType;
  Conditions: ProfileCondition[];
  Container: string | null;
  SubContainer: string | null;
};

export type CodecProfile = {
  Type: CodecType;
  Conditions: ProfileCondition[];
  ApplyConditions: ProfileCondition[];
  Codec: string | null;
  Container: string | null;
  SubContainer: string | null;
};

export type SubtitleProfile = {
  Format: string | null;
  Method: SubtitleDeliveryMethod;
  DidlMode: string | null;
  Language: string | null;
  Container: string | null;
};

export type DeviceProfile = {
  Name: string | null;
  Id: string | null;
  MaxStreamingBitrate: number | null;
  MaxStaticBitrate: number | null;
  MusicStreamingTranscodingBitrate: number | null;
  MaxStaticMusicBitrate: number | null;
  DirectPlayProfiles: DirectPlayProfile[];
  TranscodingProfiles: TranscodingProfile[];
  ContainerProfiles: ContainerProfile[];
  CodecProfiles: CodecProfile[];
  SubtitleProfiles: SubtitleProfile[];
};

export type ClientCapabilities = {
  PlayableMediaTypes: MediaType[];
  SupportedCommands: GeneralCommandType[];
  SupportsMediaControl: boolean;
  SupportsPersistentIdentifier: boolean;
  DeviceProfile: DeviceProfile | null;
  AppStoreUrl: string | null;
  IconUrl: string | null;
};

export type MediaStream = {
  Codec: string | null;
  CodecTag: string | null;
  Language: string | null;
  ColorRange: string | null;
  ColorSpace: string | null;
  ColorTransfer: string | null;
  ColorPrimaries: string | null;
  DvVersionMajor: number | null;
  DvVersionMinor: number | null;
  DvProfile: number | null;
  DvLevel: number | null;
  RpuPresentFlag: number | null;
  ElPresentFlag: number | null;
  BlPresentFlag: number | null;
  DvBlSignalCompatibilityId: number | null;
  Rotation: number | null;
  Comment: string | null;
  TimeBase: string | null;
  CodecTimeBase: string | null;
  Title: string | null;
  Hdr10PlusPresentFlag: boolean | null;
  VideoRange: VideoRange;
  VideoRangeType: VideoRangeType;
  VideoDoViTitle: string | null;
  AudioSpatialFormat: AudioSpatialFormat;
  LocalizedUndefined: string | null;
  LocalizedDefault: string | null;
  LocalizedForced: string | null;
  LocalizedExternal: string | null;
  LocalizedHearingImpaired: string | null;
  DisplayTitle: string | null;
  NalLengthSize: string | null;
  IsInterlaced: boolean;
  IsAVC: boolean | null;
  ChannelLayout: string | null;
  BitRate: number | null;
  BitDepth: number | null;
  RefFrames: number | null;
  PacketLength: number | null;
  Channels: number | null;
  SampleRate: number | null;
  IsDefault: boolean;
  IsForced: boolean;
  IsHearingImpaired: boolean;
  Height: number | null;
  Width: number | null;
  AverageFrameRate: number | null;
  RealFrameRate: number | null;
  ReferenceFrameRate: number | null;
  Profile: string | null;
  Type: MediaStreamType;
  AspectRatio: string | null;
  Index: number;
  Score: number | null;
  IsExternal: boolean;
  DeliveryMethod: SubtitleDeliveryMethod | null;
  DeliveryUrl: string | null;
  IsExternalUrl: boolean | null;
  IsTextSubtitleStream: boolean;
  SupportsExternalStream: boolean;
  Path: string | null;
  PixelFormat: string | null;
  Level: number | null;
  IsAnamorphic: boolean | null;
};

export type MediaAttachment = {
  Codec: string | null;
  CodecTag: string | null;
  Comment: string | null;
  Index: number;
  FileName: string | null;
  MimeType: string | null;
  DeliveryUrl: string | null;
};

export type MediaSourceInfo = {
  Protocol: MediaProtocol;
  Id: string | null;
  Path: string | null;
  EncoderPath: string | null;
  EncoderProtocol: MediaProtocol | null;
  Type: MediaSourceType;
  Container: string | null;
  Size: number | null;
  Name: string | null;
  IsRemote: boolean;
  ETag: string | null;
  RunTimeTicks: number | null;
  ReadAtNativeFramerate: boolean;
  IgnoreDts: boolean;
  IgnoreIndex: boolean;
  GenPtsInput: boolean;
  SupportsTranscoding: boolean;
  SupportsDirectStream: boolean;
  SupportsDirectPlay: boolean;
  IsInfiniteStream: boolean;
  UseMostCompatibleTranscodingProfile: boolean;
  RequiresOpening: boolean;
  OpenToken: string | null;
  RequiresClosing: boolean;
  LiveStreamId: string | null;
  BufferMs: number | null;
  RequiresLooping: boolean;
  SupportsProbing: boolean;
  VideoType: VideoType | null;
  IsoType: IsoType | null;
  Video3DFormat: Video3DFormat | null;
  MediaStreams: MediaStream[] | null;
  MediaAttachments: MediaAttachment[] | null;
  Formats: string[] | null;
  Bitrate: number | null;
  FallbackMaxStreamingBitrate: number | null;
  Timestamp: TransportStreamTimestamp | null;
  RequiredHttpHeaders: Record<string, string | null> | null;
  TranscodingUrl: string | null;
  TranscodingSubProtocol: MediaStreamProtocol;
  TranscodingContainer: string | null;
  AnalyzeDurationMs: number | null;
  DefaultAudioStreamIndex: number | null;
  DefaultSubtitleStreamIndex: number | null;
  HasSegments: boolean;
};

export type ExternalUrl = {
  Name: string | null;
  Url: string | null;
};

export type MediaUrl = {
  Url: string | null;
  Name: string | null;
};

export type UserItemData = {
  Rating: number | null;
  PlayedPercentage: number | null;
  UnplayedItemCount: number | null;
  PlaybackPositionTicks: number | null;
  PlayCount: number | null;
  IsFavorite: boolean;
  Likes: boolean | null;
  LastPlayedDate: string | null;
  Played: boolean;
  Key: string;
  ItemId: string;
};

export type BaseItemPerson = {
  Name: string | null;
  Id: string;
  Role: string | null;
  Type: PersonKind;
  PrimaryImageTag: string | null;
  ImageBlurHashes: {
    Primary: Record<string, string>;
    Art: Record<string, string>;
    Backdrop: Record<string, string>;
    Banner: Record<string, string>;
    Logo: Record<string, string>;
    Thumb: Record<string, string>;
    Disc: Record<string, string>;
    Box: Record<string, string>;
    Screenshot: Record<string, string>;
    Menu: Record<string, string>;
    Chapter: Record<string, string>;
    BoxRear: Record<string, string>;
    Profile: Record<string, string>;
  } | null;
};

export type NameGuidPair = {
  Name: string | null;
  Id: string;
};

export type ChapterInfo = {
  StartPositionTicks: number;
  Name: string | null;
  ImagePath: string | null;
  ImageDateModified: string;
  ImageTag: string | null;
};

export type TrickplayInfo = {
  Width: number;
  Height: number;
  TileWidth: number;
  TileHeight: number;
  ThumbnailCount: number;
  Interval: number;
  Bandwidth: number;
};

export type BaseItem = {
  Name: string | null;
  OriginalTitle: string | null;
  ServerId: string | null;
  Id: string;
  Etag: string | null;
  SourceType: string | null;
  PlaylistItemId: string | null;
  DateCreated: string | null;
  DateLastMediaAdded: string | null;
  ExtraType: ExtraType | null;
  AirsBeforeSeasonNumber: number | null;
  AirsAfterSeasonNumber: number | null;
  AirsBeforeEpisodeNumber: number | null;
  CanDelete: boolean | null;
  CanDownload: boolean | null;
  HasLyrics: boolean | null;
  HasSubtitles: boolean | null;
  PreferredMetadataLanguage: string | null;
  PreferredMetadataCountryCode: string | null;
  Container: string | null;
  SortName: string | null;
  ForcedSortName: string | null;
  Video3DFormat: Video3DFormat | null;
  PremiereDate: string | null;
  ExternalUrls: ExternalUrl[] | null;
  MediaSources: MediaSourceInfo[] | null;
  CriticRating: number | null;
  ProductionLocations: string[] | null;
  Path: string | null;
  EnableMediaSourceDisplay: boolean | null;
  OfficialRating: string | null;
  CustomRating: string | null;
  ChannelId: string | null;
  ChannelName: string | null;
  Overview: string | null;
  Taglines: string[] | null;
  Genres: string[] | null;
  CommunityRating: number | null;
  CumulativeRunTimeTicks: number | null;
  RunTimeTicks: number | null;
  PlayAccess: PlayAccess | null;
  AspectRatio: string | null;
  ProductionYear: number | null;
  IsPlaceHolder: boolean | null;
  Number: string | null;
  ChannelNumber: string | null;
  IndexNumber: number | null;
  IndexNumberEnd: number | null;
  ParentIndexNumber: number | null;
  RemoteTrailers: MediaUrl[] | null;
  ProviderIds: Record<string, string | null> | null;
  IsHD: boolean | null;
  IsFolder: boolean | null;
  ParentId: string | null;
  Type: BaseItemKind;
  People: BaseItemPerson[] | null;
  Studios: NameGuidPair[] | null;
  GenreItems: NameGuidPair[] | null;
  ParentLogoItemId: string | null;
  ParentBackdropItemId: string | null;
  ParentBackdropImageTags: string[] | null;
  LocalTrailerCount: number | null;
  UserData: UserItemData | null;
  RecursiveItemCount: number | null;
  ChildCount: number | null;
  SeriesName: string | null;
  SeriesId: string | null;
  SeasonId: string | null;
  SpecialFeatureCount: number | null;
  DisplayPreferencesId: string | null;
  Status: string | null;
  AirTime: string | null;
  AirDays: DayOfWeek[] | null;
  Tags: string[] | null;
  PrimaryImageAspectRatio: number | null;
  Artists: string[] | null;
  ArtistItems: NameGuidPair[] | null;
  Album: string | null;
  CollectionType: string | null;
  DisplayOrder: string | null;
  AlbumId: string | null;
  AlbumPrimaryImageTag: string | null;
  SeriesPrimaryImageTag: string | null;
  AlbumArtist: string | null;
  AlbumArtists: NameGuidPair[] | null;
  SeasonName: string | null;
  MediaStreams: MediaStream[] | null;
  VideoType: VideoType | null;
  PartCount: number | null;
  MediaSourceCount: number | null;
  ImageTags: Record<string, string> | null;
  BackdropImageTags: string[] | null;
  ScreenshotImageTags: string[] | null;
  ParentLogoImageTag: string | null;
  ParentArtItemId: string | null;
  ParentArtImageTag: string | null;
  SeriesThumbImageTag: string | null;
  ImageBlurHashes: {
    Primary: Record<string, string>;
    Art: Record<string, string>;
    Backdrop: Record<string, string>;
    Banner: Record<string, string>;
    Logo: Record<string, string>;
    Thumb: Record<string, string>;
    Disc: Record<string, string>;
    Box: Record<string, string>;
    Screenshot: Record<string, string>;
    Menu: Record<string, string>;
    Chapter: Record<string, string>;
    BoxRear: Record<string, string>;
    Profile: Record<string, string>;
  } | null;
  SeriesStudio: string | null;
  ParentThumbItemId: string | null;
  ParentThumbImageTag: string | null;
  ParentPrimaryImageItemId: string | null;
  ParentPrimaryImageTag: string | null;
  Chapters: ChapterInfo[] | null;
  Trickplay: Record<string, Record<string, TrickplayInfo>> | null;
  LocationType: LocationType | null;
  IsoType: IsoType | null;
  MediaType: MediaType;
  EndDate: string | null;
  LockedFields: string[] | null;
  TrailerCount: number | null;
  MovieCount: number | null;
  SeriesCount: number | null;
  ProgramCount: number | null;
  EpisodeCount: number | null;
  SongCount: number | null;
  AlbumCount: number | null;
  ArtistCount: number | null;
  MusicVideoCount: number | null;
  LockData: boolean | null;
  Width: number | null;
  Height: number | null;
  CameraMake: string | null;
  CameraModel: string | null;
  Software: string | null;
  ExposureTime: number | null;
  FocalLength: number | null;
  ImageOrientation: ImageOrientation | null;
  Aperture: number | null;
  ShutterSpeed: number | null;
  Latitude: number | null;
  Longitude: number | null;
  Altitude: number | null;
  IsoSpeedRating: number | null;
  SeriesTimerId: string | null;
  ProgramId: string | null;
  ChannelPrimaryImageTag: string | null;
  StartDate: string | null;
  CompletionPercentage: number | null;
  IsRepeat: boolean | null;
  EpisodeTitle: string | null;
  ChannelType: ChannelType | null;
  Audio: ProgramAudio | null;
  IsMovie: boolean | null;
  IsSports: boolean | null;
  IsSeries: boolean | null;
  IsLive: boolean | null;
  IsNews: boolean | null;
  IsKids: boolean | null;
  IsPremiere: boolean | null;
  TimerId: string | null;
  NormalizationGain: number | null;
  CurrentProgram: BaseItem | null;
};

export type PlayerStateInfo = {
  PositionTicks: number | null;
  CanSeek: boolean;
  IsPaused: boolean;
  IsMuted: boolean;
  VolumeLevel: number | null;
  AudioStreamIndex: number | null;
  SubtitleStreamIndex: number | null;
  MediaSourceId: string | null;
  PlayMethod: PlayMethod | null;
  RepeatMode: RepeatMode | null;
  PlaybackOrder: PlaybackOrder | null;
  LiveStreamId: string | null;
};

export type SessionUserInfo = {
  UserId: string;
  UserName: string | null;
};

export type TranscodingInfo = {
  AudioCodec: string | null;
  VideoCodec: string | null;
  Container: string | null;
  IsVideoDirect: boolean;
  IsAudioDirect: boolean;
  Bitrate: number | null;
  Framerate: number | null;
  CompletionPercentage: number | null;
  Width: number | null;
  Height: number | null;
  AudioChannels: number | null;
  HardwareAccelerationType: HardwareAccelerationType | null;
  TranscodeReasons: TranscodeReason[];
};

export type QueueItem = {
  Id: string;
  PlaylistItemId: string | null;
};

export type SessionInfo = {
  PlayState: PlayerStateInfo | null;
  AdditionalUsers: SessionUserInfo[] | null;
  Capabilities: ClientCapabilities | null;
  RemoteEndPoint: string | null;
  PlayableMediaTypes: MediaType[];
  Id: string | null;
  UserId: string;
  UserName: string | null;
  Client: string | null;
  LastActivityDate: string;
  LastPlaybackCheckIn: string;
  LastPausedDate: string | null;
  DeviceName: string | null;
  DeviceType: string | null;
  NowPlayingItem: BaseItem | null;
  NowViewingItem: BaseItem | null;
  DeviceId: string | null;
  ApplicationVersion: string | null;
  TranscodingInfo: TranscodingInfo | null;
  IsActive: boolean;
  SupportsMediaControl: boolean;
  SupportsRemoteControl: boolean;
  NowPlayingQueue: QueueItem[] | null;
  NowPlayingQueueFullItems: BaseItem[] | null;
  HasCustomDeviceName: boolean;
  PlaylistItemId: string | null;
  ServerId: string | null;
  UserPrimaryImageTag: string | null;
  SupportedCommands: GeneralCommandType[];
};
