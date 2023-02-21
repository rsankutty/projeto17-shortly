import { Router } from "express";
import userRouter from "./usersRouter.js";
import urlRouter from "./urlRouter.js";
import authRouter from "./authRouter.js";

const router = Router();

router.use(authRouter);
router.use(urlRouter);
router.use(userRouter);

export default router;