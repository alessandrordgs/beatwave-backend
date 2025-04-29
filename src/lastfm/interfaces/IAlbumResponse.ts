export interface IAlbumResponse {
  album: {
    artist: string;
    mbid: string;
    tags: {
      tag: {
        url: string;
        name: string;
      }[];
    };
    name: string;
    image: {
      size: string;
      '#text': string;
    }[];
    tracks: {
      track: Track[];
    };
    listeners: string;
    playcount: string;
    url: string;
    wiki?: {
      published: string;
      summary: string;
    };
  };
}

interface Track {
  streamable: {
    fulltrack: string;
    '#text': string;
  };
  duration: number | null;
  url: string;
  name: string;
  '@attr': {
    rank: number;
  };
  artist: {
    url: string;
    name: string;
    mbid: string;
  };
}
