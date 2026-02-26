# Video Playback Fix - Bugfix Design

## Overview

This bugfix addresses video playback issues in the photo/video gallery application where videos hosted outside of ImageKit fail to display thumbnails correctly and may not play properly in the lightbox. The root cause is that ImageKit transformation parameters (specifically `so-0` for video frame extraction) are being appended to non-ImageKit URLs, resulting in invalid thumbnail URLs. The fix will detect whether a video is hosted on ImageKit before applying transformations, and ensure proper video playback in the lightbox component.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when video files are hosted outside of ImageKit and the system attempts to apply ImageKit transformation parameters
- **Property (P)**: The desired behavior - videos should display valid thumbnails (either ImageKit-transformed or original URL) and play correctly in the lightbox
- **Preservation**: Existing image display, navigation, and fallback behaviors that must remain unchanged by the fix
- **getThumbnailUrl**: The function in `src/components/PhotoGrid.tsx` that generates thumbnail URLs for grid display
- **ImageKit URL**: A URL containing `ik.imagekit.io` that supports ImageKit transformation parameters
- **Transformation Parameters**: Query parameters like `tr=w-400,h-400,so-0` that ImageKit uses to resize images or extract video frames

## Bug Details

### Fault Condition

The bug manifests when a video file is hosted outside of ImageKit (e.g., on a different CDN or storage service). The `getThumbnailUrl` function unconditionally appends ImageKit transformation parameters (`so-0` for frame extraction at 0 seconds) to all video URLs, regardless of whether they are hosted on ImageKit. This results in invalid URLs that fail to load thumbnails.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type ImageKitFile
  OUTPUT: boolean
  
  RETURN (input.fileType == 'video' OR input.name MATCHES /\.(mp4|mov|webm|avi|mkv)$/i)
         AND NOT input.url.includes('ik.imagekit.io')
         AND getThumbnailUrl(input).includes('so-0')
