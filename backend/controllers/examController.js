import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const examsPath = path.resolve(__dirname, "../data/exams.json");

export function getExams(_req, res) {
  try {
    const raw = fs.readFileSync(examsPath, "utf-8");
    const exams = JSON.parse(raw);
    res.json(Array.isArray(exams) ? exams : []);
  } catch (error) {
    res.status(500).json({ message: "Failed to load exams", error: error.message });
  }
}
