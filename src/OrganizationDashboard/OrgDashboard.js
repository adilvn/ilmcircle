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
import libraryIcon from "../asserts/images/libraryIconOrg.png";
import analyticsIcon from "../asserts/images/analyticsIconOrg.png";
import VacancyVolunteerIcon from "../asserts/images/VacancyVolunteerIconOrg.png";
import reviewFeedbackIcon from "../asserts/images/reviewFeedbackIcon.png";
import activeAnalyticsIcon from "../asserts/images/activeAnalyticsIcon.png";
import activeFeedbackIcon from "../asserts/images/activeFeedbackIcon.png";
import activeVacancyIcon from "../asserts/images/activeVacancyIcon.png";
import projectsIcon from "../asserts/images/icons.svg";

import ReviewsFeedbackIcon from "../asserts/images/reviewsFeedbackIconOrg.png";

import contactsIcon from "../asserts/images/contactsIconOrg.png";

import DashboardNavbar from "../Dashboard/DashboardCmp/DashboardNavbar";
import orgMyDashboard from "./OrgSidebarContent/OrgMyDashboard/orgMyDashboard";
import OrgCalender from "./OrgSidebarContent/OrgCalender/OrgCalender";
import MyClass from "./OrgSidebarContent/OrgMyClass/MyClass";
import OrgMyStudent from "./OrgSidebarContent/OrgMyStudent/OrgMyStudent";

import Analatics from "./OrgSidebarContent/OrgAnalytics/Analatics";
import { OrgReviewsFeedback } from "./OrgSidebarContent/OrgReviewsAndFeedback/OrgReviewsFeedback";
import OrgContact from "./OrgSidebarContent/OrgContacts/OrgContact";
import OrgMessage from "./OrgSidebarContent/OrgMessages/OrgMessage";

import activeCalender from "../asserts/images/activeCalendar.png";
import activeEventClass from "../asserts/images/activeEventClass.png";
import activeTask from "../asserts/images/activeTask.png";
import activeContact from "../asserts/images/activeContact.png";
import activeMessage from "../asserts/images/activeMessage.png";
import activeLibraryIcon from "../asserts/images/activeLibraryIcon.png";

import activeMyDashboard from "../asserts/images/activeMyDashboard.png";

import MyStudent from "./OrgSidebarContent/OrgMyStudent/OrgMyStudent";
import { OrgLibrary } from "./OrgSidebarContent/OrgLibrary/OrgLibrary";

import { OrgMyEvents } from "./OrgSidebarContent/OrgMyEvents/OrgMyEvents";
import VacancyVolunteer from "./OrgSidebarContent/Vacancy&Volunteer/VacancyVolunteer";
import OrgDashboardMain from "./OrgSidebarContent/OrgMyDashboard/OrgDashboardMain";
import OrgMyEventDetails from "./OrgSidebarContent/OrgMyEvents/OrgMyEventDetails";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { actionCreaters } from "../Store/Index";
import { bindActionCreators } from "redux";
import ContentMain from "./OrgSidebarContent/Vacancy&Volunteer/Content&Contributor/ContentMain";
import CreateNewVacancy from "./OrgSidebarContent/Vacancy&Volunteer/CreateNewVacancy";
import { AllProjects } from "./OrgSidebarContent/orgProjects/AllProjects";
import { CreateNewProject } from "./OrgSidebarContent/orgProjects/CreateNewProject";
import { ExistProjects } from "./OrgSidebarContent/orgProjects/ExistProjects";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import OrgContacts from "./OrgSidebarContent/Contacts/OrgContacts";

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

