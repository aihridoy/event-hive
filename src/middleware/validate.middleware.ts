import { z } from "zod";
import { Request, Response, NextFunction } from 'express';
import { AppError } from "../utils/AppError";

export const validate = (schema: z.ZodType) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.issues.map((issue) => {
                return {
                    field: issue.path.join(".") || "body",
                    message: issue.message,
                };
            });

            throw new AppError(400, "Validation Error", errors);
        }

        req.body = result.data;
        next();
    }
}