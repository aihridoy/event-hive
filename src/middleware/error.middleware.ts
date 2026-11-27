import { NextFunction, Request, Response } from "express";
import { AppError, ErrorDetail } from "../utils/AppError";
import { DatabaseError } from "pg";

export const errorHandler = (error: unknown, _req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) {
        next(error);
        return;
    }

    let statusCode = 500;
    let message = "Internal Server Error";
    let errors: ErrorDetail[] | undefined;

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
        errors = error.errors;
    } else if (error instanceof SyntaxError && "body" in error) {
        statusCode = 400;
        message = "Invalid JSON in request body";
    } else if (error instanceof DatabaseError && error.code === "23505") {
        statusCode = 409;
        message = "Resource already exists";
    } else if (error instanceof DatabaseError && error.code === "23514") {
        statusCode = 400;
        message = "Value violates a database rule";
    } else {
        console.error(error);
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        ...errors && { errors }
    })
};

