const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {jwtAuthMiddleware,generateToken}=require('../jwt');
router.post('/signup', async (req, res) => {
    try{
         const userData=req.body;
         const userExists=await User.findOne({email:userData.email});
         if(userExists){
                return res.status(400).json({err:"User already exists"});
         }
         const newUser=new User(userData);
         const response=await newUser.save();
         const token=await generateToken({email:userData.email,password:userData.password});
         res.status(200).json({response:response,token:token});
    }catch(err){
        console.log(err);
        res.status(500).json({err:"Internal Server Error"})
    }
});
router.post("/login",async(req,res)=>{
    try{
         const {email,password}=req.body;
         const user=await User.findOne({email:email});
         if(!user)
            {
                return res.status(400).json({err:"User not found"});
            }
            const isPasswordMatch=await user.comparePassword(password);
            if(!isPasswordMatch)
            {
                return res.status(400).json({err:"Invalid Password"});
            }
            const token=await generateToken({email:email,password:password});
            res.status(200).json({response:user,token:token});
    }catch(err)
    {
        console.log(err);
        res.status(500).json({err:"Internal Server Error"})
    }
})
// "/api/user?search=xyz"
router.get("/",jwtAuthMiddleware,async(req,res)=>{
    try{
         const keyword=req.query.search ? {$or:[{name:{$regex:req.query.search,$options:'i'}},{email:{$regex:req.query.search,$options:'i'}}]} : {};
             
            const users=await User.find(keyword).find({email:{$ne:req.user.email}});
            res.status(200).json(users);
         
    }catch(err){
        console.log(err);
        res.status(500).json({err:"Internal Server Error"})
    }
})
module.exports=router