
import { Router } from "express";
import { eventController } from "./event.controller.js";
import authenticateToken from "../../middleware/auth.js";

const router = Router();

router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEvent);
router.post("/", authenticateToken, eventController.createEvent);
router.put("/:id", authenticateToken, eventController.updateEvent);

export default router;
