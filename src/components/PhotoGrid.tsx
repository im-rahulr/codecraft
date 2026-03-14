import React, { useEffect, useRef, useState } from 'react';
import Lightbox from './Lightbox';
import { Play } from 'lucide-react';

interface ImageKitFile {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height: number;
  width: number;
  fileType: 'image' | 'video' | 'non-image';
}

export default function PhotoGrid() {
  const [photos, setPhotos] = useState<ImageKitFile[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  async function fetchPhotos(skip = 0, limit = 20) {
    try {
      const response = await fetch(`/api/photos?skip=${skip}&limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        const files = data.files || data;
        const total = data.totalCount || 0;
        setTotalCount(total);
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
            hypothesisId: 'A',
            location: 'PhotoGrid.tsx:fetchPhotos',
            message: 'Fetched photos sample',
            data: {
              total: Array.isArray(data) ? data.length : null,
              sample: Array.isArray(data)
                ? data.slice(0, 3).map((item) => ({
                    fileId: item.fileId,
                    name: item.name,
                    fileType: item.fileType,
                    url: item.url,
                    thumbnail: item.thumbnail,
                  }))
                : null,
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        if (files.length < 20) {
          setHasMore(false);
        }
        setPhotos(prev => skip === 0 ? files : [...prev, ...files]);
      }
    } catch (error) {
      console.error("Failed to load photos", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (!hasMore || loading) {
      return;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMore && !loadingMore) {
        setLoadingMore(true);
        fetchPhotos(photos.length);
      }
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, photos.length, loading]);

  // Helper to determine span based on index to match the reference image pattern
  // Pattern: 3 items per row (x2 rows), then 2 items per row (x3 rows)
  // This repeats every 12 items.
  const getLayoutSettings = (index: number) => {
    const patternIndex = index % 12;
    
    // First 6 items (Indices 0-5): 3 items per row
    // On a 6-column grid, each item takes 2 columns
    if (patternIndex < 6) {
      return "col-span-2 aspect-[3/4]";
    }
    
    // Next 6 items (Indices 6-11): 2 items per row
    // On a 6-column grid, each item takes 3 columns
    return "col-span-3 aspect-[4/3]";
  };

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const handleNext = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  // Helper to generate a valid thumbnail URL
  const getThumbnailUrl = (photo: ImageKitFile) => {
    // If a thumbnail URL is provided by the API, use it
    if (photo.thumbnailUrl) return photo.thumbnailUrl;
    
    // If it's a video, or looks like one, construct a thumbnail URL using ImageKit transformations
    // 'so-0' grabs the frame at 0 seconds
    if (photo.fileType === 'video' || photo.name.match(/\.(mp4|mov|webm|avi|mkv)$/i)) {
       // Only apply ImageKit transformations if the URL is hosted on ImageKit
       if (photo.url.includes('ik.imagekit.io')) {
         const separator = photo.url.includes('?') ? '&' : '?';
         const thumbUrl = `${photo.url}${separator}tr=w-400,h-400,so-0`;
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
             hypothesisId: 'B',
             location: 'PhotoGrid.tsx:getThumbnailUrl',
             message: 'Computed video thumbnail URL',
             data: {
               fileId: photo.fileId,
               name: photo.name,
               originalUrl: photo.url,
               thumbUrl,
             },
             timestamp: Date.now(),
           }),
         }).catch(() => {});
         // #endregion
         return thumbUrl;
       }
       // For non-ImageKit videos, return the original URL
       return photo.url;
    }
    
    // For regular images, resize them for the grid to improve performance
    // Check if it's an imagekit URL to apply transformations
    if (photo.url.includes('ik.imagekit.io')) {
      const separator = photo.url.includes('?') ? '&' : '?';
      return `${photo.url}${separator}tr=w-400`;
    }

    return photo.url;
  };

  const isVideo = (photo: ImageKitFile) => {
    return (
      photo.fileType === 'video' ||
      !!photo.name.match(/\.(mp4|mov|webm|avi|mkv)$/i)
    );
  };

  const visiblePhotos = photos;

  // Count only images (not videos)
  const imageCount = photos.filter(photo => !isVideo(photo)).length;

  return (
    <main className="px-1 sm:px-4 pb-32 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4 mt-4 px-3 sm:px-0">
        <div className="flex items-baseline gap-2">
          <h1 className="text-xl font-medium text-gray-800">Photos</h1>
          <span className="text-sm text-gray-500">{imageCount} items</span>
        </div>
        
        <div className="flex items-center gap-3">
        </div>
              </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-1">
          {visiblePhotos.map((photo, index) => (
            <div 
              key={photo.fileId} 
              className={`relative group overflow-hidden bg-gray-100 cursor-pointer ${getLayoutSettings(index)}`}
              onClick={() => handlePhotoClick(index)}
            >
              {isVideo(photo) ? (
                <div className="w-full h-full relative">
                  <img 
                    src={getThumbnailUrl(photo)} 
                    alt={photo.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      // Fallback if thumbnail generation fails
                      e.currentTarget.src = "https://placehold.co/400x400/e2e8f0/475569?text=Video";
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                    <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
                      <Play className="w-5 h-5 text-gray-900 ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
              ) : (
                <img 
                  src={getThumbnailUrl(photo)} 
                  alt={photo.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/400x400/e2e8f0/475569?text=Error";
                  }}
                />
              )}
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
              
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-5 h-5 rounded-full border-2 border-white/80 bg-black/20 hover:bg-black/40 cursor-pointer"></div>
              </div>
            </div>
          ))}
          {visiblePhotos.length === 0 && (
            <div className="col-span-6 text-center py-20 text-gray-500">
              No photos or videos found.
            </div>
          )}
        </div>
      )}

      {hasMore && visiblePhotos.length > 0 && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {loadingMore && (
            <div className="w-6 h-6 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      )}
      {selectedPhotoIndex !== null && (
        <Lightbox 
          photo={photos[selectedPhotoIndex]} 
          onClose={handleCloseLightbox}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={selectedPhotoIndex < photos.length - 1}
          hasPrev={selectedPhotoIndex > 0}
        />
      )}
    </main>
  );
}
