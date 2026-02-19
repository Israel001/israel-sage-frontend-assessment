import { describe, expect, it } from "vitest";
import { Routes, Route, useParams } from "react-router-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import HomePage from "@/pages/HomePage";
import { renderWithProviders, mockFetchMap } from "@/test/utils";
import { homePageResponse, lukeSkywalker } from "@/test/fixtures/swapi";

function SidebarTestLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/character/:id" element={<CharacterRouteProbe />} />
        </Routes>
      </SidebarInset>
    </SidebarProvider>
  );
}

function CharacterRouteProbe() {
  const { id } = useParams<{ id: string }>();
  return <p>Character route {id}</p>;
}

describe("Favorites and sidebar flow", () => {
  it("adds/removes favorites and persists them in localStorage", async () => {
    mockFetchMap({
      "https://swapi.dev/api/people/?page=1": homePageResponse,
    });

    const { unmount } = renderWithProviders(<SidebarTestLayout />, "/");

    expect(await screen.findByText("Luke Skywalker")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add to favorites" }));

    expect(
      await screen.findByRole("button", { name: "Remove Luke Skywalker from favorites" }),
    ).toBeInTheDocument();
    expect(localStorage.getItem("sw-favorites")).toContain("Luke Skywalker");

    unmount();
    renderWithProviders(<SidebarTestLayout />, "/");

    expect(
      await screen.findByRole("button", { name: "Remove Luke Skywalker from favorites" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Remove Luke Skywalker from favorites" }));

    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: "Remove Luke Skywalker from favorites" }),
      ).not.toBeInTheDocument(),
    );
    expect(screen.getByText("No favorites yet. Star characters to add them here.")).toBeInTheDocument();
    expect(localStorage.getItem("sw-favorites")).toBe("[]");
  });

  it("navigates from sidebar favorites link to character detail route", async () => {
    localStorage.setItem("sw-favorites", JSON.stringify([lukeSkywalker]));
    mockFetchMap({
      "https://swapi.dev/api/people/?page=1": homePageResponse,
    });

    renderWithProviders(<SidebarTestLayout />, "/");

    const sidebarLink = await screen.findByRole("link", { name: /Luke Skywalker/i });
    fireEvent.click(sidebarLink);

    expect(await screen.findByText("Character route 1")).toBeInTheDocument();
  });
});
