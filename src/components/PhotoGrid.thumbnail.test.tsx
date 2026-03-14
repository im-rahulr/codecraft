import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PhotoGrid from "./PhotoGrid";
import { getMediaFallbackUrl } from "./media";

class MockIntersectionObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

describe("PhotoGrid video thumbnail loading", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;

      if (url.startsWith("/api/photos")) {
        return new Response(
          JSON.stringify({
            files: [
              {
                fileId: "video-1",
                name: "clip.mp4",
                url: "https://ik.imagekit.io/demo/clip.mp4?updatedAt=1",
                thumbnail:
                  "https://ik.imagekit.io/demo/clip.mp4/ik-thumbnail.jpg?updatedAt=1",
                height: 1080,
                width: 1920,
                fileType: "non-image",
                mime: "video/mp4",
              },
            ],
            totalCount: 1,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }

      return new Response(null, { status: 204 });
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the ImageKit thumbnail field for video tiles", async () => {
    render(<PhotoGrid />);

    const img = await screen.findByAltText("clip.mp4");
    expect(img.getAttribute("src")).toBe(
      "https://ik.imagekit.io/demo/clip.mp4/ik-thumbnail.jpg?updatedAt=1",
    );
  });

  it("falls back to a local placeholder when a video thumbnail fails to load", async () => {
    render(<PhotoGrid />);

    const img = await screen.findByAltText("clip.mp4");
    fireEvent.error(img);

    expect(img.getAttribute("src")).toBe(getMediaFallbackUrl("Video"));
  });
});
