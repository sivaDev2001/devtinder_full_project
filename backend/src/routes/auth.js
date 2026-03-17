const express = require('express')
const { isValidated, checkCredentials } = require('../utils/validate.js')
const User = require("../models/models")


const authRouter = express.Router()

//insert data
authRouter.post('/signin', async (req, res) => {
    try {
        const hashedPassword = await isValidated(req) //helper function
        const { firstName, lastName, email, password, age, gender,profilepic, skills,about } = req.body

        if (req.body.skills?.length > 4) {
            throw new Error('more than 4 skills are not allowed')
        }
        const insert = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            age,
            gender,
            profilepic,
            skills,
            about
        })
        const cookies = await insert.getjwt()
        res.cookie("token",cookies,{
            httpOnly:true,
            secure:false,
            sameSite:"lax"
        })
        res.json({
            message:"user registered successfully",
            data:insert
        })
    }
    catch (err) {
        res.status(400).json(
            {
                message:err.message,
                code:err.code
            }
        )
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const isUser = await checkCredentials(req)  //helper function
        if (isUser.checkpassword) {
            const jwtToken = await isUser.checkUser.getjwt()  //
            res.cookie("token", jwtToken,{
                httpOnly:true,
                secure:true,
                sameSite:'none'
            })  //cookie that has jwttoken wrapped inside
            res.json({
                message: "user logged-in successfully",
                data: isUser.checkUser
            }
            )
        }
        else {
            return res.status(400).send("Wrong Password!!! Please check the password")
        }
    }
    catch (err) {
        res.status(401).send(err.message)
    }
});

authRouter.post('/logout', (req, res) => {
    res.cookie("token",null,
        {
            expires:new Date(Date.now()),
            path:'/'
        })
    res.send("user logged out")
});


module.exports = authRouter