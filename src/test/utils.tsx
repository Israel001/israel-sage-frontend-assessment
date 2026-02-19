import type { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { FavoritesProvider } from "@/context/FavoritesContext";

function normalizeRequestUrl(input: string | URL | Request): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

export function renderWithProviders(ui: ReactElement, route = "/") {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <MemoryRouter
          initialEntries={[route]}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          {ui}
        </MemoryRouter>
      </FavoritesProvider>
    </QueryClientProvider>,
  );
}

export function mockFetchMap(responseByUrl: Record<string, unknown>) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const url = normalizeRequestUrl(input as string | URL | Request);
    const payload = responseByUrl[url];

    if (!payload) {
      throw new Error(`Unhandled fetch request in test: ${url}`);
    }

    return {
      ok: true,
      status: 200,
      json: async () => payload,
    } as Response;
  });
}
