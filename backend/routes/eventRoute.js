import { Router } from "express";
import { getEvents, getEventById, createEvent, updateEvent, deleteEvent } from "../controllers/eventController.js";

const router = Router();

router.get("/", getEvents);
router.get("/:id/show", getEventById);
router.post("/", createEvent);
router.put("/:id/update", updateEvent);
router.delete("/:id/delete", deleteEvent);

export default router;