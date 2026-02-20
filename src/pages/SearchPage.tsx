import { useSearchParams } from "react-router-dom";
import { useSearchCharacters } from "@/hooks/use-swapi";
import { useSearchHistory } from "@/hooks/use-search-history";
import { CharacterCard } from "@/components/CharacterCard";
import { Loader2, SearchX, Search } from "lucide-react";
import { useEffect } from "react";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { data, isLoading, isFetching } = useSearchCharacters(query);
  const { addToHistory } = useSearchHistory();

  useEffect(() => {
    if (data && query.length >= 2) {
      addToHistory(query);
    }
  }, [data, query, addToHistory]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 fade-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <Search className="h-4 w-4 text-primary/60" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
        <div className="flex items-center justify-center gap-3">
          <h2 className="font-display text-2xl font-black glow-text text-primary tracking-widest text-center">
            Search Results
          </h2>
          {(isLoading || isFetching) && (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          )}
        </div>
        {query.length >= 2 && (
          <p className="text-center text-xs text-muted-foreground font-body mt-1 tracking-wider">
            QUERY: <span className="text-primary/70 font-display">{query.toUpperCase()}</span>
          </p>
        )}
      </div>

      {query.length < 2 && (
        <div className="flex flex-col items-center py-20 text-muted-foreground">
          <div className="relative mb-4">
            <Search className="h-12 w-12 text-primary/20" />
            <div className="absolute inset-0 h-12 w-12 animate-ping opacity-10 rounded-full bg-primary" />
          </div>
          <p className="font-body text-sm tracking-wider">
            Type at least <span className="text-primary">2 characters</span> to search.
          </p>
        </div>
      )}

      {data && data.results.length === 0 && (
        <div className="flex flex-col items-center py-20 text-muted-foreground gap-3">
          <SearchX className="h-12 w-12 text-primary/20" />
          <p className="font-body text-sm">No characters found for <span className="text-primary">"{query}"</span></p>
        </div>
      )}

      {data && data.results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.results.map((char, i) => (
            <CharacterCard
              key={char.url}
              character={char}
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
