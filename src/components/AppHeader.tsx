import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchBar } from "@/components/SearchBar";
import { useTheme } from "next-themes";

export function AppHeader() {
  const { resolvedTheme, setTheme } = useTheme();
  const activeTheme = resolvedTheme ?? "dark";
  const isLight = activeTheme === "light";

  return (
    <header className="app-header-shell sticky top-0 z-30 flex items-center gap-3 px-4 h-14">
      <SidebarTrigger className="text-muted-foreground hover:text-primary transition-colors duration-200" />

      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Link to="/" className="shrink-0 group">
          <h1 className="font-display text-xs sm:text-sm font-black tracking-[0.2em] glow-text text-primary transition-all duration-300 group-hover:tracking-[0.25em]">
            STAR WARS
          </h1>
        </Link>

        {/* Vertical divider */}
        <div className="h-5 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent shrink-0" />

        <SearchBar />

        <button
          type="button"
          onClick={() => setTheme(isLight ? "dark" : "light")}
          className="theme-toggle-btn shrink-0 inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-body font-semibold"
          aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
          title={`Switch to ${isLight ? "dark" : "light"} mode`}
        >
          {isLight ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline tracking-wide">{isLight ? "LIGHT" : "DARK"}</span>
        </button>
      </div>
    </header>
  );
}
