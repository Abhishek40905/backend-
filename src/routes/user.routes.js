import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

const router= Router()

//the below route will run register user if we send a post request to /user/register
router.route("/register").post(upload.fields([
    {
        name:"avatar",
        maxCount: 1
    },
    {
        name:"coverImage",
        maxCount:1
    }
]),registerUser)

router.route("/register").post(registerUser)
export default router

// import { Router } from "express";
// import { registerUser } from "../controllers/user.controller.js";
// const router =Router()

// router.route("/register").post(registerUser)

// export default router