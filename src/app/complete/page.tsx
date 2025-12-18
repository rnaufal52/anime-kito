import { api } from "@/services/api";
import InfiniteScrollList, { AnimeCardData } from "@/components/InfiniteScrollList";
import { getMoreCompleteAnime } from "../actions";

export default async function CompletePage() {
  const { data } = await api.getCompleteAnime(1);
  const initialData: AnimeCardData[] = data.completeAnimeData.map(anime => ({
    key: anime.slug,
    title: anime.title,
    poster: anime.poster,
    slug: anime.slug,
    rating: anime.rating
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 border-l-4 border-green-500 pl-4">
        <h1 className="text-3xl font-bold text-white">Complete Anime</h1>
      </div>

      <InfiniteScrollList 
        initialData={initialData}
        fetchData={getMoreCompleteAnime}
      />
    </div>
  );
}
