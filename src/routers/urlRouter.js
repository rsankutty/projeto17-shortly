import { Router } from "express";
import { validateSchema } from "../middlewares/validadeSchemaMiddleware.js";
import {urlSchema} from "../schemas/urlSchema.js"
import {validateToken} from "../middlewares/validateTokenMiddleware.js"
import { createShortUrl,getShortUrl,openShortUrl,deleteShortUrl } from "../controllers/urlsController.js";

const urlRouter = Router()

urlRouter.post('/urls/shorten', validateToken,validateSchema(urlSchema),createShortUrl)

urlRouter.get('/urls/:id', getShortUrl)

urlRouter.get('/urls/open/:shortUrl',openShortUrl)

urlRouter.delete('/urls/:id',validateToken,deleteShortUrl)


export default urlRouter