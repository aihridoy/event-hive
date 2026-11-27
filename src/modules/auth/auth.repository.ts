import { pool } from "../../config/db";
import { PublicUser, User } from "./auth.interface";
import { SignupInput } from "./auth.validation";

const findByEmail = async (email: string): Promise<User | undefined> => {
    const result = await pool.query<User>(`
        SELECT * FROM users WHERE email=$1
        `, [email]);

    return result.rows[0];
};

const create = async (user: SignupInput): Promise<PublicUser> => {
    const result = await pool.query<PublicUser>(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, role, created_at, updated_at`,
        [user.name, user.email, user.password, user.role],
    );

    return result.rows[0] as PublicUser;
};

export const AutRepository = {
    findByEmail, create
};