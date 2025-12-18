"use client";

import { useHistory } from "@/hooks/useLocalStorage";
import Link from "next/link";
import Image from "next/image";
import { PlayCircle, X } from "lucide-react";

export default function LatestStreaming() {
  const { history, removeFromHistory } = useHistory();

  if (history.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between border-l-4 border-orange-500 pl-4">
        <h2 className="text-2xl font-bold text-white">Latest Streaming</h2>
        <span className="text-xs text-gray-500 uppercase tracking-widest">Continue Watching</span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {history.map((item) => (
          <div key={item.slug} className="group relative">
            <Link href={`/anime/${item.slug}`} className="block">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/5 bg-[#1a1c21] shadow-lg transition-all duration-300 group-hover:scale-[1.02] group-hover:border-primary/50 group-hover:shadow-primary/10">
                <Image
                  src={item.poster}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-primary p-3 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <PlayCircle size={32} className="text-white fill-white/20" />
                    </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                   <div className="bg-black/80 backdrop-blur-md px-2 py-1.5 rounded-lg border border-white/10">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-tighter truncate">
                            {item.lastEpisode}
                        </p>
                   </div>
                </div>
              </div>
              <h3 className="mt-3 text-sm font-bold text-gray-200 line-clamp-1 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
            </Link>
            
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    removeFromHistory(item.slug);
                }}
                className="absolute -top-1 -right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-20"
            >
                <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
