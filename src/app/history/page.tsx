"use client";

import { useHistory, useWatched } from "@/hooks/useLocalStorage";
import Link from "next/link";
import Image from "next/image";
import { PlayCircle, Trash2, Clock, ArrowLeft } from "lucide-react";

export default function HistoryPage() {
  const { history, removeFromHistory, clearHistory } = useHistory();
  const { clearWatched } = useWatched();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/" className="inline-flex items-center text-primary text-sm font-medium hover:gap-2 transition-all gap-1 mb-2">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Clock className="text-primary" size={32} />
            Watch History
          </h1>
          <p className="text-gray-400 text-sm">Resume your favorite anime right where you left off.</p>
        </div>
        
        <div className="bg-[#23252b] px-4 py-2 rounded-lg border border-white/5 text-sm font-medium text-gray-300">
            {history.length} {history.length === 1 ? 'Anime' : 'Animes'} found
        </div>
      </div>

      {history.length > 0 && (
          <div className="mb-6 flex justify-end">
                <button 
                    onClick={() => {
                        if (confirm("Are you sure you want to clear your entire watch history?")) {
                            clearHistory();
                            clearWatched();
                        }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg border border-red-500/20 transition-all text-xs font-bold"
                >
                    <Trash2 size={14} /> Clear All History
                </button>
          </div>
      )}

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-[#23252b]/30 rounded-3xl border border-dashed border-white/10">
          <div className="bg-[#23252b] p-6 rounded-full">
            <Clock size={48} className="text-gray-600" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">No History Found</h2>
            <p className="text-gray-500 max-w-xs">You haven't watched any anime yet. Start your journey from the home page!</p>
          </div>
          <Link 
            href="/" 
            className="mt-4 inline-flex items-center justify-center bg-primary hover:bg-orange-600 text-white font-bold py-2.5 px-8 rounded-full transition-all"
          >
            Explore Anime
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {history.map((item) => (
            <div key={item.slug} className="group bg-[#23252b] rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all shadow-xl hover:shadow-primary/5 flex flex-col">
              {/* Poster section */}
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={item.poster}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-60 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                <Link 
                    href={`/watch/${item.slug}/${item.lastEpisodeNum}`}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <div className="bg-primary/90 text-white p-3 rounded-full scale-75 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                        <PlayCircle size={32} fill="currentColor" className="text-white" />
                    </div>
                </Link>
              </div>

              {/* Info section */}
              <div className="p-4 flex-1 flex flex-col space-y-3">
                <div className="space-y-1">
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                        {item.title}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1.5 underline decoration-primary/30">
                        <PlayCircle size={10} className="text-primary" />
                        Last: {item.lastEpisode}
                    </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                    <Link 
                        href={`/watch/${item.slug}/${item.lastEpisodeNum}`}
                        className="flex-1 bg-primary/10 hover:bg-primary text-primary hover:text-white text-xs font-black py-2 rounded-lg border border-primary/20 transition-all text-center uppercase tracking-tighter"
                    >
                        Resume Watch
                    </Link>
                    <button 
                        onClick={() => removeFromHistory(item.slug)}
                        className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg border border-red-500/20 transition-all"
                        title="Remove from history"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
