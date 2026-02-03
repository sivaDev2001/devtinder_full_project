const express = require('express')
const UserRequestConnection = require('../models/requestConnection.js')
const User = require('../models/models.js')
const {userauthentication} = require('../../middlewares/auth.js')


const requestRouter = express.Router()

//sending interested or ignoring the other user profile api
requestRouter.post('/user/request/:status/:userId',userauthentication,async(req,res)=>{
    try{
        const fromUserId = req.user._id
        const toUserId = req.params.userId
        const status = req.params.status
        const allowedStatus = ["ignored","interested"]
        if(!allowedStatus.includes(status)) //validate the status
        {
            throw new Error("Invalid status!!!")
        };
        const check_UserExists = await User.findById(toUserId) //check if user exists are not
        if(!check_UserExists)
        {
            throw new Error("User not found ")
        }
        const is_alreadyConnected = await UserRequestConnection.findOne({  //to avoid repeatedly sending connection request
            $or:[
                {
                    fromUserId:fromUserId,
                    toUserId:toUserId
                },
                {
                    fromUserId:toUserId,
                    toUserId:fromUserId
                }
            ]
        })
        if(is_alreadyConnected){
            return res.status(400).send("connection request already sent")
        }
        const sendRequestData = new UserRequestConnection({
            fromUserId,
            toUserId,
            status
        });
        await sendRequestData.save()
        res.status(200).json({
            message:`you currently ${status} an one profile`
        })

    }
    catch(err){
        res.status(400).send("ERROR : " + err.message)
    }
});

//reviewing connection requests
requestRouter.post('/user/review/:status/:requestId',userauthentication,async(req,res)=>{
    try{
        const loggedInUser = req.user
        const status = req.params.status
        const allowedStatus = ["accepted","rejected"]
        if(!allowedStatus.includes(status))
        {
            throw new Error("Invalid Status sent by the user")
        }
        const findUser = await UserRequestConnection.findOne({
            _id:req.params.requestId, //to accept or reject particular user and also mutate the UserRequest collections document into current status
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId","firstName") 
        if(!findUser)
        {
            throw new Error("No requests is there for you")
        }
        findUser.status=status
        await findUser.save()
        res.status(200).json({
            message:`you ${status} ${findUser.fromUserId.firstName}'s request`
        })
    }
    catch(err)
    {
        res.status(400).send("ERROR : " + err.message)
    }
})

module.exports = requestRouter