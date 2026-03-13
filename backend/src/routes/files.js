const express = require('express')
const cloudinary = require('../configuration/cloudinary.js')
const multer = require('multer')
const path = require('path')
const { userauthentication } = require('../../middlewares/auth.js')
const fileRouter = express.Router()

const storage = multer.diskStorage(
    {
        destination:function(req,file,cb)
        {
            return cb(null,path.join(__dirname,'../public/images'))
        },
        filename:function (req,file,cb)
        {
            return cb(null,`${Date.now()}-${file.originalname}`)
        }
    }
)
const upload = multer({ storage })
fileRouter.patch('/images/upload',userauthentication,upload.single('profilepicture'),async(req,res)=>{
    try{
        cloudinary.uploader.upload(req.file.path,async function(err,result){
        if(err)
        {
            return res.status(500).json({
                message:err
            }
            )
        }
        const profile_pic = result.secure_url
        req.user.profilepic = profile_pic
        await req.user.save()
        res.status(200).json({
            message:'image uploaded',
            data:req.user
        })
    })
    }
    catch(err)
    {
        res.status(400).json({
            message:err.message
        })
    }
})

module.exports=fileRouter