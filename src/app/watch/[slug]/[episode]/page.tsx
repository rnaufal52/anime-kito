import { api } from "@/services/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import EpisodeList from "@/components/EpisodeList";
import WatchPlayerContainer from "@/components/WatchPlayerContainer";

export default async function WatchPage({ params }: { params: Promise<{ slug: string; episode: string }> }) {
  const { slug, episode } = await params;
  
  if (!slug || !episode) notFound();

  let episodeDetail;
  let animeDetail;

  try {
    const episodeNum = parseInt(episode);
    const isNumericEpisode = !isNaN(episodeNum);

    if (isNumericEpisode) {
        const { data } = await api.getEpisode(slug, episodeNum);
        episodeDetail = data;
    } else {
        const { data } = await api.getEpisodeBySlug(episode);
        episodeDetail = data;
    }
    
    // Also fetch anime detail
    const { data: anime } = await api.getAnimeDetail(slug);
    animeDetail = anime;
  } catch (error) {
    console.error("Error fetching watch data:", error);
    notFound();
  }

  if (!episodeDetail || !animeDetail) {
      notFound();
  }

  // Takedown: Block playback for Movie type content
  if (animeDetail.type === "Movie") {
      notFound();
  }

  const prevEpisodeSlug = episodeDetail.has_previous_episode && episodeDetail.previous_episode 
    ? `/watch/${slug}/${parseInt(episode) - 1}` 
    : undefined;

  const nextEpisodeSlug = episodeDetail.has_next_episode && episodeDetail.next_episode 
    ? `/watch/${slug}/${parseInt(episode) + 1}` 
    : undefined;

  const currentEpisodeNum = !isNaN(parseInt(episode)) ? parseInt(episode) : 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-white mb-2">{episodeDetail.episode}</h1>
        <Link href={`/anime/${slug}`} className="text-primary hover:text-orange-400 transition-colors text-sm font-semibold">
           ← Back to Anime Details
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content: Player, Controls & Downloads */}
        <div className="flex-1 min-w-0">
             
             {/* Player & Controls */}
             <WatchPlayerContainer 
                episodeDetail={episodeDetail}
                animeDetail={animeDetail}
                animeSlug={slug}
                currentEpisodeNum={currentEpisodeNum}
                prevEpisodeSlug={prevEpisodeSlug}
                nextEpisodeSlug={nextEpisodeSlug}
             />

             {/* Separator */}
             <div className="h-6" />

             {/* Server Selection / Download Links */}
             <div className="bg-[#23252b] p-6 rounded-xl border border-white/5 space-y-6">
                
                {/* MP4 Downloads */}
                {episodeDetail.download_urls.mp4 && episodeDetail.download_urls.mp4.length > 0 && (
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                           <span className="w-1 h-6 bg-primary rounded-full block"></span>
                           Download / Servers (MP4)
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {episodeDetail.download_urls.mp4.map((quality, idx) => (
                                <div key={idx} className="bg-black/30 p-3 rounded-lg border border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-primary font-bold">{quality.resolution}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {quality.urls.map((link, i) => (
                                            <a 
                                                key={i} 
                                                href={link.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="px-3 py-1.5 bg-gray-800 hover:bg-primary hover:text-white rounded text-xs transition-colors font-medium"
                                            >
                                                {link.provider}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* MKV Downloads */}
                {episodeDetail.download_urls.mkv && episodeDetail.download_urls.mkv.length > 0 && (
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                           <span className="w-1 h-6 bg-green-500 rounded-full block"></span>
                           Download / Servers (MKV)
                        </h3>
                         <div className="grid grid-cols-1 gap-4">
                            {episodeDetail.download_urls.mkv.map((quality, idx) => (
                                <div key={idx} className="bg-black/30 p-3 rounded-lg border border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-green-500 font-bold">{quality.resolution}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {quality.urls.map((link, i) => (
                                            <a 
                                                key={i} 
                                                href={link.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="px-3 py-1.5 bg-gray-800 hover:bg-green-600 hover:text-white rounded text-xs transition-colors font-medium"
                                            >
                                                {link.provider}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

             </div>
        </div>
        
        <div className="w-full lg:w-[350px] shrink-0 order-2 lg:order-2">
             <div className="lg:sticky lg:top-24">
                 {animeDetail && (
                     <EpisodeList episodes={animeDetail.episode_lists} animeSlug={slug} />
                 )}
             </div>
        </div>
      </div>
    </div>
  );
}
