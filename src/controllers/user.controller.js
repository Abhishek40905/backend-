// import { asyncHandler } from "../utils/asyncHandler.js";
// import {ApiError} from "../utils/ApiError.js"
// import {User} from "../models/user.model.js"
// import {uploadOnCloudinary} from "../utils/cloudinary.js"
// import { ApiResponse } from "../utils/Apiresponse.js"

// const registerUser = asyncHandler(async (req,res)=>{
//     res.status(200).json({
//         messege:"hello world!"
//     })
    
//     /* algo
//         get user details from frontend
//         validation - not empty
//         check if user already exists : username and email
//         check if avatar and coverimage
//         upload them to cloudinary
//         check if avatar is uploaded to cloudinary
//         create a user object and create entry in db
//         remove password and refresh token from response
//         check if user is created successfully 
//         return response

//     */
//    /*

//         const {username,password,fullname,email}=req.body
//         let x= true
//         let arr=[username,password,fullname,email]
//         arr.forEach((item)=>{
//             if(item==="") x=false     
//         })
//         if(x== false) throw new ApiError(400,"all feilds are required")

//         const existeduser=await User.findOne({
//             $or:[{username},{email}]
//         })
//         if (!existeduser) {
//             throw new ApiError(409,"user already exits")
//         }
//         //file handling
//         const avatarlocalpath=req.files?.avatar[0]?.path
//         const coverimagelocalpath=req.files?.coverImage[0]?.path
//         if (!avatarlocalpath) {
//             throw new ApiError(400,"Avatar file is required")
//         }
//        const avatar = await uploadOnCloudinary(avatarlocalpath)
//        const coverimage= await uploadOnCloudinary(coverimagelocalpath)
//        if(!avatar){
//         throw new ApiError(400,"avatar file is required")
//        }
//        const user =await User.create({
//         fullname,
//         avatar:avatar.url,
//         coverImage:coverimage?.url || "",
//         email,
//         password,
//         username:username.toLowerCase()
//        })

//       const createdUser=await User.findById(user._id).select("-password -refreshToken")
//       if (!createdUser) {
//         throw new ApiError(500,"something went wrong while registering the user")
//       }
// return res.status(201).json(
//     new ApiResponse(200,createdUser,"user registered successfully")
// )*/



// })


import {asyncHandler} from "../utils/asyncHandler.js"
const registerUser = asyncHandler(async (req,res)=>{
    res.status(200).json({
        message: "ok"
    })
})

export {registerUser}