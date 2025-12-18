export default function AnimeCardSkeleton() {
  return (
    <div className="relative block overflow-hidden rounded-lg bg-[#23252b] shadow-md">
      <div className="aspect-[3/4] w-full relative animate-pulse bg-gray-800"></div>
      <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
        <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse"></div>
        <div className="h-3 w-1/2 bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
