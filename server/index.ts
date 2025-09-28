// server/index.ts
import express, { type Request, type Response, type NextFunction } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { registerRoutes } from "./routes";

// dacă ai utilitare proprii pentru Vite, poți păstra importul lor
// import { setupVite, serveStatic, log } from "./vite";
const log = (msg: string) => console.log(msg);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// logger simplu pentru /api/*
app.use((req, res, next) => {
  const start = Date.now();
  let bodyPreview: unknown;
  const origJson = res.json.bind(res);
  (res as any).json = (b: unknown) => {
    bodyPreview = b;
    return origJson(b);
  };
  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      const ms = Date.now() - start;
      let line = `${req.method} ${req.path} ${res.statusCode} in ${ms}ms`;
      if (bodyPreview) {
        try {
          const s = JSON.stringify(bodyPreview);
          line += ` :: ${s.length > 80 ? s.slice(0, 79) + "…" : s}`;
        } catch {}
      }
      log(line);
    }
  });
  next();
});

(async () => {
  const server = await registerRoutes(app);

  // error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    if (app.get("env") === "development") console.error(err);
  });

  // PRODUCTION: servește frontend-ul din dist/public
  const publicDir = path.resolve(__dirname, "../public");
  app.use(express.static(publicDir));
  app.get("*", (_req, res) => res.sendFile(path.join(publicDir, "index.html")));

  const port = parseInt(process.env.PORT || "5000", 10);
  const host = "0.0.0.0";
  server.listen({ port, host, reusePort: true }, () => {
    log(`serving on port ${port}`);
  });
})();
