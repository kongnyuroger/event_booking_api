
import { Router } from "express";
import { eventController } from "./event.controller.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = Router();

router.get("/", eventController.listEvents);
router.get("/:id", eventController.getEvent);
router.post("/", authMiddleware, eventController.createEvent);
router.put("/:id", authMiddleware, eventController.updateEvent);

export default router;
