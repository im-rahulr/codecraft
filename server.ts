import express from "express";
import { createServer as createViteServer } from "vite";
import ImageKit from "imagekit";
import fs from "fs";
import path from "path";
import { config } from "./src/config.js";

// Initialize ImageKit with credentials from config file
const imagekit = new ImageKit({
    publicKey: config.imagekit.publicKey,
    privateKey: config.imagekit.privateKey,
    urlEndpoint: config.imagekit.urlEndpoint
});

async function startServer() {
  const app = express();
  const PORT = 3000;

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
        totalCount: result.totalCount || result.length
      });
    } catch (error) {
      console.error("Error fetching images from ImageKit:", error);
      res.status(500).json({ error: "Failed to fetch images" });
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
    app.use(express.static('dist'));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
