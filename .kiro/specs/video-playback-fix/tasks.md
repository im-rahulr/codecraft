# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Fault Condition** - Non-ImageKit Video Thumbnail Generation
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases - non-ImageKit video URLs with various formats
  - Test that getThumbnailUrl for non-ImageKit videos (e.g., `https://cdn.example.com/video.mp4`) does NOT append invalid ImageKit transformation parameters (`so-0`)
  - Test cases: non-ImageKit video URL, non-ImageKit video with query params, video without extension but with fileType='video'
  - The test assertions should verify: result does NOT include 'so-0' OR result includes 'ik.imagekit.io', and result is a valid URL
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found (e.g., "getThumbnailUrl appends ?tr=w-400,h-400,so-0 to https://cdn.example.com/video.mp4")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 2.1, 2.3_

- [-] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Image and ImageKit Video Behavior
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (images and ImageKit-hosted videos)
  - Observe: Regular images (JPEG, PNG) generate thumbnails with `tr=w-400,h-400` on unfixed code
  - Observe: ImageKit-hosted videos generate thumbnails with `tr=w-400,h-400,so-0` on unfixed code
  - Observe: Placeholder fallback displays when thumbnails fail to load on unfixed code
  - Write property-based tests capturing observed behavior patterns:
    - For all regular images, getThumbnailUrl applies image transformations (tr=w-400,h-400)
    - For all ImageKit-hosted videos (URL contains 'ik.imagekit.io'), getThumbnailUrl applies video transformations (so-0)
    - For all files with thumbnailUrl field provided, that URL is used
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 3. Fix for video playback and thumbnail generation

  - [~] 3.1 Implement the fix in PhotoGrid.tsx
    - Modify getThumbnailUrl function to detect ImageKit URLs before applying video transformations
    - Add check: if URL contains 'ik.imagekit.io', apply transformation parameters; otherwise use original URL
    - Update video handling block (lines 169-188) to conditionally apply 'so-0' parameter only for ImageKit-hosted videos
    - For non-ImageKit videos, return the original URL without transformation parameters
    - Preserve existing logic for images and thumbnailUrl field
    - _Bug_Condition: isBugCondition(input) where (input.fileType == 'video' OR input.name matches video extension) AND NOT input.url.includes('ik.imagekit.io') AND getThumbnailUrl(input).includes('so-0')_
    - _Expected_Behavior: For non-ImageKit videos, result does NOT include 'so-0' OR result includes 'ik.imagekit.io'; result is a valid URL without invalid transformation parameters_
    - _Preservation: Image thumbnail generation, ImageKit video transformations, fallback placeholders, and lightbox navigation remain unchanged_
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4_

  - [~] 3.2 Verify Lightbox.tsx video playback handling
    - Review Lightbox component video rendering (lines 82-88)
    - Confirm video element uses photo.url directly for both ImageKit and non-ImageKit videos
    - Verify video controls are enabled and playback works correctly
    - Add error handling if needed for unsupported video formats
    - _Requirements: 1.3, 2.2_

  - [~] 3.3 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Non-ImageKit Video Thumbnail Generation
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.3_

  - [~] 3.4 Verify preservation tests still pass
    - **Property 2: Preservation** - Image and ImageKit Video Behavior
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [~] 4. Checkpoint - Ensure all tests pass
  - Run all unit tests and property-based tests
  - Verify no regressions in image display, lightbox navigation, or fallback behavior
  - Test full integration flow: load photos, display grid with video thumbnails, open lightbox, play videos
  - Ensure all tests pass, ask the user if questions arise
