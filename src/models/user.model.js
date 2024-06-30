import mongoose,{Schema, mongo} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const userSchema = new Schema({
     username:{
        type:String,
        required:true,
        unique: true,
        lowercase:true,
        trim:true,
        index:true
     }   ,
     email:{
        type:String,
        required:true,
        unique: true,
        lowercase:true,
        trim:true
     }  ,
     fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
     } ,
     avatar:{
        type:String,
        required:true
     },
     coverImage:{
        type:String
     },
     watchHistory:[{
        type:Schema.Types.ObjectId,
        ref:"Video"
     }],
     password:{
        type:String,
        required:[true,'password is required']
     },
     refreshToken:{
        type:String,
     }
},{timestamps:true})

/*
   schema.pre gives the functionality of a middleware this means we can run a function before doing any operation on database
   this has no relation with express it's middleware of mongoose
*/

userSchema.pre("save",async function(next){
   if (this.isModified("password")) {
    this.password=await bcrypt.hash(this.password , 10)
    next()
   } 
   else return next()
})

/*
   schema.methods gives access to methods object which lets me create custom methods for that particular schema
*/
userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password)
}
//custom method to genrate access token
userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
       _id:this._id,
       email:this.email,
       username:this.username,
       fullname:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
   )
}
//custom method to generate refresh token
userSchema.methods.generateRefreshToken=function(){
    jwt.sign({
        _id:this._id,
        
     },
     process.env.REFRESH_TOKEN_SECRET,
     {
         expiresIn:process.env.REFRESH_TOKEN_EXPIRY
     }
    )
}


export const User =mongoose.model('User', userSchema)