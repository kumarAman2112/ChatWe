import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../chatLogics";
import { ChatState } from "../Context/chatProvider";
import { Avatar } from "@chakra-ui/react";
const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((msg, ind) => (
          <div key={msg._id} style={{ display: "flex",alignItems:'center'}}>
            {(isSameSender(messages, msg, ind, user?.response.id)||isLastMessage(messages, ind, user?.response.id)
            ) && (
              <Avatar
              
                mt={3}
                mr={1}
                size="sm"
                cursor="pointer"
                name={msg.sender.name}
                src={msg.sender.profilePic}
                maxWidth='75%'
              />
            )}
            <span
              style={{
                backgroundColor: `${
                  msg.sender._id === user?.response._id ? "#D4E7C5" : "#AAD7D9"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                marginLeft: isSameSenderMargin(
                  messages,
                  msg,
                  ind,
                  user?.response._id
                ),
                marginTop: isSameUser(messages, msg, ind) ? 3 : 10,
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
