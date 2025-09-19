import express, { type Request, type Response as ExpressResponse, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

async function initializeApp() {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: ExpressResponse, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // For Cloudflare Workers, we don't need to listen on a port
  if (typeof globalThis !== 'undefined' && 'DB' in globalThis) {
    // Cloudflare Workers environment
    return app;
  } else {
    // Local development environment
    const port = parseInt(process.env.PORT || '5000', 10);
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });
    return app;
  }
}

// Cloudflare Workers export
export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const app = await initializeApp();
    
    // Convert Cloudflare Workers Request to Express-compatible request
    const url = new URL(request.url);
    const pathname = url.pathname;
    const search = url.search;
    
    // Simple fetch handler for now
    return new Response('KPOP Debut Analyzer is running!', {
      headers: { 'Content-Type': 'text/plain' },
    });
  },
};

// For local development
if (typeof globalThis === 'undefined' || !('DB' in globalThis)) {
  initializeApp();
}
