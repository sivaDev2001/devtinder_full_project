const express = require('express')
const {userauthentication} = require('../../middlewares/auth.js')
const bcrypt = require('bcrypt')

const profileRouter = express.Router()

//get profile api
profileRouter.get('/profile/view',userauthentication,async(req,res)=>{
    try{
        res.send(req.user)
    }
    catch(err){
        res.status(401).send("ERROR : " + err.message)
    }
});

//edit profile api
profileRouter.patch('/profile/edit',userauthentication,async(req,res)=>{
    try{
        const allowedUpdates = ["firstName","lastName","age","gender","skills","profilepic","about"] //data sanitization
        const is_Allowed = Object.keys(req.body).every(e=>allowedUpdates.includes(e))
        console.log(is_Allowed)
        if(!is_Allowed)
        {
            throw new Error("Not allowed to update ")
        }
   
        Object.keys(req.body).forEach(keys=>req.user[keys] = req.body[keys]) //here updating the document
    
        await req.user.save()  //.save() function will update the document if the user_id already exists
        res.send('profile updated succussfully')
    }
    catch(err)
    {
        res.status(400).send("ERROR : "+err.message)
    }
});

//edit password api
profileRouter.patch('/profile/editpassword',userauthentication,async(req,res)=>{
    try{
        const {oldPassword,newPassword} = req.body
        const userData = req.user
        const is_password = await userData.checkPassword(oldPassword)  //from schema methods 
        if(!is_password){
            throw new Error("old Password was incorrect")
        }
        const new_HashedPassword = await bcrypt.hash(newPassword,10)
        userData.password = new_HashedPassword
        await userData.save()
        res.send("password updated successfully")
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message)
    }
})


module.exports = profileRouter