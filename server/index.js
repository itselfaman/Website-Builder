import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.routes.js";
import websiteRouter from "./routes/website.routes.js";
import billingRouter from "./routes/billing.routes.js";

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET?.trim();
if (!JWT_SECRET) {
    console.error("ERROR: JWT_SECRET is not defined in your environment. Set JWT_SECRET in server/.env before starting the application.");
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 5000;

// ensure JWT secret is available early
if (!process.env.JWT_SECRET) {
    console.error("ERROR: JWT_SECRET is not defined in your environment.\n" +
        "Set JWT_SECRET in server/.env before starting the application.");
    // you could optionally `process.exit(1);` here to fail-fast
}

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "https://website-frontend-7ho3.onrender.com",
    credentials: true
}));

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/website",websiteRouter)
app.use("/api/billing",billingRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    connectDb();
})
