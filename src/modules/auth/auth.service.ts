import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { AppError } from "../../utils/AppError";
import { LoginResult, PublicUser, TokenPayload } from "./auth.interface";
import { AuthRepository } from "./auth.repository";
import { LoginInput, SignupInput } from "./auth.validation";
import { env } from "../../config/env";

const SALT_ROUNDS = 10;

const signup = async (payload: SignupInput): Promise<PublicUser> => {
    const existingUser = await AuthRepository.findByEmail(payload.email);

    if (existingUser) {
        throw new AppError(409, "Email already registered");
    };

    const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);

    return AuthRepository.create({ ...payload, password: hashedPassword });
};

const login = async (payload: LoginInput): Promise<LoginResult> => {
    const user = await AuthRepository.findByEmail(payload.email);

    if (!user) {
        throw new AppError(401, "Invalid email or password");
    }

    const isPasswordMatched = await bcrypt.compare(payload.password, user.password);

    if (!isPasswordMatched) {
        throw new AppError(401, "Invalid email or password");
    }

    const tokenPayload: TokenPayload = { id: user.id, role: user.role };

    const token = jwt.sign(tokenPayload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    });

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

export const AuthService = {
    signup,
    login
};