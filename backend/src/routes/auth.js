const express = require('express')
const {isValidated,checkCredentials} = require('../utils/validate.js')
const User = require("../models/models")

const authRouter = express.Router()

//insert data
authRouter.post('/signin',async(req,res)=>{
    try{
       const hashedPassword = await  isValidated(req) //helper function
        const {firstName,lastName,email,password,age,gender,profilepic,skills} = req.body
        
        if(req.body.skills?.length>3)
        {
            throw new Error('more than 3 skills are not allowed')
        }
        const insert = await User.insertOne({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            age,
            gender,
            profilepic,
            skills
        },{runValidators:true})
        res.send('data inserted successfully')
    }
    catch(err)
    {
        res.status(400).send('data not sent : '+ err.message)
    }
});

authRouter.post('/login',async(req,res)=>{
    try{
        const isUser = await checkCredentials(req)  //helper function
        if(isUser.checkpassword)
        {
            const jwtToken =await isUser.checkUser.getjwt()  //
            res.cookie("token",jwtToken)  //cookie that has jwttoken wrapped inside
            res.send("user logged-in")
        }
        else{
            throw new Error("Invalid password")
        }
    }
    catch(err)
    {
        res.send("ERROR : " + err.message)
    }
});

authRouter.post('/logout',(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())})
    res.send("user logged out")
});


module.exports = authRouter