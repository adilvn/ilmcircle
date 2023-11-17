import React, { useEffect, useState } from "react";
import Home from "../src/views/home/Home";
import About from "../src/views/about/About";
import Contact from "../src/views/contact/Contact";
import Prices from "../src/views/prices/Prices";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import ThankYou from "./Auth/ThankYou";
import Orgnaization from "./Auth/Orgnaization";
import Teacher from "./Auth/Teacher";
import Scroll from "./components/cmp/Scroll";
import Forgetpassword from "./Auth/Forgetpassword";
import Dashboard from "./Dashboard/Dashboard";
import Events from "../src/Dashboard/DashboardPages/Events";
import FindBuddy from "../src/Dashboard/DashboardPages/FindBuddy/FindBuddy";
import EventDetails from "./Dashboard/DashboardPages/EventDetails";
import Checkout from "./views/Checkout/CheckoutScreen";
import { Subscription } from "./Dashboard/DashboardPages/Subscription/Subscription";
import Favorites from "./views/MyFavorites/Favorites";
import { IslamicCulture } from "./Dashboard/DashboardPages/Islamic-Culture/IslamicCulture";
import LunchingPage from "./views/LunchingPage/LunchingPage";
import StudentDashboard from "./StudentDashboard/Dashboard";
import OrgDashboard from "./OrganizationDashboard/OrgDashboard";
import { OrgMyEvents } from "./OrganizationDashboard/OrgSidebarContent/OrgMyEvents/OrgMyEvents";
import { Notification } from "./OrganizationDashboard/OrgSidebarContent/Notification/Notification";
import OrganizationDetail from "./OrganizationDashboard/OrgSidebarContent/Organization-Details/OrganizationDetail";
import OrganizationProfile from "./OrganizationDashboard/OrgSidebarContent/organizationprofile/OrganizationProfile";
import OrganizationEditProfile from "./OrganizationDashboard/OrgSidebarContent/organizationeditprofile/OrganizationEditProfile";
import { OrgReviewsFeedback } from "./OrganizationDashboard/OrgSidebarContent/OrgReviewsAndFeedback/OrgReviewsFeedback";
import FindBuddyDetails from "./Dashboard/DashboardPages/FindBuddydetails/FindBuddyDetails";
import CommingSoon from "./components/CommingSoon/ComingSoon";
import CheckMailConfirmation from "./Auth/CheckMailConfirmation";
import ResetPassword from "./Auth/ResetPassword";
import ContactThankYou from "./Auth/ContactThankYou";
import { setModalData, setSockets, setTyping, setUsers } from "./Store/Actions";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import secureLocalStorage from "react-secure-storage";
import Page404 from "./views/nointernet/Page404";
import PrivatePolicy from "./layout/PrivatePolicy";
import TermsOfService from "./layout/TermsOfService";
import HelpCenter from "./layout/HelpCenter";
import CustomModal from "./components/reuseable/model";
import { StuNotifications } from "./StudentDashboard/Notification/StuNotifications";
import { getFirebaseToken, messag } from "./Cloud";
import { getToken, getMessaging, onMessage } from "firebase/messaging";
import { showMessage } from "./components/reuseable/Tostify";
import ring from "./asserts/images/vido/ring.mp3";
import image from "./asserts/images/nointernet404/NoInternetAvaliable.png"

