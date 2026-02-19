import { describe, expect, it } from "vitest";
import { Routes, Route } from "react-router-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { SearchBar } from "@/components/SearchBar";
import SearchPage from "@/pages/SearchPage";
import { renderWithProviders, mockFetchMap } from "@/test/utils";
import { searchLukeResponse } from "@/test/fixtures/swapi";

describe("Search flow", () => {
  it("navigates to search results automatically while typing", async () => {
    const fetchMock = mockFetchMap({
      "https://swapi.dev/api/people/?search=lu": searchLukeResponse,
    });

    renderWithProviders(
      <>
        <SearchBar />
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </>,
      "/",
    );

    fireEvent.change(screen.getByPlaceholderText("Search characters..."), {
      target: { value: "lu" },
    });

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith("https://swapi.dev/api/people/?search=lu"),
    );

    expect(await screen.findByRole("heading", { name: "Search Results" })).toBeInTheDocument();
    expect(await screen.findByText("Luke Skywalker")).toBeInTheDocument();
    expect(localStorage.getItem("sw-search-history")).toContain("lu");
  });
});
