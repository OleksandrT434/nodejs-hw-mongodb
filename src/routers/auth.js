import { Router } from "express";
import { validateBody } from "../middlewares/validateBody.js";
import { registerController, loginController, logoutController, refreshController} from "../controllers/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { loginUserSchema, registerSchema, resetPasswordSchema} from "../validation/auth.js";
import { requestEmailController, resetPasswordController } from "../controllers/auth.js";
import { requestEmailSchema } from "../validation/auth.js";

const router = Router();

router.post('/register', validateBody(registerSchema), ctrlWrapper(registerController));
router.post('/login', validateBody(loginUserSchema), ctrlWrapper(loginController));
router.post('/logout', ctrlWrapper(logoutController));
router.post('/refresh', ctrlWrapper(refreshController));
router.post('/send-reset-email', validateBody(requestEmailSchema), ctrlWrapper(requestEmailController));
router.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));

export default router;