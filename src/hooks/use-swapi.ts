import { useQuery } from "@tanstack/react-query";
import type { SWAPIResponse, SWAPICharacter, SWAPIFilm } from "@/types/swapi";

const BASE_URL = "https://swapi.dev/api";

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`SWAPI error: ${res.status}`);
  return res.json();
}

export function useCharacters(page: number) {
  return useQuery({
    queryKey: ["characters", page],
    queryFn: () => fetchJSON<SWAPIResponse<SWAPICharacter>>(`${BASE_URL}/people/?page=${page}`),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCharacter(id: string) {
  return useQuery({
    queryKey: ["character", id],
    queryFn: () => fetchJSON<SWAPICharacter>(`${BASE_URL}/people/${id}/`),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
}

export function useSearchCharacters(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchJSON<SWAPIResponse<SWAPICharacter>>(`${BASE_URL}/people/?search=${encodeURIComponent(query)}`),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5,
  });
}

export function useFilm(url: string) {
  return useQuery({
    queryKey: ["film", url],
    queryFn: () => fetchJSON<SWAPIFilm>(url),
    enabled: !!url,
    staleTime: 1000 * 60 * 30,
  });
}
