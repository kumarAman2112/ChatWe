export const getSender = (users, loggedUser) => {
  return users[0]?._id === loggedUser?.response?._id
    ? users[1]?.name
    : users[0]?.name;
};
export const getSenderFull = (users, loggedUser) => {
  return users[0]?._id === loggedUser?.response?._id ? users[1] : users[0];
};
export const isSameSender = (messages, msg, i, loggedUserId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== msg.sender._id ||
      messages[i+1].sender._id === undefined)&&msg.sender._id !== loggedUserId
  );
};
export const isLastMessage = (messages, i, loggedUserId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== loggedUserId &&
    messages[messages.length - 1].sender._id
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
