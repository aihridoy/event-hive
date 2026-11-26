import express from "express";
import { apiRouter } from "./routes";
import { notFound } from "./middleware/notFound.middleware";
import { errorHandler } from "./middleware/error.middleware";

export const app = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
    res.json({ success: true, message: "EventHive API is running" });
});

app.use("/api/v1", apiRouter);

app.use(notFound);
app.use(errorHandler);