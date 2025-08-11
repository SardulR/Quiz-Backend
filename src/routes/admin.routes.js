import { Router } from "express";
import { adminLogin , createUser, getUser} from "../controllers/admin.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"


const router= Router();

router.route("/admin").post(adminLogin);

router.route("/admin/createuser").post(verifyJWT,createUser);

router.route("/admin/getuser").get(verifyJWT,getUser);

export default router