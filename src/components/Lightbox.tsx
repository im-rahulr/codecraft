import React, { useEffect, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getVideoMimeType, isVideoFile } from "./media";

interface ImageKitFile {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  thumbnail?: string;
  height: number;
  width: number;
  fileType: "image" | "video" | "non-image";
  mime?: string;
}

interface LightboxProps {
  photo: ImageKitFile | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export default function Lightbox({
  photo,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: LightboxProps) {
  const [videoError, setVideoError] = React.useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && onNext) onNext();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
    };

    if (photo) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scrolling
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [photo, onClose, onNext, onPrev]);

  // Reset video error state when photo changes
  useEffect(() => {
    setVideoError(false);
  }, [photo]);

  if (!photo) return null;

  // #region agent log
  fetch("", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "4f6924",
    },
    body: JSON.stringify({
      sessionId: "4f6924",
      runId: "initial",
      hypothesisId: "C",
      location: "Lightbox.tsx:render",
      message: "Lightbox opened",
      data: {
        fileId: photo.fileId,
        name: photo.name,
        fileType: photo.fileType,
        url: photo.url,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  const videoMimeType = getVideoMimeType(photo.name, photo.mime);
  const shouldRenderVideo = isVideoFile(photo.fileType, photo.name, photo.mime);

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center"
          onClick={onClose} // Close on backdrop click
        >
          {/* Toolbar */}
          <div
            className="absolute top-0 left-0 right-0 p-4 flex items-center z-10 text-white/90"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex-1 px-4 truncate text-center">{photo.name}</div>
            <div className="flex gap-4">
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Info className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <motion.div
            className="relative w-full h-full flex items-center justify-center p-4 sm:p-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {shouldRenderVideo ? (
              videoError ? (
                <div className="text-white text-center">
                  <p className="text-lg mb-2">Unable to play video</p>
                  <p className="text-sm text-white/70">
                    The video format may not be supported by your browser
                  </p>
                  <a
                    href={photo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
                  >
                    Open video in new tab
                  </a>
                </div>
              ) : (
                <video
                  key={photo.fileId}
                  ref={videoRef}
                  controls
                  autoPlay
                  muted
                  playsInline
                  preload="metadata"
                  className="max-w-full max-h-full shadow-2xl outline-none"
                  onError={() => setVideoError(true)}
                >
                  <source
                    src={photo.url}
                    {...(videoMimeType ? { type: videoMimeType } : {})}
                  />
                  Your browser does not support the video tag.
                </video>
              )
            ) : (
              <img
                src={photo.url}
                alt={photo.name}
                className="max-w-full max-h-full object-contain shadow-2xl"
              />
            )}
          </motion.div>

          {/* Navigation Buttons */}
          {hasPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev?.();
              }}
              className="absolute left-4 p-3 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {hasNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext?.();
              }}
              className="absolute right-4 p-3 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
