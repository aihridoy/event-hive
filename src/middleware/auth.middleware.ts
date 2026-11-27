import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { Role, TokenPayload } from "../modules/auth/auth.interface";
import { AppError } from "../utils/AppError";

export const auth = (...roles: Role[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AppError(401, "Unauthorized: token is missing");
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.slice(7)
            : authHeader;

        let decoded: TokenPayload;

        try {
            decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
        } catch {
            throw new AppError(401, "Unauthorized: invalid or expired token");
        }

        if (roles.length && !roles.includes(decoded.role)) {
            throw new AppError(403, "Forbidden: you do not have permission to perform this action");
        }

        req.user = { id: decoded.id, role: decoded.role };
        next();
    };
};