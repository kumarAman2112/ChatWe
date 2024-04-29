import React,{useEffect, useState} from 'react'
import { ChatState } from '../Context/chatProvider';
import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './chatLoading';
import {getSender} from '../chatLogics';
import GroupChatModal from './groupChatModal';
const MyChats = ({fetchChatsAgain}) => {
  const [loggedUser,setLoggedUser]=useState()
  const {user,setSelectedChat,selectedChat,chats,setChats}=ChatState();
  const toast=useToast() 
  const fetchChats=async()=>{
    try{
          const config={
            headers:{
              Authorization:`Bearer ${user.token}`
            }
          }
          const {data}=await axios.get("/api/chat/",config)
          
          setChats(data)
    }catch(err)
    {
      toast({
        title:"unable to fetch chats",
        status:"error",
        duration:2000,
        isClosable:true,
        position:"top-left"
      })
     return;
    }
  }
  useEffect(()=>{
setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
fetchChats()
  },[fetchChatsAgain])
  return (
   <Box 
   display={{base:selectedChat?"none":"flex",md:"flex"}}
   flexDirection='column'
   justifyContent='space-between'
   alignItems='center'
   p={3}
   bg='white'
   w={{base:"100%",md:"32%"}}
   borderRadius='lg'
   borderWidth='1px'
   >
<Box
pb={3}
px={3}
fontSize={{base:"28px",md:"30px"}}
fontFamily="Work sans"
display='flex'
width='100%'
justifyContent='space-between'
alignItems='center'
>
My chats
<GroupChatModal>
<Button
display='flex'
fontSize={{base:"17px",md:"10px",lg:"17px"}}
rightIcon={<AddIcon/>}
>New Group</Button>
</GroupChatModal>
</Box>
<Box display='flex' flexDir='column' p={3} bg="white" w='100%' h='100%' borderRadius='lg' overflowY='hidden' >
{chats?(<Stack  overflowY='scroll'>
  {chats.map((chat)=><Box
  key={chat._id}
  onClick={()=>setSelectedChat(chat)}
  px={3}
  py={2}
  fontWeight={600}
  bg={selectedChat===chat?"#38B2AC":"#F6F6F6"}
  color={selectedChat===chat?"white":"black"}
  borderRadius='lg'
  cursor='pointer'
  >
    {!chat.isGroupChat?(getSender(chat?.users,loggedUser)):chat.chatName}
  </Box>)}
</Stack>):<ChatLoading/>}
</Box>
   </Box>
  )
}

export default MyChats;