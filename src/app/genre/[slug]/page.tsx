import { api } from "@/services/api";
import InfiniteScrollList, { AnimeCardData } from "@/components/InfiniteScrollList";
import { getMoreAnimeByGenre } from "../../actions";
import { notFound } from "next/navigation";

export default async function AnimeByGenrePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug) notFound();

  let genreData;
  try {
    const { data } = await api.getAnimeByGenre(slug, 1);
    genreData = data;
  } catch (error) {
    console.error(error);
    notFound();
  }

  const initialData: AnimeCardData[] = genreData.anime.map(anime => ({
    key: anime.slug,
    title: anime.title,
    poster: anime.poster,
    slug: anime.slug,
    rating: anime.rating
  }));

  // We need a curried function for the server action to pass the slug
  const fetchGenreData = async (page: number) => {
    "use server";
    return getMoreAnimeByGenre(slug, page);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 border-l-4 border-primary pl-4">
        <h1 className="text-3xl font-bold text-white capitalize">Genre: {slug.replace(/-/g, ' ')}</h1>
      </div>

      <InfiniteScrollList 
        initialData={initialData}
        fetchData={fetchGenreData}
      />
    </div>
  );
}
