interface LastFmImage {
  '#text': string;
  size: 'small' | 'medium' | 'large' | 'extralarge' | string;
}

interface LastFmAlbum {
  name: string;
  artist: string;
  url: string;
  image: LastFmImage[];
  streamable: '0' | '1' | string;
  mbid: string;
}

interface LastFmAlbumMatches {
  album: LastFmAlbum[];
}

interface LastFmOpenSearchQuery {
  '#text': string;
  role: string;
  searchTerms: string;
  startPage: string;
}

interface LastFmResults {
  'opensearch:Query': LastFmOpenSearchQuery;
  'opensearch:totalResults': string;
  'opensearch:startIndex': string;
  'opensearch:itemsPerPage': string;
  albummatches: LastFmAlbumMatches;
  '@attr': {
    for: string;
  };
}

export interface IAlbumSearchResponse {
  results: LastFmResults;
}

export interface IAlbumSearchResultsResponse {
  meta: {
    search_term: string;
    start_page: string;
    items_per_page: string;
    start_index: string;
  };
  albuns: {
    name: string;
    cover: string;
    artist: string;
  }[];
}
