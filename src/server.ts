import { app } from "./app";
import { pool } from "./config/db";
import { env } from "./config/env";

const startServer = async (): Promise<void> => {
    try {
        await pool.query("SELECT 1");
        console.log("Database connected")
    } catch (error) {
        console.error("Database connection failed:", (error as Error).message);
        process.exit(1);
    }

    app.listen(env.PORT, (error) => {
        if (error) {
            console.error("Server failed to start:", error.message);
            process.exit(1);
        }

        console.log(`Server running on port ${env.PORT}`);
    });
};

void startServer();