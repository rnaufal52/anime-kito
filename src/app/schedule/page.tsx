import { api } from "@/services/api";
import Link from "next/link";
import Image from "next/image";

export default async function SchedulePage() {
  // Fetch schedule and ongoing anime (for posters) in parallel
  const [scheduleRes, ongoingRes] = await Promise.all([
     api.getSchedule(),
     api.getOngoingAnime(1)
  ]);

  const schedule = scheduleRes.data;
  const ongoingAnime = ongoingRes.data.ongoingAnimeData;

  // Create a map for quick poster lookup
  const posterMap = new Map<string, string>();
  ongoingAnime.forEach(anime => {
      posterMap.set(anime.slug, anime.poster);
  });

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-64px)] overflow-hidden flex flex-col">
      <h1 className="text-3xl font-bold text-white mb-6 border-l-4 border-primary pl-4 shrink-0">Release Schedule</h1>

      <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max h-full">
            {schedule.map((dayData) => (
              <div key={dayData.day} className="w-[300px] flex flex-col bg-[#23252b] rounded-xl border border-white/5 overflow-hidden shadow-xl shrink-0 h-full">
                {/* Header */}
                <div className="bg-primary/90 px-4 py-3 shrink-0">
                  <h2 className="text-xl font-bold text-white uppercase tracking-wide text-center">{dayData.day}</h2>
                </div>
                
                {/* Scrollable List */}
                <div className="p-3 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-black/20 flex-1">
                  {dayData.anime_list.map((anime) => {
                    const poster = posterMap.get(anime.slug);
                    
                    return (
                        <Link 
                          key={anime.slug} 
                          href={`/anime/${anime.slug}`}
                          className="flex gap-3 p-2 rounded-lg bg-black/40 hover:bg-white/5 transition-all group border border-transparent hover:border-primary/30"
                        >
                          {/* Mini Poster */}
                          <div className="relative w-[60px] h-[85px] shrink-0 rounded overflow-hidden bg-gray-800">
                             {poster ? (
                                <Image 
                                    src={poster} 
                                    alt={anime.anime_name} 
                                    fill 
                                    sizes="60px"
                                    className="object-cover transition-transform group-hover:scale-110" 
                                />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-500 font-bold text-xl">
                                    {anime.anime_name.charAt(0)}
                                </div>
                             )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <h3 className="text-sm font-semibold text-gray-200 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                                  {anime.anime_name}
                              </h3>
                              <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                                  {dayData.day} Release
                              </span>
                          </div>
                        </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}
