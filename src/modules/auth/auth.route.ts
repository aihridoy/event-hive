import { Router } from "express";
import { loginSchema, signupSchema } from "./auth.validation";
import { AuthController } from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";

const router = Router();

router.post("/signup", validate(signupSchema), AuthController.signup);
router.post("/login", validate(loginSchema), AuthController.login);

export const AuthRoutes = router;