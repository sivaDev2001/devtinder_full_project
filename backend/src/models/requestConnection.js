const mongoose = require('mongoose');
const {Schema} = mongoose

const requestConnection = new Schema({
    fromUserId : {
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toUserId : {
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status : {
        type:String,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:"{value} is invalid status"
        }
    }
},
{
    timestamps:true
});

requestConnection.index({fromUserId:1,toUserId:1})

requestConnection.pre("save",function(){  //it is schema validation MIDDLEWARE funtion run before save()  
    const request = this                  //it dont need next for modern version of pre middleware function
    if(request.fromUserId.equals(request.toUserId))
    {
        throw new Error("you cannot send request to yourself")
    }
})

const UserRequestConnection = new mongoose.model("UserRequestConnection",requestConnection)

module.exports = UserRequestConnection