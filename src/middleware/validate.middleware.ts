import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";
import { AppError } from "../utils/AppError";

type RequestPart = "body" | "params" | "query";

export const validate =
    (schema: z.ZodType, part: RequestPart = "body") =>
        (req: Request, _res: Response, next: NextFunction): void => {
            const result = schema.safeParse(req[part]);

            if (!result.success) {
                const errors = result.error.issues.map((issue) => ({
                    field: issue.path.join(".") || part,
                    message: issue.message,
                }));
                throw new AppError(400, "Validation Error", errors);
            }

            if (part === "body") {
                req.body = result.data;
            }

            next();
        };