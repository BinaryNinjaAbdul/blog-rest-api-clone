import { Router } from "express";
import { login, signup } from "../controller/authController";

const router = Router();

router.route("/login").post(login);
router.route("/register").post(signup);

export default router;
