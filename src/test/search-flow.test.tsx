import { describe, expect, it } from "vitest";
import { Routes, Route } from "react-router-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { SearchBar } from "@/components/SearchBar";
import SearchPage from "@/pages/SearchPage";
import { renderWithProviders, mockFetchMap } from "@/test/utils";
import { searchLukeResponse } from "@/test/fixtures/swapi";

describe("Search flow", () => {
  it("navigates to search results automatically while typing a single character", async () => {
    const fetchMock = mockFetchMap({
      "https://swapi.dev/api/people/?search=l": searchLukeResponse,
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
      target: { value: "l" },
    });

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith("https://swapi.dev/api/people/?search=l"),
    );

    expect(await screen.findByRole("heading", { name: "Search Results" })).toBeInTheDocument();
    expect(await screen.findByText("Luke Skywalker")).toBeInTheDocument();
    expect(localStorage.getItem("sw-search-history")).toContain("l");
  });

  it("returns to the home list route when search input is cleared", async () => {
    renderWithProviders(
      <>
        <SearchBar />
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/search" element={<div>Search Route</div>} />
        </Routes>
      </>,
      "/search?q=lu",
    );

    const input = screen.getByPlaceholderText("Search characters...");
    await waitFor(() => expect(input).toHaveValue("lu"));
    expect(screen.getByText("Search Route")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "" } });

    await waitFor(() => expect(screen.getByText("Home")).toBeInTheDocument());
  });

  it("shows newly typed searches in recent history dropdown", async () => {
    renderWithProviders(
      <>
        <SearchBar />
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/search" element={<div>Search Route</div>} />
        </Routes>
      </>,
      "/",
    );

    const input = screen.getByPlaceholderText("Search characters...");
    fireEvent.change(input, { target: { value: "han" } });

    await waitFor(() => expect(screen.getByText("Search Route")).toBeInTheDocument());

    fireEvent.change(input, { target: { value: "" } });
    await waitFor(() => expect(screen.getByText("Home")).toBeInTheDocument());

    fireEvent.focus(input);
    expect(await screen.findByRole("button", { name: "han" })).toBeInTheDocument();
  });
});
