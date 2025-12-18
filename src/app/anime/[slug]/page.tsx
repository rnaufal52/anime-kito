import { api } from "@/services/api";
import EpisodeList from "@/components/EpisodeList";
import AnimeCard from "@/components/AnimeCard";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ResumeButton from "@/components/ResumeButton";

// Correctly type the params as a Promise for Next.js 15
export default async function AnimeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (!slug) notFound();

  let anime;
  try {
    const { data } = await api.getAnimeDetail(slug);
    anime = data;
    
    // Takedown: Block access to Movie type content
    if (anime.type === "Movie") {
        notFound();
    }
  } catch (error) {
    console.error(error);
    notFound();
  }

  // Use the extracted slug from the URL part to handle the watch link consistency if needed
  // But anime.slug from API seems to be a full URL sometimes looking at previous output? 
  // "slug":"https:/otakudesu.best/anime/lets-play-quest-my-life-sub-indo/"
  // Wait, the API response for slug IS A URL or matching the param? 
  // Let's rely on the passed `slug` param for safer routing if the API returns a full URL.

  return (
    <div>
      {/* Banner / Header Section */}
      <div className="relative h-[50px] md:h-[150px] w-full overflow-hidden">
        <Image 
          src={anime.poster} 
          alt={anime.title} 
          fill 
          className="object-cover blur-2xl opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Poster & Actions */}
          <div className="shrink-0 flex flex-col items-center md:items-start space-y-4">
            <div className="relative w-[220px] h-[330px] rounded-lg overflow-hidden shadow-2xl border-4 border-[#23252b]">
              <Image 
                src={anime.poster} 
                alt={anime.title} 
                fill 
                className="object-cover"
              />
            </div>
            <div className="w-[220px] text-center md:text-left space-y-2">
                 <div className="inline-block bg-primary text-white font-bold px-3 py-1 rounded text-sm">
                    {anime.rating} ★
                 </div>
                 <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {anime.genres.map(g => (
                        <Link key={g.slug} href={`/genre/${g.slug}`} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded transition-colors">
                            {g.name}
                        </Link>
                    ))}
                 </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-6 pt-4 md:pt-12">
            <div>
                <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-2">{anime.title}</h1>
                <h2 className="text-lg text-gray-400 font-medium">{anime.japanese_title}</h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-300 bg-[#23252b]/50 p-4 rounded-lg">
                <div><span className="text-gray-500 block">Status</span> <span className="text-white font-semibold">{anime.status}</span></div>
                <div><span className="text-gray-500 block">Studio</span> <span className="text-white font-semibold">{anime.studio}</span></div>
                <div><span className="text-gray-500 block">Released</span> <span className="text-white font-semibold">{anime.release_date}</span></div>
                <div><span className="text-gray-500 block">Duration</span> <span className="text-white font-semibold">{anime.duration}</span></div>
            </div>

            <div className="space-y-4">
                <ResumeButton slug={slug} />

                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">Synopsis</h3>
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">{anime.synopsis}</p>
                </div>
            </div>

            <EpisodeList episodes={anime.episode_lists} animeSlug={slug} />
            
          </div>
        </div>

        {/* Recommendations */}
        {anime.recommendations && anime.recommendations.length > 0 && (
            <div className="mt-16">
                <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-primary pl-4">Recommendations</h2>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {anime.recommendations.map(rec => (
                        <AnimeCard 
                            key={rec.slug}
                            title={rec.title}
                            slug={rec.slug}
                            poster={rec.poster}
                        />
                    ))}
                 </div>
            </div>
        )}
      </div>
    </div>
  );
}
