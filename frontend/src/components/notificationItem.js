import React from 'react'
import { Box,Text } from '@chakra-ui/react'
import { getSender } from '../chatLogics'
import { ChatState } from '../Context/chatProvider'
import { toUpper } from 'lodash'
const NotificationItem = ({notif,notificationHandler}) => {
    const {user} = ChatState()
  return (
   <Box
   onClick={notificationHandler}
   >
    <Text>
    {notif.chat.isGroupChat
    ? `New Message in ${notif.chat.chatName}`
    : `New Message from ${toUpper(
        getSender(notif.chat.users, user)
      )}`}
    </Text>
   </Box>
  )
}

export default NotificationItem
