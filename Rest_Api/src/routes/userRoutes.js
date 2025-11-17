import express from "express"
import { logMiddleware } from "../middleware/logger.js"
import * as userController from "../controllers/userController.js"

const router = express.Router()


router.get("/", logMiddleware, userController.getAllUsers) 
router.get("/:id", userController.getUserById) 
router.post("/", userController.createUser) 
router.put("/:id", userController.updateUser) 
router.delete("/:id", userController.deleteUser) 

export default router