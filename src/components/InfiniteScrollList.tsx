"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import AnimeCard from "./AnimeCard";
import AnimeCardSkeleton from "./AnimeCardSkeleton";

export interface AnimeCardData {
  key: string;
  title: string;
  poster: string;
  slug: string;
  rating?: string;
  episode?: string;
}

interface InfiniteScrollListProps {
  initialData: AnimeCardData[];
  fetchData: (page: number) => Promise<AnimeCardData[]>;
}

export default function InfiniteScrollList({ initialData, fetchData }: InfiniteScrollListProps) {
  const [data, setData] = useState<AnimeCardData[]>(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasMore) {
      loadMore();
    }
  }, [inView, hasMore]);

  const loadMore = async () => {
    const nextPage = page + 1;
    const newItems = await fetchData(nextPage);

    if (newItems.length === 0) {
      setHasMore(false);
    } else {
      setData((prev) => [...prev, ...newItems]);
      setPage(nextPage);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mb-12">
        {data.map((item) => (
            <AnimeCard 
                key={item.key}
                title={item.title}
                poster={item.poster}
                slug={item.slug}
                rating={item.rating}
                episode={item.episode}
            />
        ))}
        {hasMore && (
           <>
              {Array.from({ length: 6 }).map((_, i) => (
                 <AnimeCardSkeleton key={`skeleton-${i}`} />
              ))}
           </>
        )}
      </div>

      {hasMore && (
        <div ref={ref} className="flex justify-center p-4 col-span-full h-10" />
      )}
      
      {!hasMore && (
          <div className="text-center text-gray-500 py-8">
              You've reached the end of the list.
          </div>
      )}
    </>
  );
}
