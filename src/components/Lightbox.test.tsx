import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Lightbox from "./Lightbox";

describe("Lightbox video rendering", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 204 }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a video element for extension-based video files", () => {
    render(
      <Lightbox
        photo={{
          fileId: "video-1",
          name: "clip.mov",
          url: "https://cdn.example.com/clip.mov",
          thumbnailUrl: "",
          height: 1080,
          width: 1920,
          fileType: "non-image",
        }}
        onClose={vi.fn()}
      />,
    );

    expect(document.querySelector("video")).not.toBeNull();
    expect(screen.queryByAltText("clip.mov")).toBeNull();
  });

  it("does not force an incorrect mp4 mime type for mkv videos", () => {
    render(
      <Lightbox
        photo={{
          fileId: "video-2",
          name: "clip.mkv",
          url: "https://cdn.example.com/clip.mkv",
          thumbnailUrl: "",
          height: 1080,
          width: 1920,
          fileType: "video",
        }}
        onClose={vi.fn()}
      />,
    );

    const source = document.querySelector("video source");
    expect(source?.getAttribute("type")).toBeNull();
  });
});
