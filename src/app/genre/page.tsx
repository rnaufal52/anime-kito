import { api } from "@/services/api";
import Link from "next/link";

export default async function GenrePage() {
  const { data: genres } = await api.getGenres();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-primary pl-4">Genres</h1>

      <div className="flex flex-wrap gap-4">
        {genres.map((genre) => (
          <Link
            key={genre.slug}
            href={`/genre/${genre.slug}`}
            className="px-6 py-3 rounded-full bg-[#23252b] text-gray-300 hover:text-white hover:bg-primary transition-all font-medium border border-white/5"
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
