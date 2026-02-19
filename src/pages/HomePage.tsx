import { useState } from "react";
import { useCharacters } from "@/hooks/use-swapi";
import { CharacterCard } from "@/components/CharacterCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useCharacters(page);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="font-display text-2xl font-bold mb-6 glow-text text-primary">
        Characters
      </h2>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {isError && (
        <p className="text-center py-20 text-destructive font-body">
          Failed to load characters. Please try again later.
        </p>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.results.map((char) => (
              <CharacterCard key={char.url} character={char} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              disabled={!data.previous}
              onClick={() => setPage((p) => p - 1)}
              className="font-body glow-border"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground font-body">
              Page {page}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!data.next}
              onClick={() => setPage((p) => p + 1)}
              className="font-body glow-border"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
