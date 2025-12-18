"use client";

import { EpisodeDetail } from "@/services/api";
import VideoPlayer from "@/components/VideoPlayer";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";

import { resolveUrl } from "@/app/actions";
import { getPlaybackStrategy, PlaybackMode } from "@/utils/playerUtils";
import { Loader2 } from "lucide-react";
import { useHistory, useWatched } from "@/hooks/useLocalStorage";

interface WatchPlayerContainerProps {
  episodeDetail: EpisodeDetail;
  animeDetail: any; 
  animeSlug: string; // Add animeSlug to props
  currentEpisodeNum: number;
  prevEpisodeSlug?: string;
  nextEpisodeSlug?: string;
}

export default function WatchPlayerContainer({ episodeDetail, animeDetail, animeSlug, currentEpisodeNum, prevEpisodeSlug, nextEpisodeSlug }: WatchPlayerContainerProps) {
  const { addToHistory } = useHistory();
  const { markAsWatched } = useWatched();

  // Track progress on load
  useEffect(() => {
      if (episodeDetail && animeDetail && animeSlug) {
          console.log('🎬 Marking episode as watched:', {
              animeSlug,
              episodeNum: currentEpisodeNum,
              episodeTitle: episodeDetail.episode
          });
          
          // Add to Latest Streaming
          addToHistory({
              slug: animeSlug, 
              title: animeDetail.title,
              poster: animeDetail.poster,
              lastEpisode: episodeDetail.episode,
              lastEpisodeNum: currentEpisodeNum
          });
          
          // Mark as watched
          markAsWatched(animeSlug, currentEpisodeNum);
      }
  }, [episodeDetail, animeDetail, animeSlug, currentEpisodeNum, addToHistory, markAsWatched]);

  const [currentStreamUrl, setCurrentStreamUrl] = useState(episodeDetail.stream_url);
  const [currentMode, setCurrentMode] = useState<PlaybackMode>('iframe');
  const [currentSandbox, setCurrentSandbox] = useState<string | undefined>(undefined);
  const [currentReferrerPolicy, setCurrentReferrerPolicy] = useState<React.HTMLAttributeReferrerPolicy | undefined>("origin");
  const [isResolving, setIsResolving] = useState(false);
  
  const [selectedServerLabel, setSelectedServerLabel] = useState("Default Server");
  
  const updatePlayerStrategy = async (rawUrl: string, provider: string = "") => {
      setIsResolving(true);
      try {
          // Resolve the final URL (follow redirects from safelinks)
          const finalUrl = await resolveUrl(rawUrl);
          
          // Determine best strategy based on the resolved URL
          const strategy = getPlaybackStrategy(finalUrl, provider);
          
          setCurrentStreamUrl(strategy.url);
          setCurrentMode(strategy.mode);
          setCurrentSandbox(strategy.sandbox);
          setCurrentReferrerPolicy(strategy.referrerPolicy || "origin");
      } catch (e) {
          console.error("Failed to resolve stream URL", e);
          // Fallback to raw URL
          setCurrentStreamUrl(rawUrl);
          setCurrentMode('iframe');
          setCurrentReferrerPolicy("origin");
      } finally {
          setIsResolving(false);
      }
  };

  // Initialize default strategy
  useEffect(() => {
     updatePlayerStrategy(episodeDetail.stream_url);
  }, [episodeDetail]);

  // Flatten available MP4 streams for the selector
  // Filter only requested providers: Acefile, Mega, Kraken (KFiles)
  const availableStreams = episodeDetail.download_urls.mp4.flatMap(quality => 
    quality.urls
    .filter(url => {
        const p = url.provider.toLowerCase();
        return p.includes('acefile') || p.includes('mega') || p.includes('kfiles') || p.includes('kraken');
    })
    .map(url => ({
      ...url,
      resolution: quality.resolution,
      label: `${url.provider} - ${quality.resolution}`
    }))
  );

  const handleServerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "default") {
      updatePlayerStrategy(episodeDetail.stream_url);
      setSelectedServerLabel("Default Server");
    } else {
      const [provider, resolution, rawUrl] = value.split("::");
      updatePlayerStrategy(rawUrl, provider); 
      setSelectedServerLabel(`${provider} - ${resolution}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {isResolving ? (
         <div className="relative w-full overflow-hidden rounded-lg bg-[#1a1c21] shadow-2xl pt-[56.25%] border-2 border-[#23252b] flex items-center justify-center group">
             <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                 <Loader2 className="w-10 h-10 text-primary animate-spin" />
                 <span className="text-sm text-gray-400">Resolving stream...</span>
             </div>
         </div>
      ) : (
         <VideoPlayer 
            streamUrl={currentStreamUrl} 
            mode={currentMode} 
            sandbox={currentSandbox} 
            referrerPolicy={currentReferrerPolicy} 
         />
      )}
      
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#23252b] p-3 rounded-lg border border-white/5">
        
        {/* Previous Button */}
        <div className="flex-1 w-full md:w-auto">
             {prevEpisodeSlug ? (
                <Link
                  href={prevEpisodeSlug}
                  className="flex items-center justify-center md:justify-start gap-2 text-white hover:text-primary transition-colors text-sm font-medium"
                >
                  <ChevronLeft size={18} />
                  <span>Prev Ep</span>
                </Link>
             ) : (
                 <div className="flex-1" />
             )}
        </div>

        {/* Server Selector (Center) */}
        <div className="flex-1 w-full md:w-auto flex justify-center">
            <div className="relative w-full max-w-[280px]">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Settings key={selectedServerLabel} size={14} className="text-primary animate-spin-slow" />
                </div>
                <select 
                    onChange={handleServerChange}
                    className="w-full h-9 pl-9 pr-4 bg-black/40 border border-white/10 rounded-md text-xs text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
                    defaultValue="default"
                >
                    <option value="default">Default Server (Stream)</option>
                    <optgroup label="Alternative Servers (MP4)">
                        {availableStreams.map((stream, idx) => (
                            <option key={idx} value={`${stream.provider}::${stream.resolution}::${stream.url}`}>
                                {stream.provider} - {stream.resolution}
                            </option>
                        ))}
                    </optgroup>
                </select>
            </div>
        </div>

        {/* Next Button */}
        <div className="flex-1 w-full md:w-auto flex justify-end">
            {nextEpisodeSlug ? (
                <Link
                  href={nextEpisodeSlug}
                  className="flex items-center justify-center md:justify-end gap-2 text-white hover:text-primary transition-colors text-sm font-medium"
                >
                  <span>Next Ep</span>
                  <ChevronRight size={18} />
                </Link>
             ) : (
                <div className="flex-1" />
             )}
        </div>

      </div>
      
      {/* Current Info & Fallback */}
      <div className="flex flex-col items-center justify-center text-xs text-gray-500 gap-2">
         <div>
            Now Playing: <span className="text-primary font-medium">{selectedServerLabel}</span>
         </div>
         {/* Fallback for blocked iframes */}
         <a 
            href={currentStreamUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-400 hover:text-white underline decoration-dotted"
         >
            Video not loading? Open in new tab
         </a>
      </div>
    </div>
  );
}
