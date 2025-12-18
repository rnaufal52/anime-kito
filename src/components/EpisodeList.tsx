"use client";

import Link from "next/link";
import { Episode } from "@/services/api";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useWatched, useHistory } from "@/hooks/useLocalStorage";

export default function EpisodeList({ episodes, animeSlug }: { episodes: Episode[], animeSlug: string }) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 25;
  const { isWatched } = useWatched();
  const { history } = useHistory();
  
  // Get the last watched episode number for this anime
  const lastWatchedEpisode = history.find(h => h.slug === animeSlug)?.lastEpisodeNum;

  // ... rest of component logic ...
  // Ensure episodes are sorted by number for consistent ranges
  const sortedEpisodes = [...episodes].sort((a, b) => a.episode_number - b.episode_number);
  
  const totalPages = Math.ceil(sortedEpisodes.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const currentEpisodes = sortedEpisodes.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-[#23252b] rounded-xl p-6 border border-white/5 space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-white">Episodes</h3>
            <span className="text-xs text-gray-400 font-medium bg-black/40 px-3 py-1 rounded-full border border-white/5">
                {sortedEpisodes.length} Episodes Total
            </span>
        </div>
        
        {/* Range Selector Buttons */}
        {totalPages > 1 && (
            <div className="flex flex-wrap gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => {
                    // Get the actual slice of episodes for this page
                    const pageStart = idx * itemsPerPage;
                    const pageEpisodes = sortedEpisodes.slice(pageStart, pageStart + itemsPerPage);
                    
                    if (pageEpisodes.length === 0) return null;

                    const firstEp = pageEpisodes[0].episode_number;
                    const lastEp = pageEpisodes[pageEpisodes.length - 1].episode_number;
                    const isActive = currentPage === idx;
                    
                    return (
                        <button
                            key={idx}
                            onClick={() => setCurrentPage(idx)}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all border ${
                                isActive 
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                : 'bg-black/40 border-white/5 text-gray-400 hover:border-primary/50 hover:text-white'
                            }`}
                        >
                            {firstEp}-{lastEp}
                        </button>
                    );
                })}
            </div>
        )}
      </div>

      {/* Scrollable List Container */}
      <div className="overflow-y-auto max-h-[400px] lg:max-h-[60vh] pr-2 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-black/20">
          <div className="grid grid-cols-2 gap-2 content-start">
            {currentEpisodes.map((ep) => {
              const viewed = isWatched(animeSlug, ep.episode_number);
              const isLastWatched = lastWatchedEpisode === ep.episode_number;
              
              return (
                <Link
                  key={ep.slug}
                  href={`/watch/${animeSlug}/${ep.episode_number}`}
                  className={`group flex flex-col justify-between p-2 rounded-lg bg-[#141519] border transition-all relative overflow-hidden ${
                      isLastWatched 
                      ? 'border-primary/50 bg-primary/5 shadow-[0_0_10px_rgba(255,107,0,0.1)]' 
                      : viewed 
                      ? 'opacity-70 border-green-500/20' 
                      : 'border-white/5 hover:bg-primary/10 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`font-bold transition-colors text-xs truncate ${
                          isLastWatched ? 'text-primary' : viewed ? 'text-gray-400' : 'text-gray-200 group-hover:text-primary'
                      }`}>
                          {ep.episode}
                      </span>
                      {isLastWatched && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 animate-pulse" />
                      )}
                  </div>

                  <div className="flex items-center justify-between mt-1">
                      <span className="text-[9px] text-gray-500 uppercase tracking-wider font-medium">
                          Ep {ep.episode_number}
                      </span>
                      
                      {isLastWatched ? (
                           <span className="text-[9px] font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                               Playing
                           </span>
                      ) : viewed ? (
                           <div className="w-full absolute bottom-0 left-0 h-0.5 bg-green-500/50" />
                      ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
      </div>

      {sortedEpisodes.length === 0 && (
          <div className="text-center py-8 text-gray-500 italic text-sm">
              No episodes available yet.
          </div>
      )}
    </div>
  );
}
