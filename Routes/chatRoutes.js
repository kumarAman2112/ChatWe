const express=require('express');
const router=express.Router();
const Chat=require('../models/chat');
const User=require('../models/user');
const {jwtAuthMiddleware}=require('../jwt');
router.post('/',jwtAuthMiddleware,async(req,res)=>{
    try{
        const {userId}=req.body;
        if(!userId)
        {
            return res.status(400).json({err:"User Id is required"});
        }
        const reqUser=await User.findOne({email:req.user.email});
        const reqUserId=reqUser.id;
        var isChat=await Chat.find(
            {
                isGroupChat:false,
                $and:[{users:{$elemMatch:{$eq:reqUserId}}}
                ,{users:{$elemMatch:{$eq:userId}}}]
            }
        ).populate('users','-password').populate('latestMessage');
        isChat=await User.populate(isChat,{
            path:'latestMessage.sender',
            select:'name email profilePic'
        })
        if(isChat.length>0){
          return  res.status(200).json(isChat[0]);
        }
        else{
            var chatData={
                chatName:'sender',
                isGroupChat:false,
                users:[reqUserId,userId]
            }
        }
        
        const newChat=await Chat.create(chatData);
        const newChatData=await Chat.findById(newChat._id).populate('users','-password')
        res.status(200).json(newChatData);
       }catch(err){
        console.log(err);
        res.status(500).json({err:"Internal Server Error"})
    }
});

router.get('/',jwtAuthMiddleware,async(req,res)=>{
    try{
          const reqUser=await User.findOne({email:req.user.email});
          const reqUserId=reqUser.id;
          var allChats=await Chat.find({users:{$elemMatch:{$eq:reqUserId}}}).populate('users','-password').populate('latestMessage').populate('groupAdmin','-password').sort({updatedAt:-1});
            allChats=await User.populate(allChats,{
                path:'latestMessage.sender',
                select:'name email profilePic'
            })
          res.status(200).json(allChats)
    }catch(err){
        console.log(err);
        res.status(500).json({err:"Internal Server Error"})
    }
});
router.post('/group',jwtAuthMiddleware,async(req,res)=>{
    if(!req.body.users||!req.body.name)
    {
          return res.status(400).json({err:"Users and Name are required"})
    }
     var users=JSON.parse(req.body.users);
     if(users.length<2)
     {
         return res.status(400).json({err:"Group should have atleast 2 users"})
     }
     const reqUser=await User.findOne({email:req.user.email});
     const reqUserId=reqUser.id;
     users.push(reqUserId)
try{
    const groupChat=await Chat.create({
        chatName:req.body.name,
        isGroupChat:true,
        users:users,
        groupAdmin:reqUserId
    })
    const fullGroupChat=await Chat.findById(groupChat.id).populate('users','-password').populate('groupAdmin','-password');
    res.status(200).json(fullGroupChat);

}catch(err){
    console.log(err);
    res.status(500).json({err:"Internal Server Error"})
}
});
router.put('/group/rename',jwtAuthMiddleware,async(req,res)=>{
try{
    const {chatId,chatName}=req.body
    const updatedChat=await Chat.findByIdAndUpdate(chatId,{chatName},{new:true}).populate('users','-password').populate('groupAdmin','-password');
    res.status(200).json(updatedChat);
}catch(err){
    console.log(err);
    res.status(500).json({err:"Internal Server Error"})
}
});
router.put('/group/addUser',jwtAuthMiddleware,async(req,res)=>{
    try{
        const {chatId,userId}=req.body;
        const addedUser=await Chat.findByIdAndUpdate(chatId,{$push:{users:userId}},{new:true}).populate('users','-password').populate('groupAdmin','-password');
        res.status(200).json(addedUser);
    }catch(err){
        console.log(err);
        res.status(500).json({err:"Internal Server Error"})
    }
});
router.put('/group/removeUser',jwtAuthMiddleware,async(req,res)=>{
    try{
          const {chatId,userId}=req.body;
            const removedUser=await Chat.findByIdAndUpdate(chatId,{$pull:{users:userId}},{new:true}).populate('users','-password').populate('groupAdmin','-password');
            res.status(200).json(removedUser);
    }catch(err){
        console.log(err);
        res.status(500).json({err:"Internal Server Error"})
    }
});
module.exports=router;
