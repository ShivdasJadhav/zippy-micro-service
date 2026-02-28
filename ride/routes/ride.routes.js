import express from "express";
import { userAuth, captainAuth } from "../middleware/auth.middleware";
import { createRide, acceptRide } from "../controller/ride.controller";

const router = express.Router();

router.post("/create-ride", userAuth, createRide);
router.put("/accept-ride", captainAuth, acceptRide);

export default router;
