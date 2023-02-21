import { Router } from "express";
import { registerCustomer, listCustomers, getCustomerById,updateCustomer } from "../controllers/authController.js";
import { validateSchema } from "../middlewares/validadeSchema.middleware.js";
import { customersSchema } from "../models/customers.model.js";


const userRouter = Router()

userRouter.get('/users/me', listCustomers)

userRouter.get('/ranking', getCustomerById)

export default userRouter