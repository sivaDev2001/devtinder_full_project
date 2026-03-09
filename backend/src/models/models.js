const mongoose = require('mongoose')
const validator = require('validator')
const {Schema} = mongoose
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
       },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error('email was not in correct format')
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value))
            {
                throw new Error("password was not strong")
            }
        }
    },
    age:{
        type:Number,
        required:true,
        min:18
    },
    gender:{
        type:String,
        required:true,
        validate(value){
            if(!["male","female","others"].includes(value))
            {
                throw new Error("something went wrong")
            }
        }
    },
    skills:{
        required:true,
        type:[String]
    },
    profilepic:{
        type:String,
        default:"https://img.daisyui.com/images/profile/demo/spiderperson@192.webp",
        validate(value){
            if(!validator.isURL(value))
            {
                throw new Error("Image path is not valid")
            }
        }
    },
    about:{
        type:String,
        default:"About Yourself"
    }
},
{
    timestamps:true
})

userSchema.methods.getjwt=async function(){
    const id=this._id
    const token = await jwt.sign({id},process.env.JWT_SECRET,
        {
            expiresIn:'1h',
        })
    return token
}

userSchema.methods.checkPassword= async function(getPassword){
    const isPassword = await bcrypt.compare(getPassword,this.password)
    return isPassword
}

const User = mongoose.model("User",userSchema)

module.exports=User