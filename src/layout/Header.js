import React, { useState } from "react";
//------------images--------------------//
import { ReactSVG } from "react-svg";
import logo from "../asserts/images/logo.svg";
import profile from "../asserts/images/profile.svg";
import heart from "../asserts/images/hert.svg";

//-------------libray------------------//
import { Link, NavLink } from "react-router-dom";
import { BsTwitter, BsLinkedin } from "react-icons/bs";
import { CiGlobe } from "react-icons/ci";
import { BiChevronDown } from "react-icons/bi";
import { GrNotification } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

//------------components--------------//
import Button from "../components/reuseable/Button";
import Languageoption from "../components/language/Languageoption";
import secureLocalStorage from "react-secure-storage";
import { showMessage } from "../components/reuseable/Tostify";
import { Loader } from "../components/reuseable/Loader";

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  const token = secureLocalStorage.getItem("token");
  const role = secureLocalStorage.getItem("role");
  const [loader, setLoader] = useState(false);

  ////langaugechange function///////
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();
  const handleClick = (e) => {
    i18next.changeLanguage(e.target.value);
  };
  // const handleLogout = () => {
  //   secureLocalStorage.removeItem("token");
  //   secureLocalStorage.removeItem("id");
  //   secureLocalStorage.removeItem("image");
  //   navigate("/login");
  // };
  const handleNaviagte = () => {
    navigate(role == "student" ? "/student-dashboard" : role == "organization" ? "/organization-dashboard" : "")

  }


  const handleLogout = () => {
    setLoader(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);


    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("https://ilmcircle.com/backend/api/user/logout", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status == 200 || result.status == 201) {
          secureLocalStorage.removeItem("token");
          secureLocalStorage.removeItem("id");
          secureLocalStorage.removeItem("image");
          showMessage(result?.message);
          navigate("/login");

        } else {
          showMessage(result?.message, "error");
        }
      })
      .catch((error) => {
        // setLoader(false);
        console.log("error", error);
      });
  }


  return (
    <>
      <nav class="navbar navbar-expand-lg">
        {loader && (
          <div className="loaderScreen">
            <Loader />
          </div>
        )}
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
            <ul class="navbar-nav  me-auto mb-2 mb-lg-0 items headerItems">
              <li class="nav-item">
                <NavLink
                  className={({ isActive, isPending }) =>
                    isPending
                      ? "pending"
                      : isActive
                        ? "activez"
                        : "underline-on-hover"
                  }
                  to="/prices"
                >
                  {"Pricing"}
                </NavLink>
              </li>

              <li class="nav-item">
                <NavLink
                  className={({ isActive, isPending }) =>
                    isPending
                      ? "pending"
                      : isActive
                        ? "activez"
                        : "underline-on-hover"
                  }
                  to="/about-us"
                >
                  {"About Us"}
                </NavLink>
              </li>

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
                  {"Contact Us"}
                </NavLink>
              </li>
            </ul>
            <ul className="homeNavbarEnd">
              {!token ? (
                <>
                  <li className="nav-item">
                    <NavLink to="/login">{"Log in"}</NavLink>
                  </li>

                  <li className="nav-item">
                    <Button
                      data={"Sign up"}
                      class={"HeaderBtn"}
                      onClick={() => navigate("/signup")}
                    ></Button>
                  </li>
                </>
              ) : (
                <div className="d-flex aligin-items-center">
                  <li className="nav-item">
                    <Button
                      data={"Logout"}
                      class={"HeaderBtn"}
                      onClick={handleLogout}
                    ></Button>
                  </li>
                </div>
              )}

              <li className="icon-globel nav-item">
                <CiGlobe />
                <Languageoption onChange={(e) => handleClick(e)} />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
