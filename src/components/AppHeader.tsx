import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchBar } from "@/components/SearchBar";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-background/80 backdrop-blur-md px-4 h-14">
      <SidebarTrigger className="text-muted-foreground hover:text-primary" />
      <Link to="/" className="shrink-0">
        <h1 className="font-display text-xs sm:text-sm font-bold tracking-wide glow-text text-primary">
          STAR WARS
        </h1>
      </Link>
      <SearchBar />
    </header>
  );
}
