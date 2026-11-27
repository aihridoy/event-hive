import { AppError } from "./AppError";

const MAX_ID = 2147483647;

export const parseId = (value: unknown, name: string): number => {
    if (typeof value !== "string" || !/^\d+$/.test(value)) {
        throw new AppError(400, `Invalid ${name} id`);
    }

    const id = Number(value);

    if (id < 1 || id > MAX_ID) {
        throw new AppError(400, `Invalid ${name} id`);
    }

    return id;
};