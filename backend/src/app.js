const express = require('express')
const cookieParser = require('cookie-parser')
const database = require('./configuration/database')
const User = require("./models/models")
const authRouter = require('./routes/auth.js')
const profileRouter = require('./routes/profile.js')
const requestRouter = require('./routes/request.js')
const userRouter = require('./routes/user.js')
const cors = require('cors')


const app = express()
app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true //to send cookies to the browser without this the browser will not get the cookies
    }
))
app.use(express.json())
app.use(cookieParser())

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',requestRouter)
app.use('/',userRouter)








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
    console.log(userId)
    const data = req.body
    console.log(data)
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