import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { SWAPICharacter } from "@/types/swapi";
import { getCharacterId } from "@/types/swapi";
import { useFavorites } from "@/context/FavoritesContext";

interface CharacterCardProps {
  character: SWAPICharacter;
}

export function CharacterCard({ character }: CharacterCardProps) {
  const id = getCharacterId(character.url);
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(character.url);

  return (
    <div className="group relative bg-card border border-border rounded-lg p-4 transition-all duration-300 glow-border glow-border-hover hover:-translate-y-0.5">
      <Link to={`/character/${id}`} className="block">
        <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate pr-8">
          {character.name}
        </h3>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-body text-muted-foreground">
          <span>Gender: <span className="text-foreground">{character.gender}</span></span>
          <span>Birth: <span className="text-foreground">{character.birth_year}</span></span>
          <span>Height: <span className="text-foreground">{character.height}cm</span></span>
          <span>Mass: <span className="text-foreground">{character.mass}kg</span></span>
        </div>
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); toggleFavorite(character); }}
        className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      >
        <Star className={`h-4 w-4 ${fav ? "fill-primary text-primary" : ""}`} />
      </button>
    </div>
  );
}
