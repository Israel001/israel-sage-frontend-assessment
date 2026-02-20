import { Link } from "react-router-dom";
import { Star, X, Sparkles } from "lucide-react";
import { useFavorites, getCharacterId } from "@/context/FavoritesContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <Sidebar className="app-sidebar-shell border-r">
      <SidebarHeader className="app-sidebar-header px-4 py-4 border-b">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <div className="absolute inset-0 blur-sm opacity-60">
              <Star className="h-4 w-4 text-primary fill-primary" />
            </div>
          </div>
          <span className="font-display text-xs font-bold text-primary tracking-widest glow-text">FAVORITES</span>
        </div>
        <div className="mt-2 h-px bg-gradient-to-r from-primary/50 via-accent/20 to-transparent" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {favorites.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Sparkles className="h-6 w-6 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-xs text-muted-foreground font-body leading-relaxed">
                  No favorites yet. Star characters to add them here.
                </p>
              </div>
            ) : (
              <SidebarMenu className="px-2 py-2 gap-1">
                {favorites.map((char, i) => {
                  const id = getCharacterId(char.url);
                  return (
                    <SidebarMenuItem key={char.url}
                      style={{ animationDelay: `${i * 60}ms` }}
                      className="fade-up"
                    >
                      <SidebarMenuButton asChild>
                        <Link
                          to={`/character/${id}`}
                          className="app-sidebar-favorite-item flex items-center justify-between group/fav rounded-lg px-3 py-2 transition-all duration-200 border border-transparent"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary/60 group-hover/fav:bg-primary transition-colors shrink-0" />
                            <span className="truncate font-body text-xs text-foreground/80 group-hover/fav:text-foreground transition-colors">{char.name}</span>
                          </div>
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFavorite(char.url); }}
                            className="opacity-0 group-hover/fav:opacity-100 text-muted-foreground hover:text-destructive transition-all p-0.5 rounded"
                            aria-label={`Remove ${char.name} from favorites`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
