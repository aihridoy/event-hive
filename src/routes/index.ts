import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { EventRoutes } from "../modules/event/event.route";

export const apiRouter = Router();

apiRouter.use("/auth", AuthRoutes);
apiRouter.use("/events", EventRoutes);