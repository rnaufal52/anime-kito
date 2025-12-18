import { api } from "@/services/api";
import AnimeCard from "@/components/AnimeCard";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const { data } = await api.getHome();
  const { ongoing_anime, complete_anime } = data;

  // Utilize the first anime as a "Featured" spotlight (using blurred background trick)
  const spotlight = ongoing_anime[0];

  return (
    <div className="space-y-12">
      {/* Featured Spotlight */}
      {spotlight && (
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-black via-black/80 to-transparent p-6 sm:p-12 md:h-[400px] shadow-2xl border border-white/10">
          {/* Background Image (Blurred) */}
          <div className="absolute inset-0 z-0">
             <Image 
                src={spotlight.poster} 
                alt="Background" 
                fill 
                className="object-cover opacity-30 blur-xl"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
             <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-center sm:flex-row sm:items-center sm:justify-start gap-8">
             <div className="shrink-0">
                <div className="relative h-[250px] w-[180px] overflow-hidden rounded-lg shadow-2xl">
                    <Image src={spotlight.poster} alt={spotlight.title} fill className="object-cover" />
                </div>
             </div>
             <div className="max-w-2xl space-y-4">
                <span className="inline-block rounded bg-primary text-white text-xs font-bold px-2 py-1">ONGOING</span>
                <h1 className="text-3xl font-black text-white sm:text-5xl leading-tight">
                    {spotlight.title}
                </h1>
                <p className="text-gray-300 text-lg">
                    {spotlight.current_episode} • {spotlight.release_day}
                </p>
                <Link 
                    href={`/anime/${spotlight.slug}`} 
                    className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-orange-600 shadow-lg shadow-orange-500/20"
                >
                    Watch Now
                </Link>
             </div>
          </div>
        </section>
      )}

      {/* Ongoing Section */}
      <section>
        <div className="mb-6 flex items-center justify-between border-l-4 border-primary pl-4">
           <h2 className="text-2xl font-bold text-white">Ongoing Anime</h2>
           <Link href="/ongoing" className="text-sm font-semibold text-primary hover:text-white transition-colors">VIEW ALL</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
           {ongoing_anime.slice(1).map((anime) => (
             <AnimeCard 
               key={anime.slug} 
               title={anime.title} 
               poster={anime.poster} 
               slug={anime.slug} 
               episode={anime.current_episode.replace('Episode ', '')}
             />
           ))}
        </div>
      </section>

      {/* Complete Section */}
      <section>
        <div className="mb-6 flex items-center justify-between border-l-4 border-green-500 pl-4">
           <h2 className="text-2xl font-bold text-white">Complete Anime</h2>
           <Link href="/complete" className="text-sm font-semibold text-primary hover:text-white transition-colors">VIEW ALL</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
           {complete_anime.map((anime) => (
             <AnimeCard 
               key={anime.slug} 
               title={anime.title} 
               poster={anime.poster} 
               slug={anime.slug} 
               rating={anime.rating}
             />
           ))}
        </div>
      </section>
    </div>
  );
}