END FUNCTION
```

### Examples

- **Non-ImageKit video URL**: `https://cdn.example.com/video.mp4`
  - Current behavior: Generates `https://cdn.example.com/video.mp4?tr=w-400,h-400,so-0` (invalid - cdn.example.com doesn't support ImageKit transformations)
  - Expected behavior: Uses original URL `https://cdn.example.com/video.mp4` or a valid fallback

- **ImageKit video URL**: `https://ik.imagekit.io/demo/video.mp4`
  - Current behavior: Generates `https://ik.imagekit.io/demo/video.mp4?tr=w-400,h-400,so-0` (valid)
  - Expected behavior: Same (no change needed)

- **Video with existing query params**: `https://storage.example.com/video.mp4?token=abc123`
  - Current behavior: Generates `https://storage.example.com/video.mp4?token=abc123&tr=w-400,h-400,so-0` (invalid)
  - Expected behavior: Uses original URL with existing params intact

- **Edge case - Video without extension**: A video file identified by `fileType === 'video'` but without a video file extension
  - Expected behavior: Should still be handled correctly based on fileType

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Image (non-video) thumbnail generation and display must continue to work exactly as before
- ImageKit transformations for regular images must continue to resize them appropriately for grid display
- Fallback placeholder images must continue to display when thumbnails fail to load
- Lightbox navigation (next/prev buttons, keyboard arrows) must remain unchanged
- Lightbox display for images must remain unchanged
- Grid layout and hover effects must remain unchanged

**Scope:**
All inputs that do NOT involve non-ImageKit video URLs should be completely unaffected by this fix. This includes:
- Regular image files (JPEG, PNG, GIF, etc.)
- ImageKit-hosted videos (these should continue using transformations)
- Mouse interactions and UI behaviors
- Navigation and filtering functionality

## Hypothesized Root Cause

Based on the code analysis, the root causes are:

1. **Unconditional Transformation Application**: The `getThumbnailUrl` function in `PhotoGrid.tsx` (lines 169-188) applies ImageKit transformation parameters to all video URLs without checking if the URL is hosted on ImageKit
   - The function checks `if (photo.fileType === 'video' || photo.name.match(/\.(mp4|mov|webm|avi|mkv)$/i))` and immediately appends `?tr=w-400,h-400,so-0`
   - No validation that the URL contains `ik.imagekit.io` before applying transformations

2. **Missing URL Validation**: There is no check to determine whether a video URL supports ImageKit transformations before appending them
   - Non-ImageKit CDNs and storage services will ignore or reject these parameters
   - This results in broken thumbnail URLs

3. **Lightbox Video Playback**: The Lightbox component (lines 82-88) uses `photo.url` directly for video playback, which should work correctly, but if the URL itself is malformed or the video format is not supported by the browser, playback will fail
   - Current implementation appears correct for playback, but may need verification

4. **No Fallback Strategy**: When ImageKit transformations cannot be applied, there is no fallback to use the original video URL as the thumbnail source

## Correctness Properties

Property 1: Fault Condition - Non-ImageKit Video Thumbnail Generation

_For any_ video file where the URL does not contain 'ik.imagekit.io', the fixed getThumbnailUrl function SHALL return either the original video URL (without ImageKit transformation parameters) or use the provided thumbnailUrl field, ensuring a valid thumbnail source that does not include invalid transformation parameters.

**Validates: Requirements 2.1, 2.3**

Property 2: Preservation - Image and ImageKit Video Behavior

_For any_ file that is NOT a non-ImageKit video (i.e., regular images or ImageKit-hosted videos), the fixed getThumbnailUrl function SHALL produce exactly the same thumbnail URL as the original function, preserving all existing transformation logic and display behavior.

**Validates: Requirements 3.1, 3.2, 3.4**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `src/components/PhotoGrid.tsx`

**Function**: `getThumbnailUrl`

**Specific Changes**:
1. **Add ImageKit URL Detection**: Before applying video transformation parameters, check if the URL contains `ik.imagekit.io`
   - Only apply `so-0` transformation to ImageKit-hosted videos
   - For non-ImageKit videos, use the original URL or thumbnailUrl field

2. **Preserve Existing thumbnailUrl**: If the API provides a `thumbnailUrl` field, prioritize it over generating transformations
   - This is already implemented but should be verified to work correctly

3. **Update Video Transformation Logic**: Modify the video handling block (lines 169-188) to:
   ```typescript
   if (photo.fileType === 'video' || photo.name.match(/\.(mp4|mov|webm|avi|mkv)$/i)) {
     // Only apply ImageKit transformations if the URL is hosted on ImageKit
     if (photo.url.includes('ik.imagekit.io')) {
       const separator = photo.url.includes('?') ? '&' : '?';
       return `${photo.url}${separator}tr=w-400,h-400,so-0`;
     }
     // For non-ImageKit videos, return the original URL
     return photo.url;
   }
   ```

4. **Verify Lightbox Video Playback**: Ensure the Lightbox component correctly handles video URLs
   - Current implementation uses `photo.url` directly, which should work
   - May need to add error handling or format validation

5. **Test Fallback Behavior**: Verify that the existing `onError` handler in PhotoGrid (line 253) correctly displays the placeholder when thumbnails fail to load

**File**: `src/components/Lightbox.tsx`

**No changes expected**: The Lightbox component already uses `photo.url` directly for video playback, which should work correctly for both ImageKit and non-ImageKit URLs. However, we should verify this during testing.

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Fault Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Create test cases with non-ImageKit video URLs and verify that the current `getThumbnailUrl` function generates invalid URLs with ImageKit transformation parameters. Run these tests on the UNFIXED code to observe failures and confirm the root cause.

**Test Cases**:
1. **Non-ImageKit Video URL Test**: Pass a video file with URL `https://cdn.example.com/video.mp4` (will fail on unfixed code - generates invalid URL with `so-0`)
2. **Non-ImageKit Video with Query Params**: Pass a video with URL `https://storage.example.com/video.mp4?token=abc` (will fail on unfixed code - appends `&tr=...`)
3. **Video Without Extension**: Pass a video identified by `fileType === 'video'` but without file extension (will fail on unfixed code)
4. **ImageKit Video URL Test**: Pass a video with URL `https://ik.imagekit.io/demo/video.mp4` (should pass on unfixed code - this is the working case)

**Expected Counterexamples**:
- Non-ImageKit video URLs will have `?tr=w-400,h-400,so-0` or `&tr=w-400,h-400,so-0` appended
- Possible causes: missing URL validation, unconditional transformation application

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := getThumbnailUrl_fixed(input)
  ASSERT NOT result.includes('so-0') OR result.includes('ik.imagekit.io')
  ASSERT result is a valid URL
  ASSERT result does not have invalid transformation parameters
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT getThumbnailUrl_original(input) = getThumbnailUrl_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for images and ImageKit videos, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Image Thumbnail Preservation**: Observe that regular images (JPEG, PNG) generate correct thumbnails on unfixed code, then verify this continues after fix
2. **ImageKit Video Preservation**: Observe that ImageKit-hosted videos generate thumbnails with `so-0` on unfixed code, then verify this continues after fix
3. **Image Transformation Preservation**: Observe that ImageKit transformations for images (`tr=w-400`) work on unfixed code, then verify this continues after fix
4. **Fallback Placeholder Preservation**: Observe that placeholder images display when thumbnails fail on unfixed code, then verify this continues after fix

### Unit Tests

- Test `getThumbnailUrl` with non-ImageKit video URLs (should return original URL)
- Test `getThumbnailUrl` with ImageKit video URLs (should apply transformations)
- Test `getThumbnailUrl` with regular images (should apply image transformations)
- Test `getThumbnailUrl` with provided `thumbnailUrl` field (should use it)
- Test edge cases: videos without extensions, URLs with existing query params, empty URLs

### Property-Based Tests

- Generate random video URLs (both ImageKit and non-ImageKit) and verify correct thumbnail generation
- Generate random image files and verify preservation of existing thumbnail behavior
- Generate random file types and verify the function handles all cases without errors
- Test that all ImageKit URLs continue to receive transformations while non-ImageKit URLs do not

### Integration Tests

- Test full flow: load photos from API, display grid with video thumbnails, click video to open lightbox
- Test video playback in lightbox for both ImageKit and non-ImageKit videos
- Test navigation between videos and images in lightbox
- Test fallback behavior when thumbnails fail to load
- Test filtering to "Videos" view and verify all videos display correctly
