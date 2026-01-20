const User = require('../src/models/models.js')
const jwt = require('jsonwebtoken')

const userauthentication = async(req,res,next)=>{
    try{
        const {token} = req.cookies
        if(!token){  //this case will never true this is just only for some safety purpose only
            throw new Error('unauthenticated user!!! please log-in')
        }
        const user_id = await jwt.verify(token,"secretkey")
        const user_info = await User.findById(user_id.id)
        req.user=user_info
        next()
    }
    catch(err){
        if(err.message==="jwt expired"){
            res.status(400).send("unauthenticated user!!! please log-in")
        }
        res.status(400).send(err.message)
    }
}

module.exports={
    userauthentication
}