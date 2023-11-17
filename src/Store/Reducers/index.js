import { combineReducers } from "redux";
import indexOrgReducer from "./indexOrgDashboard";
import indexStudentReducer from "./indexStudentDashboard";
import { AyatData, goalTaskReducers } from "./OrganizationDashboard";
import {
  conversationReducer,
  messageReducer,
  modalReducer,
  socketReducer,
  typingReducer,
  userReducer,
} from "./message";

export const reducer = combineReducers({
  selectedIndex: indexOrgReducer,
  studentIndex: indexStudentReducer,
  goalTask: goalTaskReducers,
  Ayat: AyatData,
  messages: messageReducer,
  sockets: socketReducer,
  users: userReducer,
  conversations: conversationReducer,
  typing: typingReducer,
  modalData: modalReducer,
});
