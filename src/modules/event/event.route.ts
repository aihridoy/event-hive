import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { EventController } from "./event.controller";
import { createEventSchema, updateEventSchema } from "./event.validation";

const router = Router();

router.post("/", auth("organizer"), validate(createEventSchema), EventController.createEvent);
router.get("/", EventController.getAllEvents);
router.get("/:id", EventController.getEventById);
router.patch("/:id", auth("organizer"), validate(updateEventSchema), EventController.updateEvent);
router.delete("/:id", auth("organizer"), EventController.deleteEvent);

export const EventRoutes = router;