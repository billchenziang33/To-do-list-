import AddTodoInput from "./AddTodoInput";
import TodoItem from "./TodoItem";

const borderStyles = [
  "border-indigo-200",
  "border-emerald-200",
  "border-amber-200",
  "border-rose-200",
  "border-sky-200",
  "border-violet-200"
];

export default function ExamCard({
  exam,
  todos,
  borderVariant,
  layout = "default",
  onAddTodo,
  onDeleteTodo,
  onToggleTodo,
  onEditTodo
}) {
  const borderClass = borderStyles[borderVariant % borderStyles.length];
  const examTodos = todos.filter((todo) => todo.examId === exam.id);
  const isGeneral = layout === "general";

  return (
    <section
      className={`rounded-xl border-2 ${borderClass} bg-white p-4 shadow-md ${
        isGeneral ? "lg:col-span-2" : ""
      }`}
    >
      <div className="mb-4">
        {isGeneral ? (
          <>
            <h2 className="text-2xl font-semibold">General</h2>
            <p className="text-base text-slate-500">{exam.location}</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold">{exam.id}</h2>
            <p className="text-base text-slate-500">{exam.date}</p>
            <p className="text-base text-slate-500">{exam.time}</p>
            <p className="text-base text-slate-500">{exam.location}</p>
          </>
        )}
      </div>

      <ul
        className={
          isGeneral
            ? "mb-3 grid grid-cols-2 gap-x-3 gap-y-2"
            : "mb-3 space-y-2"
        }
      >
        {examTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            compact={isGeneral}
            onDelete={() => onDeleteTodo(todo.id)}
            onToggle={() => onToggleTodo(todo)}
            onEdit={(updates) => onEditTodo(todo, updates)}
          />
        ))}
      </ul>

      <AddTodoInput onAdd={(text) => onAddTodo(exam.id, text)} />
    </section>
  );
}
