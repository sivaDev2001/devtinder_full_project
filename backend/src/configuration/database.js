const mongoose = require('mongoose')

const database = async()=>{
   await mongoose.connect(process.env.MONGODB_URI)
}

module.exports =database