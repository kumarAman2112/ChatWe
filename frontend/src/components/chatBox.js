import React from 'react'
import { ChatState } from '../Context/chatProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from './singleChat';
const ChatBox = ({fetchChatsAgain,setFetchChatsAgain}) => {
  const {selectedChat}=ChatState()
  return (
    <Box
     display={{base:selectedChat ? "flex":"none", md:"flex"}}
     alignItems='center'
     flexDir='column'
     p={3}
     ml={2}
     bg='white'
     w={{base:"100%",md:"68%"}}
     borderRadius='lg'
     borderWidth='1px'
    >
  <SingleChat fetchChatsAgain={fetchChatsAgain} setFetchChatsAgain={setFetchChatsAgain} />
    </Box>
  )
}

export default ChatBox;