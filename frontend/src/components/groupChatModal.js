import React,{useState} from 'react'
import { useDisclosure } from '@chakra-ui/hooks'
import { Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody,ModalFooter,Button, useToast, FormControl, Input, Spinner, Box } from '@chakra-ui/react';
import { ChatState } from '../Context/chatProvider';
import axios from 'axios';
import UserListItem from './userListItem';
import UserBadgeItem from './userBadgeItem';
const GroupChatModal = ({children}) => {
    const {user,chats,setChats}=ChatState();
    const {isOpen,onOpen,onClose}=useDisclosure();
    const [groupChatName,setGroupChatName]=useState('')
    const [selectedUsers,setSelectedUsers]=useState([])
    const [search,setSearch]=useState('')
    const [searchResults,setSearchResults]=useState([])
    const [loading,setLoading]=useState(false)
    const toast=useToast()

    const handleSearch=async(searchQuery)=>{
        setSearch(searchQuery)
        if(!searchQuery)
        {
            return;
        }
        try{
                 setLoading(true)
                 const config={
                    headers:{
                        Authorization:`Bearer ${user.token}`
                    }
                 }
                 const {data}=await axios.get(`/api/user?search=${search}`,config)
                 console.log("search data",data)
                    setSearchResults(data)
                    setLoading(false)
        }catch(err)
        {
            toast({
                title:"Failed to load search results",
                status:"error",
                duration:2000,
                isClosable:true,
                position:"top-left"
            })
            setLoading(false)
        return;
        }
    }
    const handleSubmit=async()=>{
   if(!groupChatName || !selectedUsers)
   {
         toast({
              title:"Please fill all the fields",
              status:"warning",
              duration:1000,
              isClosable:true,
              position:"top-center"
         })
         return;
    
   }
   try{
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        }
        const {data}=await axios.post('/api/chat/group',{name:groupChatName,users:JSON.stringify(selectedUsers)},config)
        setChats([data,...chats])
        onClose()
        toast({
            title:"Group chat created successfully",
            status:"success",
            duration:2000,
            isClosable:true,
            position:"top-center"
        })
   }catch(err){
         toast({
              title:"Failed to create group chat",
              status:"error",
              duration:2000,
              isClosable:true,
              position:"top-left"
         })
         return;
   }
    }
    const handleGroup=(user)=>{
        if(selectedUsers.includes(user))
        {
            toast({
                title:"User already added to the group chat",
                status:"warning",
                duration:1000,
                isClosable:true,
                position:"top-center"
            })
            return;
        
        }
        setSelectedUsers([...selectedUsers,user])
    }
    const handleDelete=(user)=>{
        setSelectedUsers(selectedUsers.filter(u=>u._id!==user._id))
    }
  return (
    <>
    <span onClick={onOpen}>{children}</span>
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h="auto">
          <ModalHeader fontSize='40px' fontFamily='Work sans' display='flex' justifyContent='center' textAlign='center' mt={2}>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDirection='column'  alignItems='center'>
           <FormControl>
            <Input placeholder='Chat Name' mb={4}  onChange={(e)=>setGroupChatName(e.target.value)}/>
           
           </FormControl>
           <FormControl>
            <Input placeholder='Add Users e.g: Jane,Doe,Mike' mb={2}  onChange={(e)=>handleSearch(e.target.value)}/>
           </FormControl>
           
           {loading?<Spinner/>:searchResults?.slice(0,3).map((u)=><UserListItem key={u._id} user={u} handleFunction={()=>handleGroup(u)}/>)}
         <Box w='100%' display='flex' flexDirection='row' flexWrap='wrap' >
         {selectedUsers?.map((u)=><UserBadgeItem  key={u._id} user={u} handleFunction={()=>handleDelete(u)} />)}
            </Box>  
       
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='green' mr={3} onClick={handleSubmit}>
              Create Chat 
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal