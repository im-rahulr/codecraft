# Netlify Deployment Guide

## Quick Deploy

1. Install Netlify CLI (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. Set environment variables in Netlify:
   - `GEMINI_API_KEY`
   - `IMAGEKIT_PUBLIC_KEY`
   - `IMAGEKIT_PRIVATE_KEY`
   - `IMAGEKIT_URL_ENDPOINT`

3. Deploy:
   ```bash
   npm run netlify:deploy
   ```

## Optimizations Applied

- Serverless function for `/api/photos` endpoint
- Code splitting for vendor, motion, and icon libraries
- Cache headers for static assets (1 year)
- Security headers (X-Frame-Options, CSP, etc.)
- SPA routing with redirects
- Optimized build output

## Local Development with Netlify

```bash
npm run netlify:dev
```

This runs the app with Netlify's local development environment, including serverless functions.
