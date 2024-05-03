const express=require('express');
const { jwtAuthMiddleware } = require('../jwt');
const User = require('../models/user');
const Chat = require('../models/chat');
const Message = require('../models/message');
const router=express.Router();
router.post('/',jwtAuthMiddleware,async(req,res)=>{
    try{
        const {content,chatId}=req.body;
        if(!content || !chatId)
        {
            return res.status(400).send("Bad Request");
        }
        const reqUser=await User.findOne({email:req.user.email});
        var newMessage={
            sender:reqUser._id,
            content:content,
            chat:chatId
        }
        var resMessage=await Message.create(newMessage);
        resMessage=await resMessage.populate('sender','name profilePic');
        resMessage=await resMessage.populate('chat');
        resMessage=await User.populate(resMessage,{
            path:'chat.users',
            select:'name profilePic email'
    });
    await Chat.findByIdAndUpdate(chatId,{
        latestMessage:resMessage,
    })
    res.status(201).json(resMessage);

    }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
})

router.get('/:chatId',jwtAuthMiddleware,async(req,res)=>{
      try{
            const message=await Message.find({chat:req.params.chatId}).populate('sender','name profilePic email').populate('chat');
            res.status(200).json(message);
      }catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
      }
})
    
module.exports=router