import { useParams, Link } from "react-router-dom";
import { useCharacter, useFilm } from "@/hooks/use-swapi";
import { useFavorites } from "@/context/FavoritesContext";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft, Loader2 } from "lucide-react";

function FilmChip({ url }: { url: string }) {
  const { data } = useFilm(url);
  if (!data) return <span className="inline-block px-3 py-1 rounded-full bg-secondary text-xs font-body animate-pulse-glow">Loading...</span>;
  return (
    <span className="inline-block px-3 py-1 rounded-full bg-secondary text-xs font-body text-foreground border border-border">
      {data.title}
    </span>
  );
}

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: character, isLoading, isError } = useCharacter(id || "");
  const { isFavorite, toggleFavorite } = useFavorites();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !character) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive font-body mb-4">Character not found.</p>
        <Link to="/" className="text-primary hover:underline font-body">Back to home</Link>
      </div>
    );
  }

  const fav = isFavorite(character.url);

  const stats = [
    { label: "Height", value: `${character.height}cm` },
    { label: "Mass", value: `${character.mass}kg` },
    { label: "Hair Color", value: character.hair_color },
    { label: "Skin Color", value: character.skin_color },
    { label: "Eye Color", value: character.eye_color },
    { label: "Birth Year", value: character.birth_year },
    { label: "Gender", value: character.gender },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors font-body mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="bg-card border border-border rounded-lg p-6 glow-border">
        <div className="flex items-start justify-between mb-6">
          <h2 className="font-display text-2xl font-bold glow-text text-primary">
            {character.name}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFavorite(character)}
            className="shrink-0"
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          >
            <Star className={`h-5 w-5 ${fav ? "fill-primary text-primary" : "text-muted-foreground"}`} />
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-secondary/50 rounded-md p-3 border border-border">
              <p className="text-xs text-muted-foreground font-body">{s.label}</p>
              <p className="text-sm font-semibold capitalize font-body text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold text-foreground mb-3">Film Appearances</h3>
          <div className="flex flex-wrap gap-2">
            {character.films.length === 0 ? (
              <p className="text-xs text-muted-foreground font-body">No film data available.</p>
            ) : (
              character.films.map((filmUrl) => <FilmChip key={filmUrl} url={filmUrl} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
