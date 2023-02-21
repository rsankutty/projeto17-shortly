import { Router } from "express";
import { listGames, registerGame } from "../controllers/urlsController.js";
// import { gamesSchema } from "../models/games.model.js"
// import { validateSchema } from "../middlewares/validadeSchema.middleware.js";

const authRouter = Router()

authRouter.post('/signup', listGames)
authRouter.post('/signin', registerGame)

export default authRouter

