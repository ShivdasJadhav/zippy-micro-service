import express from "express";
import cookieParser from "cookie-parser";
import rideRoutes from "./routes/ride.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", rideRoutes);

export default app;
