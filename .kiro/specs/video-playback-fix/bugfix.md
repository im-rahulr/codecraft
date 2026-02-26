# Bugfix Requirements Document

## Introduction

This document addresses video playback issues in the photo/video gallery application. Videos are not displaying thumbnails correctly in the grid view and may not open properly in the lightbox when clicked. The application uses React/TypeScript with ImageKit for media transformations, and videos should display thumbnails in PhotoGrid.tsx and play in Lightbox.tsx when selected.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a video file is hosted outside of ImageKit (non-ImageKit URL) THEN the system fails to generate a valid thumbnail because the ImageKit transformation parameters (so-0) are appended to non-ImageKit URLs

1.2 WHEN a video thumbnail generation fails THEN the system shows a generic placeholder but the video may still not be playable in the lightbox

1.3 WHEN a video is opened in the lightbox THEN the system may fail to play the video if the URL or format is not properly handled

### Expected Behavior (Correct)

2.1 WHEN a video file is hosted outside of ImageKit THEN the system SHALL use the original video URL as the thumbnail source or provide an appropriate fallback without appending invalid transformation parameters

2.2 WHEN a video is opened in the lightbox THEN the system SHALL display the video player with the correct video URL and enable playback with controls

2.3 WHEN a video thumbnail is generated for an ImageKit-hosted video THEN the system SHALL correctly apply the transformation parameters to extract a frame at 0 seconds

### Unchanged Behavior (Regression Prevention)

3.1 WHEN an image (non-video) is clicked in the grid THEN the system SHALL CONTINUE TO display the image correctly in the lightbox

3.2 WHEN a video thumbnail fails to load THEN the system SHALL CONTINUE TO show the placeholder fallback image

3.3 WHEN navigating between items in the lightbox using next/prev buttons THEN the system SHALL CONTINUE TO navigate correctly through the photos array

3.4 WHEN ImageKit transformations are applied to regular images THEN the system SHALL CONTINUE TO resize them appropriately for grid display
