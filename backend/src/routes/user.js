const express = require('express')
const userRouter = express.Router()
const {userauthentication} = require('../../middlewares/auth.js')
const UserRequestConnection = require('../models/requestConnection.js')
const User = require('../models/models.js')

//this api show all requests sent to you
userRouter.get('/user/view/requests',userauthentication,async(req,res)=>{
    try{
        const loggedInUser = req.user
        const findRequests = await UserRequestConnection.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate('fromUserId','firstName lastName').select("fromUserId")
        if(!findRequests)
        {
            throw new Error("There is no requests for you")
        }
        res.status(200).json({
            message:`data fetched successfully`,
            data:findRequests
        })
    }
    catch(err)
    {
        res.status(400).send("ERROR : " + err.message)
    }
});

//get all the connections api
userRouter.get('/user/view/connections',userauthentication,async(req,res)=>{
    try{
        const loggedInUser = req.user
        const findConnections = await UserRequestConnection.find({
            $or:[{fromUserId:loggedInUser._id,status:"accepted"},
            {toUserId:loggedInUser._id,status:"accepted"}]
        }).populate("fromUserId","firstName lastName age gender skills profilepic")
        .populate("toUserId","firstName lastName age gender skills profilepic")
        if(!findConnections)
        {
            return res.status(404).json({
                message:"No user connections"
            })
        }
        const friendInfo = findConnections.map(user=>{
            if(user.fromUserId._id.equals(loggedInUser._id)){ //this line raised from bug of giving logged in users own info in the connections lis
                return user.toUserId
            }
            return user.fromUserId
        })
        res.status(200).json({
            message:"connections fetched successfully",
            data:friendInfo
        })
    }
    catch(err)
    {
        res.status(400).send("ERROR : "+err.message)
    }
});

//showing all the users profile for feed api except profiles present in the connections table
userRouter.get('/user/feed',userauthentication,async(req,res)=>{
    try{
        //pagination to get only 5 users
        let {page,limit} = req.query
        page=page || 1
        limit=limit || 5
        page=(page-1)*limit
        limit = limit>5 ? 6 : limit //if limit exceeds more than 5 then show only 6 documents


        const loggedInUser = req.user
        const connectedUsers = await UserRequestConnection.find({
            $or:[{fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId") //select only the selective fields from the document
        const set = new Set()
        connectedUsers.forEach(id=>{
            set.add(id.fromUserId.toString())
            set.add(id.toUserId.toString())
        })
        const filterUser = await User.find({
            _id:{$nin:Array.from(set)} ///Array.from will convert array like object or string into array
        }).select("firstName lastName email age gender skills profilepic about").skip(page).limit(limit)
        if(!filterUser)
        {
            return res.status(401).json({
                message:"no feeds are available",
                data:filterUser
            })
        }
        res.status(200).json({
            message:"feed data fetched successfully",
            data:filterUser
        })
    }
    catch(err)
    {
        res.status(400).json({
            message:err.message
        })
    }
})

module.exports = userRouter