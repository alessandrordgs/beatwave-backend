export interface IAlbum {
  artist: string;
  tags: {
    name: string;
    url: string;
  }[];
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
  }[];
  wiki?: {
    published: string;
    summary: string;
  };
}
