const indexOrgReducer = (indexOrg = { orgIndex: 0 }, action) => {
  if (action.type == "indexOrg") {
    return action.payload;
  } else if (action.type == "indexOrg") {
    return action.payload;
  } else {
    return indexOrg;
  }
};
export default indexOrgReducer;
