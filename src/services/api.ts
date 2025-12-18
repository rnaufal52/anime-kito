export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}

interface Init extends RequestInit {
  next?: NextFetchRequestConfig;
}

const fetchWithCache = (url: string, options?: Init) => fetch(url, options);

export interface Pagination {
  current_page: number;
  last_visible_page: number;
  has_next_page: boolean;
  next_page: number | null;
  has_previous_page: boolean;
  previous_page: number | null;
}

export interface AnimeOngoing {
  title: string;
  slug: string;
  poster: string;
  current_episode: string;
  release_day: string;
  newest_release_date: string;
  otakudesu_url: string;
}

export interface AnimeComplete {
  title: string;
  slug: string;
  poster: string;
  episode_count: string;
  rating: string;
  last_release_date: string;
  otakudesu_url: string;
}

export interface HomeResponse {
  data: {
    ongoing_anime: AnimeOngoing[];
    complete_anime: AnimeComplete[];
  };
}

export interface OngoingResponse {
  data: {
    paginationData: Pagination;
    ongoingAnimeData: AnimeOngoing[];
  };
}

export interface CompleteResponse {
  data: {
    paginationData: Pagination;
    completeAnimeData: AnimeComplete[];
  };
}

export interface Genre {
  name: string;
  slug: string;
  otakudesu_url: string;
}

export interface Episode {
  episode: string;
  episode_number: number;
  slug: string;
  otakudesu_url: string;
}

export interface Recommendation {
  title: string;
  slug: string;
  poster: string;
  otakudesu_url: string;
}

export interface AnimeDetail {
  title: string;
  slug: string;
  japanese_title: string;
  poster: string;
  rating: string;
  produser: string;
  type: string;
  status: string;
  episode_count: string;
  duration: string;
  release_date: string;
  studio: string;
  genres: Genre[];
  synopsis: string;
  batch: string | null;
  episode_lists: Episode[];
  recommendations: Recommendation[];
}

export interface StreamUrl {
  resolution: string;
  urls: {
    provider: string;
    url: string;
  }[];
}

export interface EpisodeDetail {
  episode: string;
  anime: {
    slug: string;
    otakudesu_url: string;
  };
  has_next_episode: boolean;
  next_episode: {
    slug: string;
    otakudesu_url: string;
  } | null;
  has_previous_episode: boolean;
  previous_episode: {
    slug: string;
    otakudesu_url: string;
  } | null;
  stream_url: string;
  download_urls: {
    mp4: StreamUrl[];
    mkv: StreamUrl[];
  };
}

export interface EpisodeResponse {
  data: EpisodeDetail;
}

export interface AnimeDetailResponse {
  data: AnimeDetail;
}


export interface AnimeSearch {
  title: string;
  slug: string;
  poster: string;
  genres: Genre[];
  status: string;
  rating: string;
  url: string;
}

export interface SearchResponse {
  data: AnimeSearch[];
}

export interface ScheduleAnime {
  anime_name: string;
  url: string;
  slug: string;
}

export interface ScheduleDay {
  day: string;
  anime_list: ScheduleAnime[];
}

export interface ScheduleResponse {
  data: ScheduleDay[];
}

export interface AnimeByGenre {
  title: string;
  slug: string;
  poster: string;
  rating: string;
  episode_count: string | null;
  season: string;
  studio: string;
  genres: Genre[];
  synopsis: string;
  otakudesu_url: string;
}

export interface GenreDetailResponse {
  data: {
    anime: AnimeByGenre[];
    pagination: Pagination;
  };
}

export const api = {
  getHome: async (): Promise<HomeResponse> => {
    const res = await fetchWithCache(`${BASE_URL}/home`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch home data');
    return res.json();
  },

  getOngoingAnime: async (page: number = 1): Promise<OngoingResponse> => {
    const res = await fetchWithCache(`${BASE_URL}/ongoing-anime/${page}`, { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error('Failed to fetch ongoing anime');
    return res.json();
  },

  getCompleteAnime: async (page: number = 1): Promise<CompleteResponse> => {
    const res = await fetchWithCache(`${BASE_URL}/complete-anime/${page}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch complete anime');
    return res.json();
  },

  getAnimeDetail: async (slug: string): Promise<AnimeDetailResponse> => {
    const res = await fetchWithCache(`${BASE_URL}/anime/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch anime detail');
    return res.json();
  },

  getEpisode: async (slug: string, episode: number): Promise<EpisodeResponse> => {
    const res = await fetchWithCache(`${BASE_URL}/anime/${slug}/episodes/${episode}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch episode');
    return res.json();
  },

  getEpisodeBySlug: async (slug: string): Promise<EpisodeResponse> => {
    const res = await fetchWithCache(`${BASE_URL}/episode/${slug}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch episode by slug');
    return res.json();
  },

  getGenres: async (): Promise<{ data: Genre[] }> => {
    const res = await fetchWithCache(`${BASE_URL}/genre`, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error('Failed to fetch genres');
    return res.json();
  },

  getAnimeByGenre: async (slug: string, page: number = 1): Promise<GenreDetailResponse> => {
    const res = await fetchWithCache(`${BASE_URL}/genre/${slug}?page=${page}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch anime by genre');
    return res.json();
  },

  getSchedule: async (): Promise<ScheduleResponse> => {
    const res = await fetchWithCache(`${BASE_URL}/schedule`, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error('Failed to fetch schedule');
    return res.json();
  },

  searchAnime: async (keyword: string): Promise<SearchResponse> => {
    const res = await fetchWithCache(`${BASE_URL}/search/${keyword}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to search anime');
    return res.json();
  },
};
