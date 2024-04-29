const express=require('express');
const app=express();
const db=require('./db');
const {notFound}=require('./Middlewares/errorMiddleware');
const userRoutes=require('./Routes/userRoutes');
const chatRoutes=require('./Routes/chatRoutes');
const messageRoutes=require('./Routes/messageRoutes');
const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(express.json());
require('dotenv').config();
const PORT=process.env.PORT;
app.use("/api/user",userRoutes)
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes)
app.use(notFound);
const server=app.listen(PORT,()=>{console.log(`Server is running on port ${PORT}`)});
const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:'http://localhost:3000'
    }
});
io.on('connection',(socket)=>{

    console.log('connected to socket.io');
    socket.on('setup',(userData)=>{

        socket.join(userData.response._id)
        console.log('user',userData.response._id);
        socket.emit('connected');
    })

    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log('user joined room'+room);
    })

socket.on('typing',(room)=>socket.in(room).emit('typing'))
socket.on('stop typing',(room)=>socket.in(room).emit('stop typing'))


   socket.on('new message',(newMessageReceived)=>{
    var chat=newMessageReceived.chat;
    if(!chat.users) return console.log('Chat.users not defined');
    chat.users.forEach(user=>{
        if(user._id == newMessageReceived.sender._id) return;
        socket.in(user._id).emit('message received',newMessageReceived);
    
   })
})

socket.off('setup',()=>{
    console.log('user Disconnected')
    socket.leave(userData.response._id)
})
})