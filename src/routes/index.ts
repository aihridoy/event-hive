import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";

export const apiRouter = Router();

apiRouter.use("/auth", AuthRoutes);