import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import ConnectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes"
import transactionRoutes from "./routes/transaction.routes"
import userRoutes from "./routes/user.routes";


dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(express.urlencoded({extended : true})); 
app.use(
    cors({
        origin : "http://localhost:3000",
        methods : ["POST", "GET", "DELETE", "PUT"],
        credentials : true,
    })
);

// Routes
app.get('/',(_,res) => {
    res.send(" the rooooooook!!!!!!!!");
});
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/transaction", transactionRoutes);
// app.use("/api/user", userRoutes);


const PORT = 8080;

ConnectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
