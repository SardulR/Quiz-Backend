import { Router } from "express";
import { adminLogin } from "../controllers/admin.controller.js";


const router= Router();

router.route("/admin").post(adminLogin);

export default router