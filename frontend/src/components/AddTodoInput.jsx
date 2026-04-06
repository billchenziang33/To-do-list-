import { useState } from "react";

export default function AddTodoInput({ onAdd }) {
  const [text, setText] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await onAdd(text.trim());
    setText("");
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a task..."
        className="min-w-0 flex-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-lg"
      />
      <button
        type="submit"
        className="rounded-lg bg-slate-900 px-3 py-1.5 text-base font-medium text-white hover:bg-slate-700"
      >
        Add
      </button>
    </form>
  );
}
