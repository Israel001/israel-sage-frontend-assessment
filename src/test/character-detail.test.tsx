import { describe, expect, it } from "vitest";
import { Routes, Route } from "react-router-dom";
import { fireEvent, screen } from "@testing-library/react";
import CharacterDetailPage from "@/pages/CharacterDetailPage";
import { renderWithProviders, mockFetchMap } from "@/test/utils";
import { lukeSkywalker, aNewHope } from "@/test/fixtures/swapi";

describe("Character detail page", () => {
  it("renders character stats and film appearances, then toggles favorite state", async () => {
    mockFetchMap({
      "https://swapi.dev/api/people/1/": lukeSkywalker,
      "https://swapi.dev/api/films/1/": aNewHope,
    });

    renderWithProviders(
      <Routes>
        <Route path="/character/:id" element={<CharacterDetailPage />} />
      </Routes>,
      "/character/1",
    );

    expect(await screen.findByRole("heading", { name: "Luke Skywalker" })).toBeInTheDocument();
    expect(screen.getByText("172cm")).toBeInTheDocument();
    expect(screen.getByText("77kg")).toBeInTheDocument();
    expect(await screen.findByText("A New Hope")).toBeInTheDocument();

    const toggleButton = screen.getByRole("button", { name: "Add to favorites" });
    fireEvent.click(toggleButton);
    expect(screen.getByRole("button", { name: "Remove from favorites" })).toBeInTheDocument();
    expect(localStorage.getItem("sw-favorites")).toContain("Luke Skywalker");

    fireEvent.click(screen.getByRole("button", { name: "Remove from favorites" }));
    expect(screen.getByRole("button", { name: "Add to favorites" })).toBeInTheDocument();
    expect(localStorage.getItem("sw-favorites")).toBe("[]");
  });
});
