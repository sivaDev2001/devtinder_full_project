const mongoose = require('mongoose')

const database = async()=>{
   await mongoose.connect("mongodb+srv://root:root@cluster0.gvvlenr.mongodb.net/DevTinder")
}

module.exports =database