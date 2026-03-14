import express from "express";
import path from "node:path";
import { createServer as createViteServer } from "vite";
import ImageKit from "imagekit";
import { config } from "./src/config.js";
import {
  handleUploadRequest,
  UploadRequestError,
} from "./src/server/uploadApi.ts";

// Initialize ImageKit with credentials from config file
const imagekit = new ImageKit({
  publicKey: config.imagekit.publicKey,
  privateKey: config.imagekit.privateKey,
  urlEndpoint: config.imagekit.urlEndpoint,
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  const createWebRequest = (req: express.Request) => {
    const requestUrl = new URL(
      req.originalUrl,
      `http://${req.get("host") ?? `localhost:${PORT}`}`,
    );

    return new Request(requestUrl, {
      method: req.method,
      headers: req.headers as HeadersInit,
      body: req as unknown as BodyInit,
      duplex: "half",
    } as RequestInit);
  };

  // API Route to fetch images
  app.get("/api/photos", async (req, res) => {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const limit = parseInt(req.query.limit as string) || 20;
      // Default to DESC_NAME to sort by filename (newest date first if named by date)
      // or DESC_CREATED for newest uploaded. User requested checking filename.
      const sort = (req.query.sort as string) || "DESC_NAME";

      const result: any = await imagekit.listFiles({
        limit: limit,
        skip: skip,
        sort: sort,
      });

      // Return total count along with files
      res.json({
        files: result,
        totalCount: result.totalCount || result.length,
      });
    } catch (error) {
      console.error("Error fetching images from ImageKit:", error);
      res.status(500).json({ error: "Failed to fetch images" });
    }
  });

  app.post("/api/uploads", async (req, res) => {
    try {
      const result = await handleUploadRequest({
        request: createWebRequest(req),
        imagekit,
      });

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof UploadRequestError) {
        res.status(error.status).json({ error: error.message });
        return;
      }

      console.error("Error uploading files to ImageKit:", error);
      res.status(500).json({ error: "Failed to upload files" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving (if built)
    app.use(express.static("dist"));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) {
        next();
        return;
      }

      res.sendFile(path.resolve("dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
