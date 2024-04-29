import { CloseIcon } from '@chakra-ui/icons'
import {Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user,handleFunction}) => {
  return (
   <Box 
   px={1}
   py={2}
   borderRadius='lg'
   variant='solid'
   fontSize='12px'
   cursor='pointer'
    m={1}
    mb={2}
    bg='purple'
    color='white'
   >
    {user.name}
    <CloseIcon onClick={handleFunction} fontSize={12} pl={1}/>
   </Box>
  )
}

export default UserBadgeItem