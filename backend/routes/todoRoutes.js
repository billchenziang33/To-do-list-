import { Router } from "express";
import { createTodo, deleteTodoById, getTodos, updateTodoById } from "../controllers/todoController.js";

const router = Router();

router.get("/", getTodos);
router.post("/", createTodo);
router.put("/:id", updateTodoById);
router.delete("/:id", deleteTodoById);

export default router;
