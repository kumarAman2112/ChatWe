import React from 'react'
import { ViewIcon } from '@chakra-ui/icons';
import { useDisclosure } from '@chakra-ui/hooks'
import { IconButton } from '@chakra-ui/button'
import { Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody,ModalFooter,Button,Image,Text } from '@chakra-ui/react';
import { ChatState } from '../Context/chatProvider';


const ProfileModal = ({children,u}) => {
    const {user}=ChatState();
    const {isOpen,onOpen,onClose}=useDisclosure();
  return (
    <>
    {
    children ? (<span  onClick={onOpen} >{children}</span>):(
    <IconButton 
    display={{base:'flex'}}
    icon={<ViewIcon/>}
    onClick={onOpen}
      />
    )
    }
     <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h="380px">
          <ModalHeader fontSize='40px' fontFamily='Work sans' display='flex' justifyContent='center' textAlign='center'>{u?u.name:user.response.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDirection='column' justifyContent='space-between' alignItems='center'>
            <Image 
             borderRadius='50%'
             boxSize='150px'
             src={u?u.profilePic:user.response.profilePic}
            />
            <Text>{u?u.email:user.response.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='green' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal