import { Router } from "express";
import {listRentals,closeRental } from "../controllers/usersController.js";
import { validateSchema } from "../middlewares/validadeSchemaMiddleware.js";
import { customersSchema } from "../schemas/customers.model.js";


const userRouter = Router()

userRouter.get('/users/me', closeRental)

userRouter.get('/ranking', listRentals)

export default userRouter