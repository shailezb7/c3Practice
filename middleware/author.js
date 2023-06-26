let {Postmod} = require('../models/post.model');

let author =async (req,res,next) =>{
   let {postID} = req.params;
   let post = await Postmod.findOne({_id:postID});
   let post_user = post.userID;
   if(post_user == req.userID){
    next();
   }
   else{
    res.send({msg:'user not authorised'});
   }
}

module.exports={author};