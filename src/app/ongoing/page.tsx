import { api } from "@/services/api";
import InfiniteScrollList, { AnimeCardData } from "@/components/InfiniteScrollList";
import { getMoreOngoingAnime } from "../actions";

export default async function OngoingPage() {
  const { data } = await api.getOngoingAnime(1);
  const initialData: AnimeCardData[] = data.ongoingAnimeData.map(anime => ({
    key: anime.slug,
    title: anime.title,
    poster: anime.poster,
    slug: anime.slug,
    episode: anime.current_episode.replace('Episode ', '')
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 border-l-4 border-primary pl-4">
        <h1 className="text-3xl font-bold text-white">Ongoing Anime</h1>
      </div>

      <InfiniteScrollList 
        initialData={initialData}
        fetchData={getMoreOngoingAnime}
      />
    </div>
  );
}
