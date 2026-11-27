import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";

const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await AuthService.signup(req.body);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "User registered successfully",
            data: user
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error?.message,
            data: error
        });
    }
};

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await AuthService.login(req.body);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error?.message,
            data: error,
        });
    }
};

export const AuthController = {
    signup,
    login,
};