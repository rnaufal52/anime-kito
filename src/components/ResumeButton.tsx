"use client";

import { useHistory } from "@/hooks/useLocalStorage";
import Link from "next/link";
import { PlayCircle } from "lucide-react";

export default function ResumeButton({ slug }: { slug: string }) {
  const { history } = useHistory();
  const currentItem = history.find(h => h.slug === slug);

  if (!currentItem) return null;

  return (
    <div className="relative group">
        <Link 
            href={`/watch/${slug}/${currentItem.lastEpisodeNum}`}
            className="flex items-center gap-4 p-4 bg-primary/10 border-2 border-primary/20 rounded-2xl hover:bg-primary hover:border-primary transition-all group overflow-hidden"
        >
            <div className="shrink-0 bg-primary group-hover:bg-white p-3 rounded-xl transition-colors shadow-lg shadow-primary/20">
                <PlayCircle size={24} className="text-white group-hover:text-primary fill-current" />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary group-hover:text-white/80 transition-colors">
                    CONTINUE WATCHING
                </span>
                <span className="text-white font-bold leading-tight line-clamp-1">
                    Resume {currentItem.lastEpisode}
                </span>
            </div>
            
            {/* Glossy overlay effect */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
        </Link>
    </div>
  );
}
