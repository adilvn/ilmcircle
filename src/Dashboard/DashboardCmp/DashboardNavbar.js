import React, { useEffect, useState } from "react";
//------------images--------------------//
import { ReactSVG } from "react-svg";
import logo from "../../asserts/images/logo.svg";
import profile from "../../asserts/images/profile.svg";
import heart from "../../asserts/images/hert.svg";
import notificationIcon from "../../asserts/images/notificationIcon.png";
//-------------libray------------------//
import { Link, NavLink } from "react-router-dom";
import { BsTwitter, BsLinkedin, BsYoutube } from "react-icons/bs";
import { FiInstagram } from "react-icons/fi";
import { BiChevronDown } from "react-icons/bi";
import { GrNotification } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import secureLocalStorage from "react-secure-storage";
import API_Routes from "../../Routes/API_Routes";
import { showMessage } from "../../components/reuseable/Tostify";
import { FaFacebookSquare } from "react-icons/fa";
import { Loader } from "../../components/reuseable/Loader";

//------------components--------------//

const DashboardNavbar = (props) => {
  const role = secureLocalStorage.getItem("role");
  const [imageSecure, setImageSecure] = useState("")
  const [nameSecure, setNameSecure] = useState("")
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [socail, setSocail] = useState();
  const token = secureLocalStorage.getItem("token");
  const [loader, setLoader] = useState(false);
  const [proName, setProName] = useState("");

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setLoader(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://ilmcircle.com/backend/api/user/logout",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200 || result.status == 201) {
          secureLocalStorage.removeItem("token");
          secureLocalStorage.removeItem("id");
          secureLocalStorage.removeItem("image");
          // secureLocalStorage.removeItem("orgImage");
          // secureLocalStorage.removeItem("orgName");
          showMessage(result?.message);
          navigate("/login");
          setLoader(false)
        } else {
          showMessage(result?.message, "error");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const FetchSocalLinks = () => {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(API_Routes.SOCIALLINKS, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200) {
          setSocail(JSON.parse(result?.data[0]?.socialMedia));
        } else {
          showMessage(result?.message, "error");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  const secureName = secureLocalStorage.getItem("name");
  const secureimage = secureLocalStorage.getItem("image");

  useEffect(() => {
    FetchSocalLinks();
    // const img1 = secureLocalStorage.getItem("image");
    // const nam = secureLocalStorage.getItem("name");
    // console.log('Secureimg1', img1)
    // console.log('Securename', nam)


    // // console.log('Securename', nam)
    // // const imageSecure = secureLocalStorage.getItem("orgImage");
    // // const nameSecure = secureLocalStorage.getItem("orgName");
    // // setImageSecure(imageSecure)
    // // setNameSecure(nameSecure)
    // setName(nam);
    // setImage(img1);

  }, []);

  useEffect(() => {
    setName(props?.passName)
  }, [props?.passName])



  // useEffect(() => {
  //   setName(props?.fname)
  // }, [])

  useEffect(() => {
    if (props?.img?.img) {
      if (props?.img?.img != undefined) {
        setImage(props?.img?.img);
      }
      if (props?.img?.name != undefined) {
        setName(props?.img?.name);

      }

    }
  }, [props?.img?.img,]);


  ////langaugechange function///////
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();
  const dat = window.location.pathname.split("/");
  return (
    <div>
      {/* {console.log('name', name)} */}

      <div>
        {loader && <div className="loaderScreen">
          <Loader />
        </div>}
        <nav class="navbar navbar-expand-lg bg-body-tertiary navbarDashboardMain">
          <div class="container-fluid px-4">
            <NavLink class="navbar-brand" to="/">
              <ReactSVG style={{ width: "auto" }} src={logo} />
            </NavLink>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div
              class="collapse navbar-collapse my-1 navbar-links"
              id="navbarSupportedContent"
            >
              <ul class="navbar-nav ms-lg-3 ms-xl-5 me-auto mb-2 mb-lg-0 items">
                {role == "student" ? (
                  <li class="nav-item">
                    <NavLink
                      className={({ isActive, isPending }) =>
                        isPending
                          ? "pending"
                          : isActive
                            ? "activez"
                            : dat[1] == "events-details"
                              ? "activez"
                              : "underline-on-hover"
                      }
                      to="/events"
                    >
                      Event
                    </NavLink>
                  </li>
                ) : (
                  ""
                )}

                <li class="nav-item">
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isPending
                        ? "pending"
                        : isActive
                          ? "activez"
                          : "underline-on-hover"
                    }
                    to="/coming-soon"
                  >
                    Find Teacher
                  </NavLink>
                </li>
                {role === "student" ? (
                  <li class="nav-item">
                    <NavLink
                      className={({ isActive, isPending }) =>
                        isPending
                          ? "pending"
                          : isActive
                            ? "activez"
                            : dat[1] == "find-buddy-details"
                              ? "activez"
                              : "underline-on-hover"
                      }
                      to="/find-buddy"
                    >
                      Find Buddy
                    </NavLink>
                  </li>
                ) : (
                  ""
                )}

                <li class="nav-item">
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isPending
                        ? "pending"
                        : isActive
                          ? "activez"
                          : "underline-on-hover"
                    }
                    to="/contact"
                  >
                    Contact Us
                  </NavLink>{" "}
                </li>
                <div>
                  <ul className="d-flex dashbod-icon mt-1 gap-4 headerIcon">
                    {socail?.map((item, index) => {
                      return (
                        <>
                          {item?.name == "instagram" ||
                            item?.name == "Instagram" ? (
                            <li>
                              <a href={item?.link} target="_blank">
                                <FiInstagram />{" "}
                              </a>
                            </li>
                          ) : item?.name == "linkdin" ||
                            item?.name == "Linkdin" ? (
                            <li>
                              {" "}
                              <a href={item?.link} target="_blank">
                                {" "}
                                <BsLinkedin />
                              </a>
                            </li>
                          ) : item?.name == "facebook" ||
                            item?.name == "Facebook" ? (
                            <li>
                              {" "}
                              <a href={item?.link} target="_blank">
                                {" "}
                                <FaFacebookSquare />
                              </a>
                            </li>
                          ) : // :
                            // item?.name == 'youtube' || item?.name == 'Youtube' ?

                            //   <li>
                            //     {" "}

                            //     <a href={item?.link} target="_blank"><BsYoutube /></a>
                            //   </li>
                            null}

                          {/* <li>
                      <BsTwitter />
                      <a href="#">{t("Twitter")} </a>
                    </li>
                    <li>
                      {" "}
                      <BsLinkedin />
                      <a href="#"> {t("Linkedin")}</a>
                    </li> */}
                        </>
                      );
                    })}
                    {/* <li className="p10 point d-flex align-items-center">
                    <BsTwitter />
                  </li>
                  <li className="p10 point d-flex align-items-center">
                    <BsLinkedin />
                  </li>
                  <li className="p10 point d-flex align-items-center">
                    <FiInstagram />
                  </li> */}
                  </ul>
                </div>
              </ul>

              <div>
                <ul className="d-flex gap-2 align-items-center justify-content-center mb-2 mb-lg-0 items">
                  {role === "student" ? (

                    <li className="point navbarSvg">
                      <Link to={"/my-favorites"}>
                        <ReactSVG className="img-fluid mb-1 mt-1" src={heart} />
                      </Link>
                    </li>
                  ) : ""}
                  <li className="point navbarSvg me-2">
                    <Link
                      to={
                        role == "student"
                          ? "/student-notifications"
                          : "/notification"
                      }
                    >
                      {/* <GrNotification /> */}
                      <img
                        style={{ width: 23, height: 24.38 }}
                        src={notificationIcon}
                        alt="notificationIcon"
                      />
                    </Link>
                  </li>
                  {/* {console.log(imageSecure, secureLocalStorage.getItem('image'))} */}
                  <li>
                    <div class="dropdown">
                      <button class="dropbtn">
                        <img
                          src={
                            role === "student"
                              ? image ? image : secureimage ? secureimage
                                : profile
                              : role === "organization"
                                ? image ? image : secureimage ? secureimage
                                  : profile
                                :
                                profile
                          }
                          className="my-1 rounded-circle me-2"
                          height={36}
                          width={36}
                        />{" "}
                        {role === "student"
                          ? name ? name : secureName ? secureName
                            : "Dummy"
                          : role === "organization"
                          && 'My Profile'
                        }

                        <BiChevronDown
                          className="orange"
                          style={{
                            color: "#F47B00",
                            fontSize: "28px",
                            padding: 0,
                          }}
                        />
                      </button>
                      <div class="dropdown-content">
                        <Link
                          to={
                            role == "student"
                              ? "/Dashboard"
                              : role == "organization"
                                ? "/EditProfile"
                                : ""
                          }
                        >
                          My profile
                        </Link>
                        {role == "student" ? (
                          <Link to="/subscription">Subscription</Link>
                        ) : (
                          ""
                        )}
                        {role == "student" ? (
                          <Link to={`/student-dashboard/${0}`}>My Dashboard</Link>
                        ) : (
                          ""
                        )}
                        {role == "organization" ? (
                          <Link to={`/organization-dashboard/${0}`}>
                            My Dashboard
                          </Link>
                        ) : (
                          ""
                        )}

                        <Link to="/contact">FAQ</Link>
                        <Link to="/about-us">About us</Link>
                        {/* <a href="#">Settings</a> */}

                        <div onClick={() => handleLogout()}>
                          <Link
                            style={{
                              paddingTop: "6px",
                              paddingLeft: "16px",
                              paddingRight: "16px",
                              paddingBottom: "6px",
                              cursor: "pointer",
                            }}
                          >
                            Log out
                          </Link>
                        </div>
                      </div>
                    </div>{" "}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default DashboardNavbar;