const App = () => {
  const [user, setuser] = useState(secureLocalStorage.getItem("id"));
  const [role, setRole] = useState();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const dispatch = useDispatch();
  const socket = useSelector((state) => state.sockets);
  let modalData = useSelector((state) => state.modalData);
  const allowedRoutes = [
    '/',
    '/launching-page',
    '/about-us',
    '/contact',
    '/prices',
    '/checkout',
    '/subscription',
    '/login',
    '/signup',
    '/page',
    '/private-policy',
    '/terms-of-services',
    '/help-center',
    '/thank-you',
    '/teacher',
    '/coming-soon',
    "/forget-password",
    "/confirm-email",
    "/reset-password"
  ];

  useEffect(() => {
    dispatch(
      setSockets(
        io("https://ilmcircle.com", {
          path: "/backend",
        })
      )
    );
    // dispatch(setSockets(io("http://ilmcircle.com:8080")));
  }, []);

  const token = secureLocalStorage.getItem("token");

  const [statusMessage, setStatusMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    try {
      socket?.emit("addUser", user);
      socket?.on("getUsers", (users) => {
        dispatch(setUsers(users));
      });

      let typingTimeout = null;
      socket?.on("typing", (data) => {
        dispatch(setTyping(data));
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }
        typingTimeout = setTimeout(() => {
          dispatch(setTyping({}));
        }, 3000);
      });

      // socket?.on("messageDelivered", (messageId) => {

      //   updateMessageStatus(messageId, "delivered");
      // });

      // socket?.on("messageRead", (messageId) => {
      //   updateMessageStatus(messageId, "read");
      // });
    } catch (error) {
      console.log(error);
    }
  }, [socket]);

  const accessToken = secureLocalStorage.getItem("token");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await getFirebaseToken();
        if (accessToken) {
          verifyNotificationToken(token);
        }
      } catch (err) {
        console.log("An error occurred while retrieving token. ", err);
      }
    };

    const verifyNotificationToken = async (token) => {
      // console.log('generatedToken===>', generateToken)
      var myHeaders = new Headers();

      myHeaders.append("Authorization", "Bearer " + accessToken);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        "https://ilmcircle.com/backend/api/user/token/" + token,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.status == 200 || result.status == 201) {
          } else {
            showMessage(result?.message, "error");
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    };

    checkToken();

    const handleForegroundMessage = (payload) => {
      const {
        notification: { title, body },
        data,
      } = payload;
      if (title === "Incoming Call") {
        handleIncomingCallNotification({ title, body, data });
      }
    };
    onMessage(messag, handleForegroundMessage);
  }, []);

  useEffect(() => {
    if (!token && !allowedRoutes.includes(location.pathname)) {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + token);
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        "https://ilmcircle.com/backend/api/student/allevents",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result?.status === 401) {
            setStatusMessage(result.message);
            openModal(true);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, [location.pathname, token]);
  const handleIncomingCallNotification = (notification) => {
    const { title } = notification;

    if (title === "Incoming Call") {
      dispatch(setModalData({ notification, showModal: true, isModal: true }));
      const gcmDataJson = notification.data["gcm.notification.data"];
      const gcmData = JSON.parse(gcmDataJson);
      if (gcmData?.path == "/student-dashboard/5") {
        setRole("student");
      } else {
        setRole("organization");
      }

      navigate(gcmData?.path);
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showMessage("Welcome back! You are now online.");
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div>
        <div className='container'>
          <div className='row '  >
            <div className='col-12 d-flex justify-content-center'>
              <img

                style={{ height: "100%", width: "50%", objectFit: "cover" }}
                src={image}
                alt="No InterNet" />
            </div>
          </div>
          <div className="row align-items-center">
            <h2 className="d-flex justify-content-center">No Internet </h2>
            <h2 className="d-flex justify-content-center text-center">Check your connection and try again! </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        {isModalOpen && (
          <CustomModal title={statusMessage} onClose={closeModal} />
        )}
      </div>
      {modalData?.showModal && (
        <div>
          <audio
            style={{ display: "none" }}
            controls
            autoPlay
            onPlay={() => console.log("Audio is playing")}
            onPause={() => console.log("Audio is paused")}
          >
            <source src={ring} type="audio/mpeg" />
          </audio>
        </div>
      )}

      <Scroll />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/launching-page' element={<LunchingPage />} />
        <Route path='/about-us' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/prices' element={<Prices />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/subscription' element={<Subscription />} />
        <Route path='/my-favorites' element={<Favorites />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/page' element={<ThankYou />} />
        <Route path='/thank-you' element={<ContactThankYou />} />

        <Route path='/orgnaization' element={<Orgnaization />} />
        <Route path='/teacher' element={<Teacher />} />
        <Route path='/forget-password' element={<Forgetpassword />} />
        <Route path='/confirm-email' element={<CheckMailConfirmation />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/events' element={<Events />} />
        <Route path='/islamic-culture/:id' element={<IslamicCulture />} />
        <Route path='/events-details/:id/:userId' element={<EventDetails />} />
        <Route
          path='/student-dashboard/:index'
          element={<StudentDashboard />}
        />
        <Route path='/organization-dashboard/:id' element={<OrgDashboard />} />
        <Route path='/organization-events' element={<OrgMyEvents />} />
        <Route path='/find-buddy-details/:id' element={<FindBuddyDetails />} />
        <Route path='/private-policy' element={<PrivatePolicy />} />
        <Route path='/terms-of-services' element={<TermsOfService />} />
        <Route path='/help-center' element={<HelpCenter />} />
        <Route path='/notification' element={<Notification />} />
        <Route path='/student-notifications' element={<StuNotifications />} />

        <Route path='/coming-soon' element={<CommingSoon />} />

        <Route path='/reviews-feedback' element={<OrgReviewsFeedback />} />

        {/* <Route path='/find-teacher' element={<FindTeacher/>} />
        <Route path='/teacher-details/:id' element={<TeacherDetails/>} /> */}

        <Route path='/find-buddy' element={<FindBuddy />} />
        <Route path='/organization-details' element={<OrganizationDetail />} />
        <Route exact path='/Myprofile' element={<OrganizationProfile />} />
        <Route
          exact
          path='/EditProfile'
          element={<OrganizationEditProfile />}
        />

        <Route path='*' element={<Page404 />} />
      </Routes>
    </>
  );
};

export default App;
