import { Link } from "react-router-dom";
import { Star, X } from "lucide-react";
import { useFavorites, getCharacterId } from "@/context/FavoritesContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          <span className="font-display text-sm font-semibold text-foreground">Favorites</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {favorites.length === 0 ? (
              <p className="px-4 py-6 text-xs text-muted-foreground font-body text-center">
                No favorites yet. Star characters to add them here.
              </p>
            ) : (
              <SidebarMenu>
                {favorites.map((char) => {
                  const id = getCharacterId(char.url);
                  return (
                    <SidebarMenuItem key={char.url}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={`/character/${id}`}
                          className="flex items-center justify-between group/fav"
                        >
                          <span className="truncate font-body text-sm">{char.name}</span>
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFavorite(char.url); }}
                            className="opacity-0 group-hover/fav:opacity-100 text-muted-foreground hover:text-destructive transition-all"
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
