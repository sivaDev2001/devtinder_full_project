const express = require('express')
const {userauthentication} = require('../../middlewares/auth.js')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const User = require('../models/models.js')
const { IMAGE_URL } = require('../public/URL.js')

const fileRouter = express.Router()

// Create images directory if it doesn't exist
const imageDir = path.join(__dirname, '../public/images')
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination:function(req,file,cb)
    {
        if(!file){
            return cb(new Error('file not found'),null)
        }
        else{
            return cb(null, imageDir)
        }
    },
    filename:function(req,file,cb)
    {
        if(!file){
            return cb(new Error('file not found'),null)
        }
        else
        {
            return cb(null,`${Date.now()}-${file.originalname}`)
        }
    }
})

const upload = multer({storage})

fileRouter.patch('/images/upload',userauthentication,upload.single('profilepic'),async(req,res)=>{
    try{
        const userData = req.user
        const profilepic_URL = IMAGE_URL ? `${IMAGE_URL}/${req.file.filename}` :
        `http://localhost:5000/images/${req.file.filename}`
        userData.profilepic = profilepic_URL
        await userData.save()
        res.status(200).json({
            message:"Image uploaded successfully",
            data:userData
        })
    }
    catch(err)
    {
        console.error("Error saving userData:", err.message)
        res.status(500).json({
            message:"Error occurred while uploading image",
            error: err.message
        })
    }
})

module.exports = fileRouter


//  fieldname: 'profilepic',
//   originalname: 'nightforest.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: 'D:\\DevTinder\\backend\\src\\public\\images',
//   filename: '1772866770624-nightforest.jpg',
//   path: 'D:\\DevTinder\\backend\\src\\public\\images\\1772866770624-nightforest.jpg',
//   size: 151976