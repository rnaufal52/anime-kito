import Link from 'next/link';
import Image from 'next/image';

interface AnimeCardProps {
  title: string;
  poster: string;
  slug: string;
  episode?: string | number;
  rating?: string;
}

export default function AnimeCard({ title, poster, slug, episode, rating }: AnimeCardProps) {
  return (
    <Link href={`/anime/${slug}`} className="group relative block overflow-hidden rounded-lg bg-card shadow-md transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/20">
      <div className="aspect-[3/4] w-full relative overflow-hidden">
        <Image
          src={poster || '/placeholder.png'}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
        
        <div className="absolute bottom-0 left-0 right-0 p-3">
            {episode && (
            <span className="mb-1 inline-block rounded bg-primary px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                Ep {episode}
            </span>
            )}
            <h3 className="line-clamp-2 text-sm font-semibold text-white leading-tight group-hover:text-primary transition-colors">
            {title}
            </h3>
             {rating && (
                <p className="text-xs text-muted mt-1">★ {rating}</p>
            )}
        </div>
      </div>
    </Link>
  );
}
