const express = require('express')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const database = require('./configuration/database')
const User = require("./models/models")
const {isValidated,checkCredentials} = require('./utils/validate.js')
const {userauthentication} = require('../middlewares/auth.js')

const app = express()
app.use(express.json())
app.use(cookieParser())


//insert data
app.post('/signin',async(req,res)=>{
   
    try{
       const hashedPassword = await  isValidated(req) //helper function
        const {firstName,lastName,email,password} = req.body
        
        if(req.body.skills?.length>3)
        {
            throw new Error('more than 3 skills are not allowed')
        }
        const insert = await User.insertOne({
            firstName,
            lastName,
            email,
            password:hashedPassword,
        },{runValidators:true})
        console.log(insert)
        res.send('data inserted successfully')
    }
    catch(err)
    {
        res.status(400).send('data not sent : '+ err.message)
    }
});

app.post('/login',async(req,res)=>{
    try{
        const isUser = await checkCredentials(req)  //helper function
        if(isUser.checkpassword)
        {
            const jwtToken =await isUser.checkUser.getjwt()
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
})

//profile api
app.get('/profile',userauthentication,async(req,res)=>{
    try{
        res.send(req.user)
    }
    catch(err){
        res.status(401).send("ERROR : " + err.message)
    }
})

app.post('/reqconnection',userauthentication,async(req,res)=>{
    try{
        const {firstName} = req.user
        if(!firstName)
        {
            throw new Error("unautherized user!!!,please login")
        }
        res.send(`${firstName} requesting you for the connection`)
    }
    catch(err){
        res.status(400).send(err.message)
    }
})

//get data 
app.get('/getuser',async(req,res)=>{
    const {email} = req.body
    try{
        const users = await User.find({email:email})
        if(!users)
        {
            res.status(404).send('no user exists in the database')
        }
        else{
            res.send(users)
        }
    }
    catch(err)
    {
        res.status(500).send('something went wrong')
    }

})

//delete data
app.delete('/deleteuser',async(req,res)=>{
    const userId = req.body.userId
    try
    {
        const user = await User.findByIdAndDelete(userId)
        if(!user)
        {
            res.send('no user exists')
        }
        else{
            res.send('successfully deleted')
        }
    }
    catch(err)
    {
        res.status(500).send('something went wrong')
    }
});

//update the data

app.patch('/updateuser/:email',async(req,res)=>{
    try{

    const userId = req.params
    const data = req.body
    const ALLOWED = ["age","gender","skill","about"]
    const is_Allowed = Object.keys(data).every(k=>ALLOWED.includes(k))
    if(!is_Allowed)
    {
        throw new Error('certain fields are restricted to update')
    }
    const user = await User.findOneAndUpdate(userId,data,{runValidators:true})
    if(!user)
    {
        res.status(404).send('user not found')
    }
    else{
    res.send('user updated successfully')
    }
    }
    catch(err)
    {
        res.status(500).send('something went wrong:'+ err.message)
    }

})

database().then(()=>{
    console.log('database connected succussfully')
    app.listen(3000,()=>{
        console.log('app running successfully')
    })
})
.catch((err)=>{
    console.log('database not connected')
})