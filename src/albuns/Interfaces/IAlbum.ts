export interface IAlbum {
  id_spotify: string;
  artist: string;
  artists: string[];
  tags: string[];
  name: string;
  cover: {
    size: string;
    photo_url: string;
  };
  tracks: {
    name: string;
    duration: number;
    position_original: number;
    url: string;
    id_spotify?: string;
    artists?: string[];
  }[];
  wiki?: {
    published: string;
    summary: string;
  };
}
