import { Router } from "express";
import { listRentals, registerRental,closeRental,deleteRental} from "../controllers/usersController.js";
import { validateSchema } from "../middlewares/validadeSchemaMiddleware.js";
import { rentalSchema } from "../schemas/rentals.model.js";

const urlRouter = Router()

urlRouter.post('/urls/shorten', listRentals)

urlRouter.get('/urls/:id', listRentals)

urlRouter.get('/urls/open/:shortUrl',validateSchema(rentalSchema), registerRental)

urlRouter.delete('/urls/:id', closeRental)


export default urlRouter