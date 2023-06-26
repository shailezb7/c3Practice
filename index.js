require('dotenv').config();
 let express=require('express');
 let cors=require('cors');
 const bcrypt = require('bcrypt');
 let {connectDb}=require('./config/db');
  let {Usermod} = require('./models/user.model');
  let {Postmod} = require('./models/post.model');
  var jwt = require('jsonwebtoken');
  let {auth} = require('./middleware/auth');
const { author } = require('./middleware/author');


 let app=express();
 app.use(express.json());
 app.use(cors());
 


 app.get('/',(req,res)=>{
    res.send({msg:'Home Page'});
 })

 app.post('/signup', async (req,res)=>{
   let {email,name,password} = req.body;
   let user = await Usermod.find({email});
   if(user.length>0){
      res.send({msg:'user already exist ! '})
   }
   else{
      try {
         const hashed_pass = bcrypt.hashSync(password, 7);
         await Usermod.create({name,email,password:hashed_pass});
         res.send('user created successfully');
      } catch (error) {
         res.send('signup failed');
      }
   }
 })
 
 app.post('/login',async (req,res)=>{
   let {email,password} = req.body;
   let user = await Usermod.findOne({email});
   if(user){
      try {
         let check_pass = bcrypt.compareSync(password, user.password);
         if(check_pass){
            var token = jwt.sign({ userID: user._id }, process.env.SECRET_KEY);
            // console.log(token);
            res.send({msg:'login successful',token});
         }
         else{
            res.send({msg:'wrong password'});
         }
      } catch (error) {
         res.send('login failed');
      }
   }
   else{
      res.send('user not found pls signup !');
   }
 })
 
 app.get('/posts' , async(req,res)=>{
    let info = await Postmod.find();
    res.send({data:info});
 })

 app.post('/posts/create', auth , async (req,res)=>{
   let {title,body} = req.body;
   let user= await Usermod.findOne({_id:req.userID})
   if(user){
       await Postmod.create({title,body,userID:req.userID});
       res.send({msg:`post created by ${user.name}`});
   }
   else{
      res.send({msg:'wrong token'});
   }
})

 app.put('/posts/update/:postID',auth, author, async (req,res)=>{
   let {title, body} = req.body;
   let {postID} = req.params;
    try {
      await Postmod.findByIdAndUpdate({_id:postID},{title,body});
      res.send({msg:'post updated'});
    } catch (error) {
      res.send({msg:'error in updation'});
    }
 })

 app.delete('/posts/delete/:postID', auth, author , async(req,res)=>{
   let {postID}=req.params;
   await Postmod.findByIdAndDelete({_id:postID});
   res.send({msg:"post deleted"})
 })


 app.listen(process.env.PORT,()=>{
    connectDb();
    console.log('server running on 7000');
 })