import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";

const signup = async (req: Request, res: Response): Promise<void> => {
    const user = await AuthService.signup(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User registered successfully",
        data: user
    });
};

const login = async (req: Request, res: Response): Promise<void> => {
    const result = await AuthService.login(req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Login successful",
        data: result,
    });
};

export const AuthController = {
    signup,
    login,
};