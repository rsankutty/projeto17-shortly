import { Router } from "express";
import {getUserInfo, } from "../controllers/usersController.js";
import { validateSchema } from "../middlewares/validadeSchemaMiddleware.js";
import {validateToken} from "../middlewares/validateTokenMiddleware.js"


const userRouter = Router()

userRouter.get('/users/me', validateToken,getUserInfo)

// userRouter.get('/ranking', listRentals)

export default userRouter