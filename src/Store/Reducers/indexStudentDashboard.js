const indexStudentReducer = (indexStudent = { studIndex: 0 }, action) => {
  if (action.type == "indexStudent") {
    return action.payload;
  } else {
    return indexStudent;
  }
};
export default indexStudentReducer;
