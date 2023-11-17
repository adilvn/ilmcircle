export const orgDashboardIndex = ({ orgIndex, item }) => {
  return (dispatch) => {
    dispatch({
      type: "indexOrg",
      payload: { orgIndex, item },
    });
  };
};

export const studDashboardIndex = (studIndex) => {
  return (dispatch) => {
    dispatch({
      type: "indexStudent",
      payload: studIndex,
    });
  };
};

export const setGoalTaskData = (value) => {
  return { type: "tasks", payload: value };
};

export const setAyat = (value) => {
  return { type: "ayat", payload: value };
};
export const setMessages = (value) => {
  return { type: "userMessages", payload: value };
};
export const setSockets = (value) => {
  return { type: "sockets", payload: value };
};
export const setUsers = (value) => {
  return { type: "messageUser", payload: value };
};
export const setConversations = (value) => {
  return { type: "conversations", payload: value };
};
export const setTyping = (value) => {
  return { type: "typing", payload: value };
};
export const setModalData = (value) => {
  return { type: "modalData", payload: value };
};
