let mongoose=require("mongoose");

let userSchema=new mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
}
})

let Usermod=mongoose.model("user",userSchema);

module.exports={
    Usermod
}
