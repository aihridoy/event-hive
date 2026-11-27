export type Role = "attendee" | "organizer";

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: Role;
    created_at: Date;
    updated_at: Date;
};

export type PublicUser = Omit<User, "password">;

export interface TokenPayload {
    id: number,
    role: Role
};

export interface LoginResult {
    token: string;
    user: Pick<User, "id" | "name" | "email" | "role">;
}