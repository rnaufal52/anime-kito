import SearchClient from "@/components/SearchClient";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchClient initialQuery={q || ""} />
    </div>
  );
}
