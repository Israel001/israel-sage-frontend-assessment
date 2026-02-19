import { useSearchParams } from "react-router-dom";
import { useSearchCharacters } from "@/hooks/use-swapi";
import { useSearchHistory } from "@/hooks/use-search-history";
import { CharacterCard } from "@/components/CharacterCard";
import { Loader2, SearchX } from "lucide-react";
import { useEffect } from "react";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { data, isLoading, isFetching } = useSearchCharacters(query);
  const { addToHistory } = useSearchHistory();

  // Add to history when results come back
  useEffect(() => {
    if (data && query.length >= 2) {
      addToHistory(query);
    }
  }, [data, query, addToHistory]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-display text-2xl font-bold glow-text text-primary">
          Search Results
        </h2>
        {(isLoading || isFetching) && (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        )}
      </div>

      {query.length < 2 && (
        <p className="text-center py-20 text-muted-foreground font-body">
          Type at least 2 characters to search.
        </p>
      )}

      {data && data.results.length === 0 && (
        <div className="flex flex-col items-center py-20 text-muted-foreground">
          <SearchX className="h-12 w-12 mb-3" />
          <p className="font-body">No characters found for "{query}"</p>
        </div>
      )}

      {data && data.results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.results.map((char) => (
            <CharacterCard key={char.url} character={char} />
          ))}
        </div>
      )}
    </div>
  );
}
