export const messageReducer = (messages = [], action) => {
  if (action.type == "userMessages") {
    return action.payload;
  } else {
    return messages;
  }
};
export const userReducer = (users = [], action) => {
  if (action.type == "messageUser") {
    return action.payload;
  } else {
    return users;
  }
};

export const conversationReducer = (conversations = [], action) => {
  if (action.type == "conversations") {
    return action.payload;
  } else {
    return conversations;
  }
};
export const socketReducer = (socket = null, action) => {
  if (action.type == "sockets") {
    return action.payload;
  } else {
    return socket;
  }
};
export const typingReducer = (typing = {}, action) => {
  if (action.type == "typing") {
    return action.payload;
  } else {
    return typing;
  }
};
export const modalReducer = (data = {}, action) => {
  if (action.type == "modalData") {
    return action.payload;
  } else {
    return data;
  }
};
