const express = require('express')
const database = require('./configuration/database')
const User = require("./models/models")

const app = express()
app.use(express.json())


//insert data
app.post('/user',async(req,res)=>{
   
    try{
        const insert = await User.insertOne(req.body)
        console.log(insert)
        res.send('data inserted successfully')
    }
    catch(err)
    {
        res.status(400).send('data not sent'+ err)
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
    const user = await User.findOneAndUpdate(userId,data)
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
        res.status(500).send('something went wrong')
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