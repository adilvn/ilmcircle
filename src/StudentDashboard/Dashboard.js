import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Header from "../layout/Header";
import "../StudentDashboard/students.css";
import calender from "../asserts/images/calender.png";
import eventClass from "../asserts/images/EventClass.png";
import task from "../asserts/images/task.png";
import contact from "../asserts/images/contact.png";
import message from "../asserts/images/message.png";
import myDashboard from "../asserts/images/myDashboard.png";

import DashboardNavbar from "../Dashboard/DashboardCmp/DashboardNavbar";
import MyDashboard from "./SidebarContent/MyDashboard";
import Calendar from "./SidebarContent/Calendar";
import EventsClass from "./SidebarContent/EventsClass";
import GoalTask from "./SidebarContent/GoalTask";
import Contact from "./SidebarContent/Contact/Contact";
import Messages from "./SidebarContent/Chat/Messages";

import activeCalender from "../asserts/images/activeCalendar.png";
import activeEventClass from "../asserts/images/activeEventClass.png";
import activeTask from "../asserts/images/activeTask.png";
import activeContact from "../asserts/images/activeContact.png";
import activeMessage from "../asserts/images/activeMessage.png";
import activeMyDashboard from "../asserts/images/activeMyDashboard.png";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreaters } from "../Store/Index";
import secureLocalStorage from "react-secure-storage";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import OrgContacts from "../OrganizationDashboard/OrgSidebarContent/Contacts/OrgContacts";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function StudentDashboard() {
  const role = secureLocalStorage.getItem("role");
  const navigate = useNavigate();
  useEffect(() => {
    if (role != "student") {
      navigate("/")
    }

  }, [])


  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(0);
  const dispatch = useDispatch();
  const { studDashboardIndex } = bindActionCreators(actionCreaters, dispatch);

  const indexStudent = useSelector((state) => state.studentIndex);
  const Userrole = secureLocalStorage.getItem("role");

  // const handleItemClick = (index) => {
  //   setSelectedItem(index);
  //   studDashboardIndex({ studIndex: index });
  // };

  const handleItemClick = (index) => {
    navigate(`/student-dashboard/${index}`);
    // studDashboardIndex({ studIndex: index });
  };


  const paramsIndex = window.location.pathname;
  const parts = paramsIndex.split('/');
  const indexParam = parts[parts.length - 1];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const location = useLocation();


  useEffect(() => {
    const { goto } = location?.state || {};
    if (goto) {
      navigate(`/student-dashboard/${JSON.parse(goto)}`);

    }

  }, [])

  return (
    <>
      {role == "student" ?
        <div className="DashboardMainContainer">
          <div style={{ position: "relative", zIndex: 9999 }}>
            <DashboardNavbar />
          </div>
          <Box sx={{ display: "flex" }}>
            {/* <CssBaseline /> */}

            <Drawer variant="permanent" open={open}>
              <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === "rtl" ? (
                    <ChevronRightIcon />
                  ) : (
                    <ChevronLeftIcon />
                  )}
                </IconButton>
              </DrawerHeader>
              <Divider />
              <List
                onMouseEnter={() => handleDrawerOpen()}
                onMouseLeave={() => handleDrawerClose()}
              >
                {[
                  {
                    text: "My Dashboard",
                    activeIcon: activeMyDashboard,
                    defaultIcon: myDashboard,
                  },
                  { text: "Calendar", activeIcon: calender, defaultIcon: calender },
                  {
                    text: "Event and class",
                    activeIcon: eventClass,
                    defaultIcon: eventClass,
                  },
                  { text: "My goal and task", activeIcon: task, defaultIcon: task },
                  { text: "Contact", activeIcon: contact, defaultIcon: contact },
                  { text: "Messages", activeIcon: message, defaultIcon: message },
                ].map(({ text, activeIcon, defaultIcon }, index) => (
                  <ListItem key={text} disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      onClick={() => handleItemClick(index)}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                        // backgroundColor: selectedItem === index ? '#F6E5CF' : 'transparent', // Set the text color to 'red' for active item, or 'inherit' to use default color
                      }}
                      className={`${JSON.parse(indexParam) === index ? "bgDashColor" : ""}`}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        {JSON.parse(indexParam) === index ? (
                          <img src={activeIcon} alt="icon" width={26} height={26} />
                        ) : (
                          <img
                            src={defaultIcon}
                            alt="icon"
                            width={20}
                            height={20}
                          />
                        )}
                      </ListItemIcon>
                      {/* <div className='activebackgroundColor'> */}
                      <ListItemText
                        primary={
                          <div
                            className={
                              JSON.parse(indexParam) === index
                                ? "inActivebackgroundColor"
                                : "inActivebackgroundColor"
                            }
                          >
                            {text}
                          </div>
                        }
                        sx={{
                          opacity: open ? 1 : 0,
                        }}
                      />
                      {/* </div> */}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Drawer>
          </Box>
          <div>
            {/* Render content based on the selected item */}
            {JSON.parse(indexParam) === 0 && (
              <div>
                <MyDashboard />
              </div>
            )}
            {JSON.parse(indexParam) === 3 && (
              <div>
                <GoalTask />
              </div>
            )}
            {JSON.parse(indexParam) === 2 && (
              <div>
                <EventsClass />
              </div>
            )}
            {JSON.parse(indexParam) === 1 && (
              <div>
                <Calendar />
              </div>
            )}
            {Userrole == "student" ? JSON.parse(indexParam) === 4 && (
              <div>
                <Contact />
              </div>
            ) :
              (
                <div>
                  <OrgContacts />
                </div>
              )

            }
            {JSON.parse(indexParam) === 5 && (
              <div>
                <Messages role={"student"} />
              </div>
            )}
          </div>
        </div>
        : ""
      }
    </>
  );
}
