"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import AnimeCard from "./AnimeCard";
import { searchAnimeAction, AnimeCardData } from "@/app/actions";

export default function SearchClient({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery] = useDebounce(query, 500);
  const [results, setResults] = useState<AnimeCardData[]>([]);
  const [isPending, startTransition] = useTransition();
  const [hasSearched, setHasSearched] = useState(!!initialQuery);
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Sync URL with query
    if (debouncedQuery) {
        startTransition(async () => {
            router.replace(`${pathname}?q=${encodeURIComponent(debouncedQuery)}`, { scroll: false });
            const data = await searchAnimeAction(debouncedQuery);
            setResults(data);
            setHasSearched(true);
        });
    } else {
        router.replace(pathname, { scroll: false });
        setResults([]);
        setHasSearched(false);
    }
  }, [debouncedQuery, pathname, router]);

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
            <Search size={20} />
        </div>
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anime..."
            className="w-full bg-[#23252b] border border-white/10 rounded-full py-4 pl-12 pr-6 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-lg text-lg"
            autoFocus
        />
        {isPending && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}
      </div>

      {/* Results */}
      <div>
         {hasSearched && !isPending && (
             <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-primary pl-4">
                 Results for <span className="text-primary">"{debouncedQuery}"</span>
             </h2>
         )}
         
         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {results.map((anime) => (
                <AnimeCard
                    key={anime.key}
                    title={anime.title}
                    poster={anime.poster}
                    slug={anime.slug}
                    rating={anime.rating}
                    episode={anime.episode}
                />
            ))}
         </div>

         {hasSearched && !isPending && results.length === 0 && (
             <div className="text-center py-12 text-gray-400">
                 No results found for "{debouncedQuery}".
             </div>
         )}
         
         {!hasSearched && (
             <div className="text-center py-20 text-gray-500">
                 <Search size={48} className="mx-auto mb-4 opacity-20" />
                 <p>Type to start searching...</p>
             </div>
         )}
      </div>
    </div>
  );
}
