export interface ErrorDetail {
    field: string;
    message: string;
};

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly errors?: ErrorDetail[];

    constructor(statusCode: number, message: string, errors?: ErrorDetail[]) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.errors = errors;
    }
};



