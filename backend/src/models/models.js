const mongoose = require('mongoose')
const validator = require('validator')
const {Schema} = mongoose
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String
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
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value))
            {
                throw new Error("something went wrong")
            }
        }
    },
    skills:{
        type:[String]
    },
    profilepic:{
        type:String,
        default:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Cat_07464_kalamis_safinaz.jpg/250px-Cat_07464_kalamis_safinaz.jpg",
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
    const token = await jwt.sign({id},"secretkey",{expiresIn:'1h'})
    return token
}

userSchema.methods.checkPassword= async function(getPassword){
    const isPassword = await bcrypt.compare(getPassword,this.password)
    return isPassword
}

const User = mongoose.model("User",userSchema)

module.exports=User