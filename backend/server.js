import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import todoRoutes from "./routes/todoRoutes.js";
import examRoutes from "./routes/examRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const distPath = path.resolve(__dirname, "../frontend/dist");

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/exams", examRoutes);
app.use("/todos", todoRoutes);

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  const hasUi = fs.existsSync(distPath);
  console.log(
    hasUi
      ? `Server running at http://localhost:${PORT} (API + built frontend)`
      : `API running at http://localhost:${PORT} (run "npm run build" in frontend for the web UI)`
  );
});

// version 1
