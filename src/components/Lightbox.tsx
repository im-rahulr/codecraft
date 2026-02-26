import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Share2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageKitFile {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height: number;
  width: number;
  fileType: 'image' | 'video' | 'non-image';
}

interface LightboxProps {
  photo: ImageKitFile | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export default function Lightbox({ photo, onClose, onNext, onPrev, hasNext, hasPrev }: LightboxProps) {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    if (photo) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [photo, onClose, onNext, onPrev]);

  if (!photo) return null;

  // #region agent log
  fetch('', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '4f6924',
    },
    body: JSON.stringify({
      sessionId: '4f6924',
      runId: 'initial',
      hypothesisId: 'C',
      location: 'Lightbox.tsx:render',
      message: 'Lightbox opened',
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

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={onClose} // Close on backdrop click
        >
          {/* Toolbar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 text-white/90" onClick={(e) => e.stopPropagation()}>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
            
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
            {photo.fileType === 'video' ? (
              <video
                src={photo.url}
                controls
                autoPlay
                className="max-w-full max-h-full shadow-2xl outline-none"
              />
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
              onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
              className="absolute left-4 p-3 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}
          
          {hasNext && (
            <button
              onClick={(e) => { e.stopPropagation(); onNext?.(); }}
              className="absolute right-4 p-3 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
          
          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white pointer-events-none">
             <h3 className="text-lg font-medium truncate">{photo.name}</h3>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
