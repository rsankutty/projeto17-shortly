import { Router } from "express";
import { signUp, signIn } from "../controllers/authController.js"
import { signUpSchema,signInSchema } from "../schemas/userSchema.js"
import { validateSchema } from "../middlewares/validadeSchemaMiddleware.js";
import { validateUser } from "../middlewares/validateUserMiddleware.js"

const authRouter = Router()

authRouter.post('/signup',validateSchema(signUpSchema),validateUser, signUp)
authRouter.post('/signin',validateSchema(signInSchema),validateUser, signIn)

export default authRouter

