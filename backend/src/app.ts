import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middlewares";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);


import authRoutes from "./routes/auth.route";
import contentRoutes from "./routes/content.route";
import shareRoutes from "./routes/share.route";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/share",shareRoutes)

app.use(errorMiddleware);
export { app };
