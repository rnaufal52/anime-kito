import AnimeCardSkeleton from "@/components/AnimeCardSkeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 border-l-4 border-green-500 pl-4">
        <div className="h-8 w-48 bg-gray-800 rounded animate-pulse"></div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mb-12">
        {Array.from({ length: 18 }).map((_, i) => (
          <AnimeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
