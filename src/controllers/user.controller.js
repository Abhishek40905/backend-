import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/Apiresponse.js"

const options={
    httpOnly:true,
    secure:true
}

const generateAccessAndRefreshToken= async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"somehting went wrong while generating acces and refresh token")
    }
}
const registerUser = asyncHandler(async (req,res)=>{
   
    
    /* algo
        get user details from frontend
        validation - not empty
        check if user already exists : username and email
        check if avatar and coverimage
        upload them to cloudinary
        check if avatar is uploaded to cloudinary
        create a user object and create entry in db
        remove password and refresh token from response
        check if user is created successfully 
        return response

    */
   
        const {username,password,fullName,email}=req.body
        let x= true
        let arr=[username,password,fullName,email]
        arr.forEach((item)=>{
            if(item==="") x=false     
        })
        if(x== false) throw new ApiError(400,"all feilds are required")

        const existeduser=await User.findOne({
            $or:[{username},{email}]
        })
        if (existeduser) {
            throw new ApiError(409,"user already exists")
        }
        //file handling
        const avatarlocalpath=req.files?.avatar[0]?.path
        // const coverimagelocalpath=req.files?.coverImage[0]?.path

        let coverimagelocalpath;
        if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0) {
            coverimagelocalpath=req.files.coverImage[0].path    
        }

        if (!avatarlocalpath) {
            throw new ApiError(400,"Avatar file is required")
        }
       const avatar = await uploadOnCloudinary(avatarlocalpath)
       const coverimage= await uploadOnCloudinary(coverimagelocalpath)


       if(!avatar){
        throw new ApiError(400,"avatar file is required")
       }
       const user =await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverimage?.url || "",
        email,
        password,
        username:username.toLowerCase()
       })

      const createdUser=await User.findById(user._id).select("-password -refreshToken")
      if (!createdUser) {
        throw new ApiError(500,"something went wrong while registering the user")
      }
   return res.status(201).json(
    new ApiResponse(200,createdUser,"user registered successfully"))
})

const loginUser = asyncHandler(async (req,res)=>{

    // request body -> data
    // username or email 
    // find the user 
    // password check
    // access and refresh token 
    // send cookies 
    // send response 


    

    const { email, username,password }=req.body
    if (!email|| !username) {
        throw new ApiError(400 ,"atleast one of username or email is required")
    }
   const user= await User.findOne({
        $or:[{username},{email}]
    })
    if (!user) {
        throw new ApiError(404,"user does not exits")
    }
    // is password correct method or other methods defined by you in the user model can only be accessed using "user" not "User" because User can access methods by mongoose
    const ispasswordvalid= await user.isPasswordCorrect(password)
    if (!ispasswordvalid) {
        throw new ApiError(401,"Invalid user credentials")
    }

    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)
    const loggedInUser= await User.findById(user._id).select("-password -refreshToken")

    

    return res.status(200).cookie("accessToken",accessToken).cookie("refreshToken",refreshToken).json(new ApiResponse({
        user:loggedInUser,
        accessToken,
        refreshToken
    },
    "user logged in successfully"
))

})

const logoutUser=asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
           $set:{
            refreshToken:undefined
           }
        },
        {
            new:true
        }
    )

    
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user logged out successfully"))

})

const changeCurrentPassword = asyncHandler( async (req,res)=>{

    const {oldPassword,newPassword}= req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(400,"Invalid old password")
    }
    user.password=newPassword
    await user.save({validateBeforeSave:false})
    return res
    .status(200)
    .json(new ApiResponse(200,{},"password changed successfully"))

})

const getCurrentUser=asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200,req.user,"user details fetched successfully"))
})

const updateAccountDetails= asyncHandler(async(req,res)=>{
    const {username,email,fullName}= req.body
    if(!fullName|| !email){
        throw new ApiError(400,"all fields are required")
    }
  const user =  User.findByIdAndUpdate(req.user?._id,{
        $set:{
            fullName,
            email
        }
    },{new:true}).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Account details updated successfully"))
})

const updateUserAvatar = asyncHandler(async (req,res)=>{
    const avatarLocalPath=req.file?.path
    
    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar file is missing")
    }

    const avatar= await uploadOnCloudinary(avatarLocalPath)
    if(!avatar.url){
        throw new ApiError(400,"Error while uploading avatar image on cloudinary")
    }
    const user= await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            avatar:avatar.url
        }
    },{new:true}).select("-password")
    return res
    .status(200)
    .json(new ApiResponse(200,user,"avatar image updated successfully"))
    
})

const updateUserCoverImage = asyncHandler(async (req,res)=>{
    const  coverImageLocalPath=req.file?.path
    
    if (!coverImageLocalPath) {
        throw new ApiError(400,"cover Image file is missing")
    }

    const coverImage= await uploadOnCloudinary(avatarLocalPath)
    if(!coverImage.url){
        throw new ApiError(400,"Error while uploading cover image on cloudinary")
    }
    const user=await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            coverImage:coverImage.url
        }
    },{new:true}).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,user,"cover image updated successfully"))
    
})

export {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    getCurrentUser,
    updateUserAvatar,
    updateUserCoverImage
}