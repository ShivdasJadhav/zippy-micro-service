import express from "express";
import {
  register,
  login,
  logout,
  profile,
  toggleAvailability,
  waitForNewRide,
} from "../controllers/captain.controller";
import { captainAuth } from "../middleware/authMiddleWare";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", captainAuth, profile);
router.patch("/toggle-availability", captainAuth, toggleAvailability);
router.get("/new-ride", captainAuth, waitForNewRide);

export default router;
