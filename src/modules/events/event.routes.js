import { Router } from "express";
import { userController } from "./user.controller.js";

import authenticateToken from "../../middleware/auth.js";

const router = Router()

router.post('/register', userController.create);
router.post('/login', userController.login);




export default router