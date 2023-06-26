let mongoose=require("mongoose");

let postSchema=new mongoose.Schema({
title:{
    type:String,
    required:true
},
body:{
    type:String,
    required:true
},
userID:{
    type:String,
    // required:true
}
})

let Postmod=mongoose.model("post",postSchema);

module.exports={
    Postmod
}