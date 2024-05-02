import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
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
            {(isSameSender(messages,msg,ind, user?.response._id)
            ) ? (
              <Avatar

                mt={3}
                mr={1}
                size="sm"
                cursor="pointer"
                name={msg.sender.name}
                src={msg.sender.profilePic}
                maxWidth='75%'
              />
            ):<></>}
            <span
              style={{
                backgroundColor: `${
                  msg.sender._id === user?.response._id ? "#1C6DD0" : "#E8EAE6"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                color: `${
                  msg.sender._id === user?.response._id ? "white" : "black"
                }`,
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
