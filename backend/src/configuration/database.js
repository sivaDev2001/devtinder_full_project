const mongoose = require('mongoose')
require('dotenv').config()

const database = async()=>{
   await mongoose.connect(process.env.MONGODB_URI)
}

module.exports =database