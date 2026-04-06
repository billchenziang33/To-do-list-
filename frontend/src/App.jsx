import { useEffect, useState } from "react";
import ExamCard from "./components/ExamCard";

/** 开发时走 Vite 代理；生产构建后与接口同域，用相对路径即可 */
const API_BASE = "";

export default function App() {
  const [exams, setExams] = useState([]);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchData() {
    try {
      setLoading(true);
      const [examsRes, todosRes] = await Promise.all([
        fetch(`${API_BASE}/exams`),
        fetch(`${API_BASE}/todos`)
      ]);
      if (!examsRes.ok || !todosRes.ok) throw new Error("Failed to load dashboard data");
      const examsData = await examsRes.json();
      const todosData = await todosRes.json();
      setExams(Array.isArray(examsData) ? examsData : []);
      setTodos(Array.isArray(todosData) ? todosData : []);
      setError("");
    } catch (err) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const addTodo = async (examId, text) => {
    const response = await fetch(`${API_BASE}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examId, text })
    });
    if (!response.ok) throw new Error("Add todo failed");
    const created = await response.json();
    setTodos((prev) => [...prev, created]);
  };

  const updateTodo = async (id, updates) => {
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error("Update todo failed");
    const updated = await response.json();
    setTodos((prev) => prev.map((todo) => (todo.id === id ? updated : todo)));
  };

  const deleteTodo = async (id) => {
    const response = await fetch(`${API_BASE}/todos/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Delete todo failed");
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <header className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-md">
          <h1 className="text-4xl font-semibold md:text-5xl">Exam Todo Dashboard</h1>
        </header>

        {error ? (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-base text-rose-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <p className="text-base text-slate-500">Loading...</p>
        ) : (
          <main className="grid gap-5 lg:grid-cols-2">
            {exams
              .filter((e) => e.id === "GENERAL")
              .map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  todos={todos}
                  layout="general"
                  borderVariant={0}
                  onAddTodo={addTodo}
                  onDeleteTodo={deleteTodo}
                  onToggleTodo={(todo) => updateTodo(todo.id, { completed: !todo.completed })}
                  onEditTodo={(todo, updates) => updateTodo(todo.id, updates)}
                />
              ))}
            {exams
              .filter((e) => e.id !== "GENERAL")
              .map((exam, index) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  todos={todos}
                  borderVariant={index + 1}
                  onAddTodo={addTodo}
                  onDeleteTodo={deleteTodo}
                  onToggleTodo={(todo) => updateTodo(todo.id, { completed: !todo.completed })}
                  onEditTodo={(todo, updates) => updateTodo(todo.id, updates)}
                />
              ))}
          </main>
        )}
      </div>
    </div>
  );
}
