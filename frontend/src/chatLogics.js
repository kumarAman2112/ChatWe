export const getSender = (users, loggedUser) => {
  return users[0]?._id === loggedUser?.response?._id
    ? users[1]?.name
    : users[0]?.name;
};
export const getSenderFull = (users, loggedUser) => {
  return users[0]?._id === loggedUser?.response?._id ? users[1] : users[0];
};
export const isSameSender = (messages,msg,ind,loggedUserId) => {
  return (
   msg.sender._id!==loggedUserId && (ind===messages.length-1 ||(ind<messages.length-1 && messages[ind+1].sender._id!==msg.sender._id) )
  );
};

export const isSameSenderMargin = (messages, msg, i, loggedUserId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === msg.sender._id &&
    msg.sender._id !== loggedUserId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== msg.sender._id &&
      messages[i].sender._id !== loggedUserId) ||
    (i === messages.length - 1 && messages[i].sender._id !== loggedUserId)
  )
    return 0;
  else return "auto";
};
export const isSameUser = (messages, msg, i) => {
  return i > 0 && messages[i - 1].sender._id === msg.sender._id;
};
