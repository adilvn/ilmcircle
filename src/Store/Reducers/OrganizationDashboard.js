export const goalTaskReducers = (data = [], action) => {
  if (action.type == "tasks") {
    return action.payload;
  } else {
    return data;
  }
};


export const AyatData = (data = [], action) => {
  if (action.type == "ayat") {
    return action.payload;
  } else {
    return data;
  }
};



