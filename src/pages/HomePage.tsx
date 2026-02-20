import { useState } from "react";
import { useCharacters } from "@/hooks/use-swapi";
import { CharacterCard } from "@/components/CharacterCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, Orbit } from "lucide-react";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useCharacters(page);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-8 fade-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <Orbit className="h-4 w-4 text-primary/60" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
        <h2 className="font-display text-2xl font-black glow-text text-primary text-center tracking-widest">
          CHARACTERS
        </h2>
        <p className="text-center text-xs text-muted-foreground font-body mt-1 tracking-wider">
          GALACTIC DATABASE · PAGE {page}
        </p>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <div className="absolute inset-0 h-10 w-10 animate-ping opacity-20 rounded-full bg-primary" />
          </div>
          <p className="text-xs font-display text-primary/60 tracking-widest animate-pulse">ACCESSING DATABASE...</p>
        </div>
      )}

      {isError && (
        <p className="text-center py-20 text-destructive font-body">
          Transmission failed. Please try again later.
        </p>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.results.map((char, i) => (
              <CharacterCard
                key={char.url}
                character={char}
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <Button
              variant="outline"
              size="sm"
              disabled={!data.previous}
              onClick={() => setPage((p) => p - 1)}
              className="app-pagination-button font-body hover:border-primary hover:text-primary disabled:opacity-30 transition-all duration-300"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="app-pagination-chip flex items-center gap-2 px-4 py-1.5 rounded-lg border">
              <span className="text-xs font-display text-primary/70 tracking-widest">PAGE</span>
              <span className="text-sm font-display text-primary font-bold glow-text">{page}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={!data.next}
              onClick={() => setPage((p) => p + 1)}
              className="app-pagination-button font-body hover:border-primary hover:text-primary disabled:opacity-30 transition-all duration-300"
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
