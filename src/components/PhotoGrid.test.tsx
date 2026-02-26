import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Bug Condition Exploration Test for Video Playback Fix
 * 
 * **Validates: Requirements 1.1, 2.1, 2.3**
 * 
 * **Property 1: Fault Condition** - Non-ImageKit Video Thumbnail Generation
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * 
 * This test encodes the expected behavior:
 * - Non-ImageKit video URLs should NOT have ImageKit transformation parameters appended
 * - The result should either:
 *   1. NOT include 'so-0' (the ImageKit video frame extraction parameter), OR
 *   2. Include 'ik.imagekit.io' (meaning it's an ImageKit URL where transformations are valid)
 * - The result should be a valid URL
 * 
 * When this test FAILS on unfixed code, it proves the bug exists.
 * When this test PASSES after the fix, it confirms the expected behavior is satisfied.
 */

// Mock ImageKitFile interface matching PhotoGrid.tsx
interface ImageKitFile {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height: number;
  width: number;
  fileType: 'image' | 'video' | 'non-image';
}

// Extract getThumbnailUrl function logic from PhotoGrid.tsx for testing
// This is the UNFIXED version that will demonstrate the bug
const getThumbnailUrl = (photo: ImageKitFile) => {
  // If a thumbnail URL is provided by the API, use it
  if (photo.thumbnailUrl) return photo.thumbnailUrl;
  
  // If it's a video, or looks like one, construct a thumbnail URL using ImageKit transformations
  // 'so-0' grabs the frame at 0 seconds
  if (photo.fileType === 'video' || photo.name.match(/\.(mp4|mov|webm|avi|mkv)$/i)) {
     const separator = photo.url.includes('?') ? '&' : '?';
     return `${photo.url}${separator}tr=w-400,h-400,so-0`;
  }
  
  // For regular images, resize them for the grid to improve performance
  // Check if it's an imagekit URL to apply transformations
  if (photo.url.includes('ik.imagekit.io')) {
    const separator = photo.url.includes('?') ? '&' : '?';
    return `${photo.url}${separator}tr=w-400`;
  }

  return photo.url;
};

describe('Bug Condition Exploration: Non-ImageKit Video Thumbnail Generation', () => {
  describe('Property 1: Fault Condition - Non-ImageKit Video Thumbnail Generation', () => {
    it('should NOT append ImageKit transformation parameters to non-ImageKit video URLs', () => {
      /**
       * Test Case 1: Non-ImageKit video URL without query params
       * 
       * Expected behavior: Result should NOT include 'so-0' OR should include 'ik.imagekit.io'
       * Current (buggy) behavior: Appends ?tr=w-400,h-400,so-0 to non-ImageKit URL
       */
      const videoFile1: ImageKitFile = {
        fileId: 'test-1',
        name: 'video.mp4',
        url: 'https://cdn.example.com/video.mp4',
        thumbnailUrl: '',
        height: 1080,
        width: 1920,
        fileType: 'video',
      };

      const result1 = getThumbnailUrl(videoFile1);
      
      // This assertion encodes the expected behavior
      // It will FAIL on unfixed code because the unfixed code appends 'so-0' to non-ImageKit URLs
      expect(
        !result1.includes('so-0') || result1.includes('ik.imagekit.io'),
        `Expected non-ImageKit video URL to NOT include 'so-0' transformation parameter. ` +
        `Got: ${result1}. ` +
        `This confirms the bug: ImageKit transformations are being applied to non-ImageKit URLs.`
      ).toBe(true);
    });

    it('should NOT append ImageKit transformation parameters to non-ImageKit video URLs with existing query params', () => {
      /**
       * Test Case 2: Non-ImageKit video URL with existing query params
       * 
       * Expected behavior: Result should NOT include 'so-0' OR should include 'ik.imagekit.io'
       * Current (buggy) behavior: Appends &tr=w-400,h-400,so-0 to non-ImageKit URL
       */
      const videoFile2: ImageKitFile = {
        fileId: 'test-2',
        name: 'video.mp4',
        url: 'https://storage.example.com/video.mp4?token=abc123',
        thumbnailUrl: '',
        height: 1080,
        width: 1920,
        fileType: 'video',
      };

      const result2 = getThumbnailUrl(videoFile2);
      
      // This assertion encodes the expected behavior
      expect(
        !result2.includes('so-0') || result2.includes('ik.imagekit.io'),
        `Expected non-ImageKit video URL with query params to NOT include 'so-0' transformation parameter. ` +
        `Got: ${result2}. ` +
        `This confirms the bug: ImageKit transformations are being applied to non-ImageKit URLs.`
      ).toBe(true);
    });

    it('should NOT append ImageKit transformation parameters to videos identified by fileType without extension', () => {
      /**
       * Test Case 3: Video without file extension but identified by fileType
       * 
       * Expected behavior: Result should NOT include 'so-0' OR should include 'ik.imagekit.io'
       * Current (buggy) behavior: Appends transformation parameters to non-ImageKit URL
       */
      const videoFile3: ImageKitFile = {
        fileId: 'test-3',
        name: 'video-file',
        url: 'https://cdn.example.com/media/12345',
        thumbnailUrl: '',
        height: 1080,
        width: 1920,
        fileType: 'video',
      };

      const result3 = getThumbnailUrl(videoFile3);
      
      // This assertion encodes the expected behavior
      expect(
        !result3.includes('so-0') || result3.includes('ik.imagekit.io'),
        `Expected non-ImageKit video (identified by fileType) to NOT include 'so-0' transformation parameter. ` +
        `Got: ${result3}. ` +
        `This confirms the bug: ImageKit transformations are being applied to non-ImageKit URLs.`
      ).toBe(true);
    });

    it('should handle videos with various file extensions correctly', () => {
      /**
       * Test Case 4: Videos with different extensions (.mov, .webm, .avi, .mkv)
       * 
       * Expected behavior: Result should NOT include 'so-0' OR should include 'ik.imagekit.io'
       * Current (buggy) behavior: Appends transformation parameters to all video URLs
       */
      const extensions = ['mov', 'webm', 'avi', 'mkv'];
      
      extensions.forEach(ext => {
        const videoFile: ImageKitFile = {
          fileId: `test-${ext}`,
          name: `video.${ext}`,
          url: `https://cdn.example.com/video.${ext}`,
          thumbnailUrl: '',
          height: 1080,
          width: 1920,
          fileType: 'video',
        };

        const result = getThumbnailUrl(videoFile);
        
        // This assertion encodes the expected behavior
        expect(
          !result.includes('so-0') || result.includes('ik.imagekit.io'),
          `Expected non-ImageKit video with .${ext} extension to NOT include 'so-0' transformation parameter. ` +
          `Got: ${result}. ` +
          `This confirms the bug: ImageKit transformations are being applied to non-ImageKit URLs.`
        ).toBe(true);
      });
    });
  });

  describe('Property-Based Test: Non-ImageKit Video URLs', () => {
    it('should NOT append so-0 to any non-ImageKit video URL', () => {
      /**
       * Property-Based Test: Generate random non-ImageKit video URLs
       * 
       * This test generates many random test cases to ensure the property holds
       * across a wide range of inputs.
       * 
       * Expected: All non-ImageKit video URLs should NOT have 'so-0' appended
       * Current (buggy): All non-ImageKit video URLs will have 'so-0' appended
       */
      fc.assert(
        fc.property(
          // Generate non-ImageKit video URLs
          fc.record({
            domain: fc.constantFrom('cdn.example.com', 'storage.example.com', 'media.example.com', 'videos.example.com'),
            path: fc.array(fc.constantFrom('a', 'b', 'c', '1', '2', '3', '/', '-', '_'), { minLength: 5, maxLength: 30 }).map(arr => arr.join('')),
            extension: fc.constantFrom('mp4', 'mov', 'webm', 'avi', 'mkv'),
            hasQueryParams: fc.boolean(),
            queryParam: fc.array(fc.constantFrom('a', 'b', 'c', '1', '2', '3', '='), { minLength: 5, maxLength: 20 }).map(arr => arr.join('')),
          }),
          ({ domain, path, extension, hasQueryParams, queryParam }) => {
            // Construct URL
            const cleanPath = path.replace(/\/+/g, '/').replace(/^\//, '');
            const url = hasQueryParams
              ? `https://${domain}/${cleanPath}.${extension}?${queryParam}`
              : `https://${domain}/${cleanPath}.${extension}`;

            const videoFile: ImageKitFile = {
              fileId: 'test-pbt',
              name: `video.${extension}`,
              url,
              thumbnailUrl: '',
              height: 1080,
              width: 1920,
              fileType: 'video',
            };

            const result = getThumbnailUrl(videoFile);

            // Property: Non-ImageKit video URLs should NOT include 'so-0'
            // This will FAIL on unfixed code, proving the bug exists
            return !result.includes('so-0') || result.includes('ik.imagekit.io');
          }
        ),
        {
          numRuns: 50, // Run 50 random test cases
          verbose: true, // Show counterexamples when test fails
        }
      );
    });
  });

  describe('Baseline: ImageKit Video URLs (should work correctly even on unfixed code)', () => {
    it('should correctly append ImageKit transformation parameters to ImageKit-hosted videos', () => {
      /**
       * Baseline Test: ImageKit-hosted videos should work correctly
       * 
       * This test should PASS even on unfixed code because the bug only affects
       * non-ImageKit URLs. This confirms our understanding of the bug.
       */
      const imagekitVideo: ImageKitFile = {
        fileId: 'test-imagekit',
        name: 'video.mp4',
        url: 'https://ik.imagekit.io/demo/video.mp4',
        thumbnailUrl: '',
        height: 1080,
        width: 1920,
        fileType: 'video',
      };

      const result = getThumbnailUrl(imagekitVideo);
      
      // For ImageKit URLs, 'so-0' should be present
      expect(result).toContain('so-0');
      expect(result).toContain('ik.imagekit.io');
      expect(result).toContain('tr=w-400,h-400,so-0');
    });
  });
});
