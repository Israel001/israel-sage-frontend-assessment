import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, X, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchHistory } from "@/hooks/use-search-history";

export function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { history, addToHistory, clearHistory } = useSearchHistory();
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Sync query from URL when on search page
  useEffect(() => {
    if (location.pathname === "/search") {
      const params = new URLSearchParams(location.search);
      const q = params.get("q") || "";
      setQuery(q);
    }
  }, [location]);

  // Debounced navigation
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`, { replace: true });
      }, 400);
    }
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, navigate]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = () => {
    if (query.trim().length >= 2) {
      addToHistory(query.trim());
      setShowDropdown(false);
    }
  };

  const selectHistory = (term: string) => {
    setQuery(term);
    addToHistory(term);
    setShowDropdown(false);
    navigate(`/search?q=${encodeURIComponent(term)}`, { replace: true });
  };

  const filteredHistory = history.filter((h) =>
    h.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search characters..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          className="pl-9 pr-8 bg-secondary/50 border-border font-body placeholder:text-muted-foreground focus:ring-primary focus:border-primary glow-border"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showDropdown && filteredHistory.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 top-full mt-1 w-full bg-card border border-border rounded-md shadow-lg overflow-hidden"
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <span className="text-xs text-muted-foreground font-body">Recent searches</span>
            <button
              onClick={clearHistory}
              className="text-xs text-primary hover:underline font-body"
            >
              Clear
            </button>
          </div>
          {filteredHistory.map((term) => (
            <button
              key={term}
              onClick={() => selectHistory(term)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-secondary/50 transition-colors font-body"
            >
              <Clock className="h-3 w-3 text-muted-foreground" />
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
