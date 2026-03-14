import { describe, expect, it, vi } from "vitest";
import { UploadRequestError, handleUploadRequest } from "./uploadApi";

function createUploadRequest(
  password: string,
  files: Array<{ contents: string; name: string; type: string }>,
) {
  const formData = new FormData();
  formData.set("password", password);
  files.forEach((file) => {
    formData.append(
      "files",
      new File([file.contents], file.name, { type: file.type }),
    );
  });

  return {
    formData: async () => formData,
  } as unknown as Request;
}

describe("handleUploadRequest", () => {
  it("correct password allows an image upload", async () => {
    const upload = vi.fn().mockResolvedValue({
      fileId: "image-1",
      name: "photo.jpg",
      url: "https://ik.imagekit.io/demo/photo.jpg",
      thumbnailUrl: "https://ik.imagekit.io/demo/photo.jpg?tr=w-400",
      fileType: "image",
    });

    const result = await handleUploadRequest({
      request: createUploadRequest("7760", [
        { contents: "image-bytes", name: "photo.jpg", type: "image/jpeg" },
      ]),
      imagekit: { upload },
    });

    expect(upload).toHaveBeenCalledTimes(1);
    expect(upload.mock.calls[0][0].fileName).toBe("photo.jpg");
    expect(upload.mock.calls[0][0].tags).toContain("image");
    expect(result.uploadedFiles[0].fileId).toBe("image-1");
  });

  it("wrong password blocks upload attempts", async () => {
    const upload = vi.fn();

    await expect(
      handleUploadRequest({
        request: createUploadRequest("wrong-password", [
          { contents: "image-bytes", name: "photo.jpg", type: "image/jpeg" },
        ]),
        imagekit: { upload },
      }),
    ).rejects.toMatchObject({
      status: 401,
      message: "Incorrect upload password.",
    } satisfies Partial<UploadRequestError>);

    expect(upload).not.toHaveBeenCalled();
  });

  it("supports the video upload path", async () => {
    const upload = vi.fn().mockResolvedValue({
      fileId: "video-1",
      name: "clip.mp4",
      url: "https://ik.imagekit.io/demo/clip.mp4",
      thumbnailUrl: "https://ik.imagekit.io/demo/clip.mp4/ik-thumbnail.jpg",
      fileType: "non-image",
    });

    const result = await handleUploadRequest({
      request: createUploadRequest("7760", [
        { contents: "video-bytes", name: "clip.mp4", type: "video/mp4" },
      ]),
      imagekit: { upload },
    });

    expect(upload).toHaveBeenCalledTimes(1);
    expect(upload.mock.calls[0][0].tags).toContain("video");
    expect(result.uploadedFiles[0].fileId).toBe("video-1");
  });

  it("accepts common supported files identified by extension", async () => {
    const upload = vi.fn().mockResolvedValue({
      fileId: "video-2",
      name: "movie.mov",
      url: "https://ik.imagekit.io/demo/movie.mov",
      thumbnailUrl: "https://ik.imagekit.io/demo/movie.mov/ik-thumbnail.jpg",
      fileType: "non-image",
    });

    await handleUploadRequest({
      request: createUploadRequest("7760", [
        { contents: "video-bytes", name: "movie.mov", type: "" },
      ]),
      imagekit: { upload },
    });

    expect(upload).toHaveBeenCalledTimes(1);
    expect(upload.mock.calls[0][0].fileName).toBe("movie.mov");
  });
});
