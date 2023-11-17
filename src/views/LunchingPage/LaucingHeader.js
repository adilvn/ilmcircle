import React, { useState } from "react";
//------------images--------------------//
import { ReactSVG } from "react-svg";
import logo from "../../asserts/images/logo.svg";

//-------------libray------------------//
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { CiGlobe } from "react-icons/ci";
import Languageoption from "../../components/language/Languageoption";

//------------components--------------//

const LauchingHeader = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    ////langaugechange function///////
    const { t, i18n } = useTranslation();
    document.body.dir = i18n.dir();
    const handleClick = (e) => {
        i18next.changeLanguage(e.target.value)
    }
    return (
        <>
            <nav class="navbar navbar-expand-lg">
                <div class="container-fluid px-4 py-3">
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
                                <NavLink className={({ isActive, isPending }) =>
                                    isPending ? "pending" : isActive ? "activez" : "underline-on-hover"
                                } to='/prices'>{'Pricing'}</NavLink>
                            </li>


                            <li class="nav-item">
                                <NavLink className={({ isActive, isPending }) =>
                                    isPending ? "pending" : isActive ? "activez" : "underline-on-hover"
                                } to='/about-us'>{'About Us'}</NavLink>
                            </li>

                            <li class="nav-item">
                                <NavLink className={({ isActive, isPending }) =>
                                    isPending ? "pending" : isActive ? "activez" : "underline-on-hover"
                                } to='/contact'>{'Contact'}
                                </NavLink>
                            </li>
                        </ul>
                        <ul className='homeNavbarEnd'>

                            <li className='icon-globel nav-item'>
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

export default LauchingHeader;
