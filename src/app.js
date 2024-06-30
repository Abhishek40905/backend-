import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
// app.use is the notation for middleware
const app= express();
// cors configuration cors cross origin resource sharing

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

//different configurations to be done to recieve data from body or json 

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static('public'))
app.use(cookieParser())

//routes

import userRouter from "./routes/user.routes.js"

app.use("/api/v1/users",userRouter)


export {app}