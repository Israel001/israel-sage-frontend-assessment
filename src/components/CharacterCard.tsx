import { Link } from "react-router-dom";
import { Star, Zap } from "lucide-react";
import type { SWAPICharacter } from "@/types/swapi";
import { getCharacterId } from "@/types/swapi";
import { useFavorites } from "@/context/FavoritesContext";

interface CharacterCardProps {
  character: SWAPICharacter;
  style?: React.CSSProperties;
}

export function CharacterCard({ character, style }: CharacterCardProps) {
  const id = getCharacterId(character.url);
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(character.url);

  return (
    <div
      className="group relative rounded-xl p-px transition-all duration-500 fade-up"
      style={style}
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "var(--card-gradient-border)",
          backgroundSize: '300% 300%',
          animation: 'border-flow 3s ease infinite',
          borderRadius: 'inherit',
          padding: '1px',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Static border */}
      <div className="app-card-static-border absolute inset-0 rounded-xl border group-hover:border-transparent transition-colors duration-500" />

      {/* Glass card body */}
      <div className="app-card-surface relative rounded-xl overflow-hidden glass-card scan-line-overlay transition-all duration-500 group-hover:-translate-y-1">

        {/* Corner accent */}
        <div className="absolute top-0 left-0 w-6 h-6 overflow-hidden">
          <div className="absolute top-0 left-0 w-px h-4 bg-primary opacity-60" />
          <div className="absolute top-0 left-0 h-px w-4 bg-primary opacity-60" />
        </div>
        <div className="absolute bottom-0 right-0 w-6 h-6 overflow-hidden">
          <div className="absolute bottom-0 right-0 w-px h-4 bg-primary opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
          <div className="absolute bottom-0 right-0 h-px w-4 bg-primary opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
        </div>

        <Link to={`/character/${id}`} className="block p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3 pr-6">
            <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight tracking-wide">
              {character.name}
            </h3>
            <Zap className="h-3 w-3 text-primary/40 group-hover:text-primary transition-colors duration-300 shrink-0 mt-0.5" />
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-primary/30 via-accent/20 to-transparent mb-3" />

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {[
              { label: 'GENDER', value: character.gender },
              { label: 'BIRTH', value: character.birth_year },
              { label: 'HEIGHT', value: `${character.height}cm` },
              { label: 'MASS', value: `${character.mass}kg` },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col">
                <span className="text-[10px] font-display text-muted-foreground tracking-wide opacity-85">{label}</span>
                <span className="text-sm font-body text-foreground/90 font-medium leading-snug">{value}</span>
              </div>
            ))}
          </div>
        </Link>

        {/* Fav button */}
        <button
          onClick={(e) => { e.preventDefault(); toggleFavorite(character); }}
          className={`absolute top-3 right-3 p-1.5 rounded-lg transition-all duration-300 ${
            fav
              ? 'text-primary bg-primary/10 app-favorite-active-shadow'
              : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
          }`}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        >
          <Star className={`h-3.5 w-3.5 transition-all duration-300 ${fav ? "fill-primary scale-110" : ""}`} />
        </button>
      </div>
    </div>
  );
}
