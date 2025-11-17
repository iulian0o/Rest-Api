import express from "express"
import { logMiddleware } from "../middleware/logger.js"
import * as movieController from "../controllers/movieController.js"

const router = express.Router()

router.get("/", logMiddleware, movieController.getAllMovies) 
router.get("/:id", movieController.getMovieById) 
router.post("/", movieController.createMovie) 
router.put("/:id", movieController.updateMovie)
router.delete("/:id", movieController.deleteMovie) 

export default router
