import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { appendRow, deleteRow, readCSV, updateRow } from "../utils/csvStore.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const examsPath = path.resolve(__dirname, "../data/exams.json");

function readExams() {
  const raw = fs.readFileSync(examsPath, "utf-8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

export function getTodos(_req, res) {
  try {
    const todos = readCSV();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Failed to read todos", error: error.message });
  }
}

export function createTodo(req, res) {
  try {
    const { examId, text } = req.body;
    if (!examId || !text?.trim()) {
      res.status(400).json({ message: "examId and text are required" });
      return;
    }

    const exams = readExams();
    const exam = exams.find((item) => item.id === examId);
    if (!exam) {
      res.status(400).json({ message: "Invalid examId" });
      return;
    }

    const todo = {
      id: uuidv4(),
      examId: exam.id,
      examDate: exam.date,
      examTime: exam.time,
      examLocation: exam.location,
      text: text.trim(),
      completed: false
    };

    appendRow(todo);
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Failed to create todo", error: error.message });
  }
}

export function updateTodoById(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = updateRow(id, updates);

    if (!updated) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update todo", error: error.message });
  }
}

export function deleteTodoById(req, res) {
  try {
    const { id } = req.params;
    const deleted = deleteRow(id);

    if (!deleted) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete todo", error: error.message });
  }
}
