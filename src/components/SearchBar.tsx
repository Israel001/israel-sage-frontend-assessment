import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, X, Clock } from "lucide-react";
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

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setShowDropdown(true);

    if (value.trim().length === 0 && location.pathname === "/search") {
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    if (location.pathname === "/search") {
      const params = new URLSearchParams(location.search);
      const q = params.get("q") || "";
      setQuery(q);
    }
  }, [location]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const normalizedQuery = query.trim();

    if (normalizedQuery.length > 0) {
      debounceRef.current = setTimeout(() => {
        addToHistory(normalizedQuery);
        navigate(`/search?q=${encodeURIComponent(normalizedQuery)}`, { replace: true });
      }, 400);
    }
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, addToHistory, navigate]);

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
    if (query.trim().length > 0) {
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
    <div className="relative flex-1 min-w-0">
      <div className="relative group/search">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/search:text-primary transition-colors duration-300" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search characters..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          className="app-search-input w-full pl-9 pr-8 py-2 text-sm font-body rounded-lg border transition-all duration-300 outline-none placeholder:text-muted-foreground/60 text-foreground"
        />
        {query && (
          <button
            onClick={() => { handleQueryChange(""); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {showDropdown && filteredHistory.length > 0 && (
        <div
          ref={dropdownRef}
          className="app-search-dropdown absolute z-50 top-full mt-2 w-full rounded-xl overflow-hidden border"
        >
          <div className="app-search-dropdown-header flex items-center justify-between px-3 py-2 border-b">
            <span className="text-[10px] font-display text-muted-foreground tracking-widest">RECENT</span>
            <button
              onClick={clearHistory}
              className="text-[10px] font-display text-primary/60 hover:text-primary transition-colors tracking-wider"
            >
              CLEAR
            </button>
          </div>
          {filteredHistory.map((term) => (
            <button
              key={term}
              onClick={() => selectHistory(term)}
              className="app-search-dropdown-item flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-foreground/80 hover:text-foreground transition-all duration-150 font-body"
            >
              <Clock className="h-3 w-3 text-primary/40 shrink-0" />
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
