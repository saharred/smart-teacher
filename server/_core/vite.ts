import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Try multiple possible paths for the built files
  const possiblePaths = [
    path.resolve(import.meta.dirname, "../..", "dist"),
    path.resolve(import.meta.dirname, "../..", "dist", "public"),
    path.resolve(import.meta.dirname, "../..", "client", "dist"),
    path.resolve(import.meta.dirname, "public"),
  ];
  
  let distPath = possiblePaths[0];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      distPath = p;
      console.log(`Using dist path: ${distPath}`);
      break;
    }
  }

  if (!fs.existsSync(distPath)) {
    console.warn(
      `Could not find the build directory at any of: ${possiblePaths.join(", ")}`
    );
    // Serve a fallback HTML page
    app.use("*", (_req, res) => {
      res.status(200).set({ "Content-Type": "text/html" }).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Smart Teacher</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="bg-gradient-to-br from-[#8A1538] to-[#C9A646]">
            <div class="min-h-screen flex items-center justify-center">
              <div class="text-center text-white">
                <h1 class="text-4xl font-bold mb-4">Smart Teacher</h1>
                <p class="text-xl mb-4">Application is loading...</p>
                <p class="text-sm opacity-75">Please wait while we initialize the application.</p>
              </div>
            </div>
          </body>
        </html>
      `);
    });
    return;
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("index.html not found");
    }
  });
}
