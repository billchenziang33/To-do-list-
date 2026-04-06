import { Router } from "express";
import { getExams } from "../controllers/examController.js";

const router = Router();

router.get("/", getExams);

export default router;
