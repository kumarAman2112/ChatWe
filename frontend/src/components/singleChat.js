import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/chatProvider";
import {
  Text,
  Box,
  IconButton,
  Spinner,
  FormControl,
  Input,
  useToast,
  
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../chatLogics";
import ProfileModal from "./profileModal";
import UpdateGroupChatModal from "./updateGroupChatModal";
import axios from "axios";
import io from "socket.io-client";
import ScrollableChat from "./scollableChat";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;
const SingleChat = ({ fetchChatsAgain, setFetchChatsAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { user, selectedChat, setSelectedChat,notifications,setNotifications } = ChatState();
  const toast = useToast();

  const fetchAllMessages = async () => {
    try {
      if (!selectedChat) return;
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch the Messages",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });
  },
   []);

  useEffect(() => {
    fetchAllMessages();
    selectedChatCompare = selectedChat;
   
  }, [selectedChat]);
  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        //give notification
        if(!notifications.includes(newMessageReceived)){
        setNotifications([ newMessageReceived, ...notifications]);
         setFetchChatsAgain(!fetchChatsAgain);
        }
      }else
        setMessages([...messages, newMessageReceived]);
    });
  });


  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          { content: newMessage, chatId: selectedChat._id },
          config
        );
      
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to send the  Message",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return;
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if(!socketConnected)return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime=new Date().getTime()
    var timerLength=3000;
    setTimeout(()=>{
  var timeNow=new Date().getTime();
  var timeDiff=timeNow-lastTypingTime
  if(timeDiff>=timerLength && typing){
    socket.emit('stop typing',selectedChat._id)
    setTyping(false)
  }
    },timerLength)
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "32px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat(null)}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(selectedChat.users, user)}
                <ProfileModal u={getSenderFull(selectedChat.users, user)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchChatsAgain={fetchChatsAgain}
                  setFetchChatsAgain={setFetchChatsAgain}
                  fetchAllMessages={fetchAllMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            w="100%"
            h="100%"
            
            flexDir="column"
            justifyContent="flex-end"
            overflowY="hidden"
            p={3}
           
          >
            {loading ? (
              <Spinner
                size="xl"
                w={16}
                h={16}
                alignSelf="center"
                margin="auto"
                color="teal"
              />
            ) : (
              <>
                <div style={{display:'flex',flexDirection:'column',overflowY:'scroll',scrollbarWidth:'none'}}>
                  <ScrollableChat messages={messages} />
                </div>
              </>
            )}
            <FormControl onKeyDown={sendMessage} mt={3} isRequired>
            {isTyping?('Loading.....'):(<></>)}
              <Input
                value={newMessage}
                placeholder="Enter your message...."
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          w="100%"
          h="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          fontSize="3xl"
          pb={3}
          fontFamily="Work sans"
        >
          <Text>Click on any user to start Chat</Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
