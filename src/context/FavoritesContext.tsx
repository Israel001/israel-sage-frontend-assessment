import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { SWAPICharacter } from "@/types/swapi";
import { getCharacterId } from "@/types/swapi";

interface FavoritesContextType {
  favorites: SWAPICharacter[];
  isFavorite: (url: string) => boolean;
  toggleFavorite: (character: SWAPICharacter) => void;
  removeFavorite: (url: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY = "sw-favorites";

function loadFavorites(): SWAPICharacter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<SWAPICharacter[]>(loadFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback(
    (url: string) => favorites.some((c) => c.url === url),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (character: SWAPICharacter) => {
      setFavorites((prev) =>
        prev.some((c) => c.url === character.url)
          ? prev.filter((c) => c.url !== character.url)
          : [...prev, character]
      );
    },
    []
  );

  const removeFavorite = useCallback(
    (url: string) => setFavorites((prev) => prev.filter((c) => c.url !== url)),
    []
  );

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}

export { getCharacterId };
