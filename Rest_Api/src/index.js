import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config/config.js";
import { logMiddleware } from "./middleware/logger.js";
import { validateApiKey, validateApiKeyProduction } from "./middleware/apiKey.js";
import userRoutes from "./routes/userRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import { initializeDatabase } from "./config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

await initializeDatabase();

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logMiddleware);

const apiKeyMiddleware = config.nodeEnv === "production" ? validateApiKeyProduction : validateApiKey;

app.use("/api/users", apiKeyMiddleware, userRoutes);
app.use("/api/movies", apiKeyMiddleware, movieRoutes);

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API",
    version: "1.0.0",
    environment: config.nodeEnv,
    endpoints: {
      users: "/api/users",
      movies: "/api/movies",
    },
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(config.isDevelopment && { stack: err.stack }),
  });
});

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});

export default app;