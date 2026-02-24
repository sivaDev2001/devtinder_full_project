const express = require('express')
const { isValidated, checkCredentials } = require('../utils/validate.js')
const User = require("../models/models")

const authRouter = express.Router()

//insert data
authRouter.post('/signin', async (req, res) => {
    try {
        const hashedPassword = await isValidated(req) //helper function
        const { firstName, lastName, email, password, age, gender, profilepic, skills } = req.body

        if (req.body.skills?.length > 3) {
            throw new Error('more than 3 skills are not allowed')
        }
        const insert = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            age,
            gender,
            profilepic,
            skills
        })
        res.send('data inserted successfully')
    }
    catch (err) {
        res.status(400).send('data not sent : ' + err.message)
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