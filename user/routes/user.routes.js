import express from "express";
import {
  register,
  login,
  logout,
  profile,
  acceptedRide,
} from "../controllers/user.controller";
import userAuth from "../middleware/authMiddleWare";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", userAuth, profile);
router.get("/accepted-ride", userAuth, acceptedRide);

export default router;
