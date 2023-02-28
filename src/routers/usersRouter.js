import { Router } from "express";
import {getUserInfo, getRanking} from "../controllers/usersController.js";
import {validateToken} from "../middlewares/validateTokenMiddleware.js"


const userRouter = Router()

userRouter.get('/users/me', validateToken,getUserInfo)

userRouter.get('/ranking', getRanking)

export default userRouter