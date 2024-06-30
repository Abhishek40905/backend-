import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

//the below function configures all enviroment variables 
dotenv.config({
    path:"./env"
})


/*
connect db function is imported from db folder and executed which returns 
a promise whcih is either resolved or rejectedby the below code
*/
connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`app is listening on ${process.env.PORT}`);
    })
   
})
.catch((error)=>{
    console.log(error);
})
