import { Router } from "express";
import { getProfile, login, logout, register } from "../controllers/UserController.js";
import { auth } from "../middleware/auth.js"; // or { auth } depending on your export

const router = Router();

router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/profile", auth, getProfile);

router.post("/logout", logout);

export default router;