export default function OrganizationDashboard() {
  const role = secureLocalStorage.getItem("role");
  const navigate = useNavigate();

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(0);
  const location = useLocation();
  const dispatch = useDispatch();
  const { orgDashboardIndex } = bindActionCreators(actionCreaters, dispatch);
  // const handleItemClick = (index) => {
  //   // setSelectedItem(index);
  //   // orgDashboardIndex(index);
  //   orgDashboardIndex({ orgIndex: index });
  // };

  const handleItemClick = (index) => {
    navigate(`/organization-dashboard/${index}`);
    // orgDashboardIndex({ orgIndex: index });
  };
  const paramsIndex = window.location.pathname;
  const parts = paramsIndex.split('/');
  const indexParam = parts[parts.length - 1];


  useEffect(() => {
    const { goto } = location?.state || {};
    if (goto) {
      navigate(`/organization-dashboard/${JSON.parse(goto)}`)
    }

  }, [])

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const indexstate = useSelector((state) => state.selectedIndex);

  const handleDrawerClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (role != "organization") {
      navigate("/")
    }
    const data = location.state;
    if (data) {
      setSelectedItem(data);
    }
  }, []);
  return (
    <>
      {role == "organization" ?
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
                    defaultIcon: activeMyDashboard,
                  },
                  {
                    text: "My events",
                    activeIcon: eventClass,
                    defaultIcon: eventClass,
                  },
                  {
                    text: "Library",
                    activeIcon: libraryIcon,
                    defaultIcon: libraryIcon,
                  },
                  {
                    text: "Analytics",
                    activeIcon: analyticsIcon,
                    defaultIcon: analyticsIcon,
                  },
                  {
                    text: "Vacancies & Volunteers",
                    activeIcon: VacancyVolunteerIcon,
                    defaultIcon: VacancyVolunteerIcon,
                  },
                  {
                    text: "Reviews and Feedback",
                    activeIcon: reviewFeedbackIcon,
                    defaultIcon: reviewFeedbackIcon,
                  },
                  {
                    text: "Projects & Fund Raising",
                    activeIcon: projectsIcon,
                    defaultIcon: projectsIcon,
                  },
                  {
                    text: "Contact",
                    activeIcon: contactsIcon,
                    defaultIcon: contactsIcon,
                  },
                  {
                    text: "Messages",
                    activeIcon: message,
                    defaultIcon: message,
                  },
                ].map(({ text, activeIcon, defaultIcon }, index) => (
                  <ListItem key={text} disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      onClick={() => handleItemClick(index)}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                        backgroundColor:
                          JSON.parse(indexParam) === index ? "#F6E5CF" : "transparent", // Set the text color to 'red' for active item, or 'inherit' to use default color
                      }}
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
                <OrgDashboardMain />
              </div>
            )}
            {JSON.parse(indexParam) === 1 && (
              <div>
                <OrgMyEvents />
              </div>
            )}
            {JSON.parse(indexParam) === 2 && (
              <div>
                <OrgLibrary />
              </div>
            )}
            {JSON.parse(indexParam) === 3 && (
              <div>
                <Analatics />
              </div>
            )}

            {JSON.parse(indexParam) === 4 && (
              <div>
                <VacancyVolunteer />
              </div>
            )}

            {JSON.parse(indexParam) === 5 && (
              <div>
                <OrgReviewsFeedback />
              </div>
            )}
            {JSON.parse(indexParam) === 6 && (
              <div>
                <AllProjects />
              </div>
            )}
            {JSON.parse(indexParam) === 7 && (
              <div>
                <OrgContacts />
              </div>
            )}

            {JSON.parse(indexParam) === 8 && (
              <div>
                <OrgMessage />
              </div>
            )}
            {JSON.parse(indexParam) === 9 && (
              <div>
                <OrgMyEventDetails />
              </div>
            )}
            {JSON.parse(indexParam) === 10 && (
              <div>
                <OrgReviewsFeedback />
              </div>
            )}
            {JSON.parse(indexParam) === 11 && (
              <div>
                <ContentMain />
              </div>
            )}
            {JSON.parse(indexParam) === 12 && (
              <div>
                <CreateNewVacancy />
              </div>
            )}
            {JSON.parse(indexParam) === 13 && (
              <div>
                <CreateNewProject />
              </div>
            )}
            {JSON.parse(indexParam) === 14 && (
              <div>
                <ExistProjects />
              </div>
            )}
          </div>
        </div>
        : ""
      }
    </>
  );
}



