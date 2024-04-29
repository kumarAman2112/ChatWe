import React,{useState} from 'react'
import { ChatState } from '../Context/chatProvider'
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/sideDrawer';
import MyChats from '../components/myChats';
import ChatBox from '../components/chatBox';
const ChatPage = () => {
  const {user}=ChatState();
  const [fetchChatsAgain,setFetchChatsAgain]=useState(false)
  return (
    <div style={{width:'100%'}}>
{user&&<SideDrawer/>}
<Box 
display="flex"
w='100%'
justifyContent="space-between"
h="95.95vh"
p={10}
>
  {user&&<MyChats fetchChatsAgain={fetchChatsAgain} />}
  {user&&<ChatBox fetchChatsAgain={fetchChatsAgain} setFetchChatsAgain={setFetchChatsAgain} />}
</Box>
    </div>
  )
}

export default ChatPage