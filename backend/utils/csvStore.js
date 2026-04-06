import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../data");
const csvPath = path.resolve(dataDir, "todos.csv");
const header = "id,examId,examDate,examTime,examLocation,text,completed";

function ensureCSVFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(csvPath)) {
    fs.writeFileSync(csvPath, `${header}\n`, "utf-8");
  }
}

function parseCSVLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function escapeCSVValue(value) {
  const stringValue = String(value ?? "");
  const escaped = stringValue.replace(/"/g, '""');
  if (/[",\n]/.test(escaped)) {
    return `"${escaped}"`;
  }
  return escaped;
}

function toTodo(line) {
  const [id, examId, examDate, examTime, examLocation, text, completed] = parseCSVLine(line);
  return {
    id: id ?? "",
    examId: examId ?? "",
    examDate: examDate ?? "",
    examTime: examTime ?? "",
    examLocation: examLocation ?? "",
    text: text ?? "",
    completed: String(completed).toLowerCase() === "true"
  };
}

function toLine(todo) {
  return [
    escapeCSVValue(todo.id),
    escapeCSVValue(todo.examId),
    escapeCSVValue(todo.examDate),
    escapeCSVValue(todo.examTime),
    escapeCSVValue(todo.examLocation),
    escapeCSVValue(todo.text),
    escapeCSVValue(Boolean(todo.completed))
  ].join(",");
}

export function readCSV() {
  ensureCSVFile();
  const raw = fs.readFileSync(csvPath, "utf-8").trim();

  if (!raw) return [];

  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];

  const body = lines[0] === header ? lines.slice(1) : lines;
  return body.filter(Boolean).map(toTodo);
}

export function writeCSV(todos) {
  ensureCSVFile();
  const lines = [header, ...todos.map(toLine)];
  fs.writeFileSync(csvPath, `${lines.join("\n")}\n`, "utf-8");
}

export function appendRow(todo) {
  const todos = readCSV();
  todos.push({
    id: todo.id,
    examId: todo.examId,
    examDate: todo.examDate,
    examTime: todo.examTime,
    examLocation: todo.examLocation,
    text: todo.text,
    completed: Boolean(todo.completed)
  });
  writeCSV(todos);
}

export function updateRow(id, updates) {
  const todos = readCSV();
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) return null;

  const current = todos[index];
  const next = {
    ...current,
    text: updates.text !== undefined ? String(updates.text).trim() : current.text,
    completed: updates.completed !== undefined ? Boolean(updates.completed) : current.completed
  };

  todos[index] = next;
  writeCSV(todos);
  return next;
}

export function deleteRow(id) {
  const todos = readCSV();
  const exists = todos.some((todo) => todo.id === id);
  if (!exists) return false;

  const next = todos.filter((todo) => todo.id !== id);
  writeCSV(next);
  return true;
}
