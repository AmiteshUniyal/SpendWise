import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import ConnectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import transactionRoutes from "./routes/transaction.routes"
import chatRoutes from "./routes/chat.routes";
import userRoutes from "./routes/user.routes";


dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["POST", "GET", "DELETE", "PUT"],
        credentials: true,
    })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);

app.get('/', (_, res) => {
    res.send(" the rooooooook!!!!!!!!");
});


ConnectDB().then(() => {
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
});
