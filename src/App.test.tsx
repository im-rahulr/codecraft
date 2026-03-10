import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./components/PhotoGrid", () => ({
  default: () => <div>PhotoGrid stub</div>,
}));

vi.mock("./components/UploadPage", () => ({
  default: () => <div>UploadPage stub</div>,
}));

describe("App routing", () => {
  const originalScrollTo = window.scrollTo;

  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    window.history.pushState({}, "", "/");
    window.scrollTo = originalScrollTo;
    vi.clearAllMocks();
  });

  it("shows the gallery on the home page", () => {
    window.history.pushState({}, "", "/");
    render(<App />);

    expect(screen.getByPlaceholderText(/search photos/i)).toBeTruthy();
    expect(screen.getByText("PhotoGrid stub")).toBeTruthy();
    expect(screen.queryByText("UploadPage stub")).toBeNull();
    expect(screen.getByText("love-re Files")).toBeTruthy();
    expect(screen.queryByLabelText(/open upload page/i)).toBeNull();
    expect(document.title).toBe("love-re Files");
  });

  it("shows the upload page on /upload", () => {
    window.history.pushState({}, "", "/upload");
    render(<App />);

    expect(screen.getByText("UploadPage stub")).toBeTruthy();
    expect(screen.queryByPlaceholderText(/search photos/i)).toBeNull();
    expect(screen.queryByText("PhotoGrid stub")).toBeNull();
    expect(document.title).toBe("love-re Files - Upload");
  });

  it("navigates back to the gallery from the upload page", () => {
    window.history.pushState({}, "", "/upload");
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /go to photos/i }));

    expect(window.location.pathname).toBe("/");
    expect(screen.getByText("PhotoGrid stub")).toBeTruthy();
  }, 15000);
});
