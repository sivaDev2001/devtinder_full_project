const User = require('../src/models/models.js')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const userauthentication = async(req,res,next)=>{
    try{
        const {token} = req.cookies
        if(!token){  //this case will never true this is just only for some safety purpose only
            return res.status(401).json({message:"unauthenticated user!!! please login"})
        }
        const user_id = await jwt.verify(token,process.env.JWT_SECRET)
        const user_info = await User.findById(user_id.id)
        req.user=user_info
        next()
    }
    catch(err){
        if(err.message==="jwt expired"){
            res.status(400).send("unauthenticated user!!! please log-in")
        }
        else
        {
            res.status(400).send(err.message)
        }
    }
}

module.exports={
    userauthentication
}