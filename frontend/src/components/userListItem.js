import { Avatar, Box,Text } from '@chakra-ui/react'
import React from 'react'

const UserListItem = ({user,handleFunction}) => {
  return (
    <Box 
    onClick={handleFunction}
    cursor='pointer'
    bg='#E8E8E8'
    _hover={{bg:'#38B2AC',color:'white'}}
    display='flex'
    justifyContent='space-between'
    alignItems='center'
    width='100%'
    color='black'
    px={3}
    py={2}
    mb={2}
    borderRadius='lg'
    >
<Avatar mr={2} size='sm' cursor='pointer' name={user.name} src={user.profilePic}/>
<Box>
    <Text>{user.name}</Text>
    <Text fontSize='xs'><b>Email:</b>{user.email}</Text>
</Box>
    </Box>
  )
}

export default UserListItem