import { useParams, Link } from "react-router-dom";
import { useCharacter, useFilm } from "@/hooks/use-swapi";
import { useFavorites } from "@/context/FavoritesContext";
import { Star, ArrowLeft, Loader2, Film, User } from "lucide-react";

function FilmChip({ url }: { url: string }) {
  const { data } = useFilm(url);
  if (!data) return (
    <span className="app-loading-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body animate-pulse border">
      <Loader2 className="h-3 w-3 animate-spin text-accent/60" />
      <span className="text-muted-foreground">Loading...</span>
    </span>
  );
  return (
    <span className="film-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-default">
      <Film className="h-3 w-3 text-accent/60" />
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
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="relative">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="absolute inset-0 h-10 w-10 animate-ping opacity-20 rounded-full bg-primary" />
        </div>
        <p className="text-xs font-display text-primary/60 tracking-widest animate-pulse">RETRIEVING DATA...</p>
      </div>
    );
  }

  if (isError || !character) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive font-body mb-4">Character not found.</p>
        <Link to="/" className="text-primary hover:underline font-body text-sm">← Back to database</Link>
      </div>
    );
  }

  const fav = isFavorite(character.url);

  const stats = [
    { label: "HEIGHT", value: `${character.height}cm`, icon: "↕" },
    { label: "MASS", value: `${character.mass}kg`, icon: "⚖" },
    { label: "HAIR", value: character.hair_color, icon: "◈" },
    { label: "SKIN", value: character.skin_color, icon: "◉" },
    { label: "EYES", value: character.eye_color, icon: "◎" },
    { label: "BIRTH", value: character.birth_year, icon: "⌖" },
    { label: "GENDER", value: character.gender, icon: "⊕" },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors font-body mb-6 group fade-up"
      >
        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
        <span className="tracking-wider">BACK TO DATABASE</span>
      </Link>

      {/* Main card */}
      <div className="glass-card rounded-2xl overflow-hidden scan-line-overlay fade-up" style={{ animationDelay: '80ms' }}>

        {/* Header section */}
        <div className="app-detail-header relative px-6 py-6 border-b">
          {/* Top corners */}
          <div className="absolute top-0 left-0 w-8 h-8">
            <div className="absolute top-0 left-0 w-px h-6 bg-primary/70" />
            <div className="absolute top-0 left-0 h-px w-6 bg-primary/70" />
          </div>
          <div className="absolute top-0 right-0 w-8 h-8">
            <div className="absolute top-0 right-0 w-px h-6 bg-primary/40" />
            <div className="absolute top-0 right-0 h-px w-6 bg-primary/40" />
          </div>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <User className="h-3.5 w-3.5 text-primary/60" />
                <span className="text-[10px] font-display text-primary/50 tracking-[0.25em]">SUBJECT PROFILE</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black glow-text text-primary tracking-wide">
                {character.name}
              </h2>
            </div>

            <button
              onClick={() => toggleFavorite(character)}
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                fav
                  ? 'bg-primary/15 app-favorite-active-shadow border border-primary/40 text-primary'
                  : 'app-favorite-button border text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10'
              }`}
              aria-label={fav ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={`h-5 w-5 transition-all duration-300 ${fav ? "fill-primary scale-110" : ""}`} />
            </button>
          </div>

          {/* Gradient divider */}
          <div className="mt-4 h-px bg-gradient-to-r from-primary/50 via-accent/30 to-transparent" />
        </div>

        {/* Stats grid */}
        <div className="px-6 py-6">
          <h3 className="font-display text-[10px] tracking-[0.3em] text-muted-foreground mb-4">BIOMETRIC DATA</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="stat-cell rounded-xl p-3 fade-up"
                style={{ animationDelay: `${120 + i * 50}ms` }}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-primary/40 text-xs">{s.icon}</span>
                  <p className="text-[10px] font-display text-muted-foreground tracking-[0.18em]">{s.label}</p>
                </div>
                <p className="text-sm font-semibold capitalize font-body text-foreground">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Films section */}
          <div className="fade-up" style={{ animationDelay: '480ms' }}>
            <h3 className="font-display text-[10px] tracking-[0.3em] text-muted-foreground mb-4">FILM APPEARANCES</h3>
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
    </div>
  );
}
