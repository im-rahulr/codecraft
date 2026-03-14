import { Buffer } from "node:buffer";
import { WEBSITE_UPLOAD_PASSWORD } from "../uploadConfig";

const SUPPORTED_UPLOAD_EXTENSION_REGEX =
  /\.(jpg|jpeg|png|gif|webp|bmp|svg|heic|heif|mp4|mov|webm|avi|mkv|ogg)$/i;

export class UploadRequestError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "UploadRequestError";
  }
}

export interface UploadFileLike {
  name: string;
  type: string;
  size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
}

function isUploadFileLike(value: FormDataEntryValue): value is File {
  return (
    typeof value !== "string" &&
    typeof value.name === "string" &&
    typeof value.type === "string" &&
    typeof value.size === "number" &&
    typeof value.arrayBuffer === "function"
  );
}

export interface ImageKitUploadClient {
  upload(options: {
    file: Buffer;
    fileName: string;
    useUniqueFileName?: boolean;
    tags?: string[];
    responseFields?: string[];
    isPublished?: boolean;
  }): Promise<any>;
}

function isVideoMime(type: string) {
  return type.startsWith("video/");
}

function isImageMime(type: string) {
  return type.startsWith("image/");
}

function isVideoFileLike(file: Pick<UploadFileLike, "name" | "type">) {
  return (
    isVideoMime(file.type) || /\.(mp4|mov|webm|avi|mkv|ogg)$/i.test(file.name)
  );
}

export function isSupportedUploadFile(
  file: Pick<UploadFileLike, "name" | "type">,
) {
  return (
    isImageMime(file.type) ||
    isVideoMime(file.type) ||
    SUPPORTED_UPLOAD_EXTENSION_REGEX.test(file.name)
  );
}

export function verifyUploadPassword(
  providedPassword: string,
  expectedPassword = WEBSITE_UPLOAD_PASSWORD,
) {
  if (providedPassword !== expectedPassword) {
    throw new UploadRequestError(401, "Incorrect upload password.");
  }
}

export async function parseUploadForm(request: Request) {
  const formData = await request.formData();
  const passwordEntry = formData.get("password");
  const providedPassword =
    typeof passwordEntry === "string" ? passwordEntry : "";
  const files = formData
    .getAll("files")
    .filter(
      (entry): entry is File => isUploadFileLike(entry) && entry.size > 0,
    );

  if (files.length === 0) {
    throw new UploadRequestError(
      400,
      "Select at least one image or video file to upload.",
    );
  }

  return { providedPassword, files };
}

export async function handleUploadRequest({
  request,
  imagekit,
  expectedPassword = WEBSITE_UPLOAD_PASSWORD,
}: {
  request: Request;
  imagekit: ImageKitUploadClient;
  expectedPassword?: string;
}) {
  const { providedPassword, files } = await parseUploadForm(request);
  verifyUploadPassword(providedPassword, expectedPassword);

  const unsupportedFile = files.find((file) => !isSupportedUploadFile(file));
  if (unsupportedFile) {
    throw new UploadRequestError(
      400,
      `Unsupported file type: ${unsupportedFile.name}`,
    );
  }

  const uploadedFiles = await Promise.all(
    files.map(async (file) => {
      const uploaded = await imagekit.upload({
        file: Buffer.from(await file.arrayBuffer()),
        fileName: file.name,
        useUniqueFileName: true,
        tags: ["website-upload", isVideoFileLike(file) ? "video" : "image"],
        responseFields: ["tags", "thumbnailUrl"],
        isPublished: true,
      });

      return {
        name: uploaded.name ?? file.name,
        fileId: uploaded.fileId,
        url: uploaded.url,
        thumbnailUrl: uploaded.thumbnailUrl,
        fileType: uploaded.fileType,
      };
    }),
  );

  return { uploadedFiles };
}
