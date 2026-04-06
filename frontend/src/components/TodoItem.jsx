import { useEffect, useState } from "react";

export default function TodoItem({ todo, onDelete, onToggle, onEdit, compact = false }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);

  useEffect(() => {
    setDraft(todo.text);
  }, [todo.text, todo.id]);

  const save = async () => {
    const cleaned = draft.trim();
    if (!cleaned) return;
    await onEdit({ text: cleaned });
    setEditing(false);
  };

  return (
    <li
      className={`flex min-w-0 items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50 ${
        compact ? "px-1.5 py-1" : "px-2 py-1.5"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label="Toggle complete"
        className={`${compact ? "h-4 w-4" : "h-5 w-5"} shrink-0 rounded border ${
          todo.completed ? "border-emerald-500 bg-emerald-500" : "border-slate-300 bg-white"
        }`}
      >
        {todo.completed ? <span className="text-sm leading-none text-white">✓</span> : null}
      </button>

      {editing ? (
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") {
              setDraft(todo.text);
              setEditing(false);
            }
          }}
          autoFocus
          className={`min-w-0 flex-1 rounded border border-slate-300 px-2 py-1 ${
            compact ? "text-base" : "text-lg"
          }`}
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className={`min-w-0 flex-1 text-left ${compact ? "text-base" : "text-lg"} ${
            todo.completed ? "text-slate-400 line-through" : "text-slate-700"
          }`}
        >
          {todo.text}
        </button>
      )}

      <button
        type="button"
        onClick={onDelete}
        className={`shrink-0 text-slate-400 hover:text-rose-500 ${compact ? "text-sm" : "text-base"}`}
      >
        Del
      </button>
    </li>
  );
}
