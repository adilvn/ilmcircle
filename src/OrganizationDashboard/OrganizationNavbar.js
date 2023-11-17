import React, { useState } from "react";
//------------images--------------------//
import { ReactSVG } from "react-svg";
import logo from "../asserts/images/logo.svg";
import rectangle2 from "../asserts/images/Rectangle3.png";
import heart from "../asserts/images/hert.svg";

//-------------libray------------------//
import { Link, NavLink } from "react-router-dom";
import { BsTwitter, BsLinkedin } from "react-icons/bs";
import { FiInstagram } from "react-icons/fi";
import { BiChevronDown } from "react-icons/bi";
import { GrNotification } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"
import secureLocalStorage from "react-secure-storage";
import i18next from "i18next";

//------------components--------------//

const OrganizationNavbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  ////langaugechange function///////
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();
  const role = secureLocalStorage.getItem("role");

  return (
    <>
      <nav class="navbar navbar-expand-lg bg-body-tertiary navbarDashboardMain ">
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
              <li class="nav-item">
                <NavLink
                  className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "activez" : ""
                  }
                  to="/events"
                >
                  Events
                </NavLink>
              </li>
              {/* <li class="nav-item">
                <NavLink
                  className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "activez" : ""
                  }
                  to="/find-buddy"
                >
                  Find Buddy
                </NavLink>
              </li> */}

              <li class="nav-item">
                <NavLink
                  className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "activez" : ""
                  }
                  to="/contact"
                >
                  Contact Us
                </NavLink>{" "}
              </li>
              <div>
                <ul className="d-flex dashbod-icon">
                  <li className="p10 point d-flex align-items-center">
                    <BsTwitter />
                  </li>
                  <li className="p10 point d-flex align-items-center">
                    <BsLinkedin />
                  </li>
                  <li className="p10 point d-flex align-items-center">
                    <FiInstagram />
                  </li>
                </ul>
              </div>

            </ul>


            <div>
              <ul className="d-flex align-items-center justify-content-center mb-2 mb-lg-0 items">
              {role === "student" ? (

               <li className="point navbarSvg">
                  <Link to={'/my-favorites'}>
                    <ReactSVG className="img-fluid mb-1 mt-1" src={heart} />
                  </Link>
                </li> 
              ): ""}
                <li className="point navbarSvg me-2">
                  <Link to={'/notification'}>
                    <GrNotification />
                  </Link>
                </li>
                <li>
                  <div class="dropdown">
                    <button class="dropbtn " style={{ padding: '5px 10px' }}>
                      {/* <ReactSVG src={rectangle2} /> Mariam{" "} */}
                      <img width={40} height={40} src={rectangle2} alt="" /> &nbsp;&nbsp; My Profile{" "}
                      <BiChevronDown
                        style={{ color: "red", fontSize: "25px" }}
                      />
                    </button>
                    <div class="dropdown-content" >
                      <Link to="/Myprofile">My profile</Link>
                      {/* <Link to="/subscription">Subscription</Link> */}
                      <Link>Settings</Link>
                      <Link>FAQ</Link>
                      <Link to={'/about-us'}>About us</Link>
                      <Link to={"/"}>Log out</Link>
                    </div>
                  </div>{" "}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default OrganizationNavbar;
