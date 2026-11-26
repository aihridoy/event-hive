import { Pool } from "pg";
import { env } from "./env";

const connectionString = env.DATABASE_URL;

export const pool = new Pool({
    connectionString
});

pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL pool error:", error.message);
}); 