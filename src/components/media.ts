const VIDEO_FILE_EXTENSION_REGEX = /\.(mp4|mov|webm|avi|mkv|ogg)$/i;
const VIDEO_MIME_PREFIX = "video/";

type MediaThumbnailLike = {
  fileType?: string;
  mime?: string;
  name?: string;
  url: string;
  thumbnail?: string;
  thumbnailUrl?: string;
};

export function isVideoFile(
  fileType?: string,
  fileName?: string,
  mime?: string,
) {
  return (
    fileType === "video" ||
    Boolean(mime?.startsWith(VIDEO_MIME_PREFIX)) ||
    Boolean(fileName && VIDEO_FILE_EXTENSION_REGEX.test(fileName))
  );
}

export function getVideoMimeType(fileName: string, mime?: string) {
  if (mime?.startsWith(VIDEO_MIME_PREFIX)) {
    return mime;
  }

  const ext = fileName.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "ogg":
      return "video/ogg";
    default:
      return undefined;
  }
}

export function isImageKitUrl(url: string) {
  try {
    return new URL(url).hostname.includes("imagekit.io");
  } catch {
    return false;
  }
}

export function getImageKitVideoThumbnailUrl(url: string) {
  const parsedUrl = new URL(url);
  parsedUrl.pathname = `${parsedUrl.pathname.replace(/\/$/, "")}/ik-thumbnail.jpg`;
  return parsedUrl.toString();
}

export function getGridThumbnailUrl(media: MediaThumbnailLike) {
  if (media.thumbnailUrl) {
    return media.thumbnailUrl;
  }

  if (media.thumbnail) {
    return media.thumbnail;
  }

  if (isVideoFile(media.fileType, media.name, media.mime)) {
    if (isImageKitUrl(media.url)) {
      return getImageKitVideoThumbnailUrl(media.url);
    }

    return media.url;
  }

  if (isImageKitUrl(media.url)) {
    const separator = media.url.includes("?") ? "&" : "?";
    return `${media.url}${separator}tr=w-400`;
  }

  return media.url;
}

export function getMediaFallbackUrl(label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#e2e8f0"/><circle cx="200" cy="170" r="54" fill="#334155" opacity="0.88"/><polygon points="188,145 188,195 232,170" fill="#f8fafc"/><text x="200" y="280" text-anchor="middle" font-size="32" font-family="Arial, sans-serif" fill="#475569">${label}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
