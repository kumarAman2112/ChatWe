import React, { useState } from "react";
import { ViewIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, IconButton, Spinner, useToast } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { FormControl } from "@chakra-ui/react";
import { ChatState } from "../Context/chatProvider";
import UserBadgeItem from "./userBadgeItem";
import UserListItem from "./userListItem";
const UpdateGroupChatModal = ({ fetchChatsAgain, setFetchChatsAgain,fetchAllMessages }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoadingChat] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user, selectedChat, setSelectedChat } = ChatState();
  const handleRemove =async (u) => {
    if (!u) return;
  if(selectedChat.groupAdmin._id!==user?.response._id&&user?.response._id!==u._id)
  {
    toast({
        title: "Only admin can remove users from the group",
        status: "error",
        duration: 1000,
        isClosable: true,
        position: "top-center",
    })
    return;
  }
  setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } =await axios.put(
        "/api/chat/group/removeUser",
        { chatId: selectedChat._id, userId: u._id},
        config
      );
       u._id===user?.response._id ? setSelectedChat() :setSelectedChat(data);
        setFetchChatsAgain(!fetchChatsAgain);
        fetchAllMessages();
        toast(
            {
                title: "User removed from the group",
                status: "success",
                duration: 1000,
                isClosable: true,
                position: "top-center",
            }
        )
        setLoading(false);
    } catch (err) {
      toast({
        title: "Failed to remove the user",
        status: "error",
        duration: 1000,
        isClosable: true,
        position: "top-center",
      });
      return;
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoadingChat(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/group/rename",
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );
      setSelectedChat(data);
      setFetchChatsAgain(!fetchChatsAgain);
      setRenameLoadingChat(false);
    } catch (err) {
      toast({
        title: "Failed to rename the Group",
        status: "error",
        duration: 1000,
        isClosable: true,
        position: "top-center",
      });
      return;
    }
  };
  const handleSearch = async (searchQuery) => {
    setSearch(searchQuery);
    if (!searchQuery) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResults(data);
      setLoading(false);
    } catch (err) {
      toast({
        title: "Failed to search the user",
        status: "error",
        duration: 1000,
        isClosable: true,
        position: "top-center",
      });
      return;
    }
  };
  const handleAddUser = async (u) => {
        if(!u)return
        if(selectedChat.users.find(user=>user._id===u._id))
        {
            toast({
                title: "User already in the group",
                status: "error",
                duration: 1000,
                isClosable: true,
                position: "top-center",
            })
            return;
        }
        if(selectedChat.groupAdmin._id!==user?.response._id)
        {
toast({
    title: "Only admin can add users to the group",
    status: "error",
    duration: 1000,
    isClosable: true,
    position: "top-center",

})
return ;
        }
        try{
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}=await axios.put('/api/chat/group/addUser',{chatId:selectedChat._id,userId:u._id},config);
            setSelectedChat(data);
            setFetchChatsAgain(!fetchChatsAgain);
            toast({
                title: "User added to the group",
                status: "success",
                duration: 1000,
                isClosable: true,
                position: "top-center",
            })
        }catch(err){
            toast({
                title: "Failed to add the user",
                status: "error",
                duration: 1000,
                isClosable: true,
                position: "top-center",
            })
            return;
        }
    }
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        onClick={onOpen}
        icon={<ViewIcon />}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="auto">
          <ModalHeader
            fontSize="30px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
            textAlign="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <Box display="flex" flexDir="row" mb={3} flexWrap="wrap">
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={4}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={2}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl display="flex">
              <Input
                placeholder="Add User to group"
                mb={2}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner />
            ) : (
              <>
                {searchResults?.slice(0, 3).map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleAddUser(u)}
                  />
                ))}
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={()=>handleRemove(user.response)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
