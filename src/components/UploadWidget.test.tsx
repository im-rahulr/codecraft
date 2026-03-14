import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import UploadWidget from "./UploadWidget";

describe("UploadWidget", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows the waiting-for-password state after files are selected", () => {
    render(<UploadWidget />);

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    fireEvent.change(input, {
      target: {
        files: [new File(["image"], "photo.jpg", { type: "image/jpeg" })],
      },
    });

    expect(
      screen.getByText(/Enter the upload password to continue/i),
    ).toBeTruthy();
    expect(screen.getByDisplayValue("7760")).toBeTruthy();
  });

  it("shows an upload failure message returned by the API", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "Incorrect upload password." }), {
        status: 401,
      }),
    );

    render(<UploadWidget />);

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    fireEvent.change(input, {
      target: {
        files: [new File(["video"], "clip.mp4", { type: "video/mp4" })],
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /start upload/i }));

    await waitFor(() => {
      expect(screen.getByText("Incorrect upload password.")).toBeTruthy();
    });
  }, 15000);
});
