import React from "react";

//------------library---------------------//
import { ReactSVG } from "react-svg";
import { FiInstagram } from "react-icons/fi";
import { BsTwitter, BsLinkedin, BsYoutube } from "react-icons/bs";
import { FaFacebookSquare } from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
//-------------images----------------------//
import logo from "../asserts/images/logo.svg";
import secureLocalStorage from "react-secure-storage";
import API_Routes from "../Routes/API_Routes";
import { useEffect } from "react";
import { useState } from "react";

const Footer = () => {
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();

  const [socail, setSocail] = useState()
  const navigate = useNavigate()
  const token = secureLocalStorage.getItem('token')

  const FetchSicalLinks = () => {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(API_Routes.SOCIALLINKS, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status == 200) {
          setSocail(JSON.parse(result?.data[0]?.socialMedia))
        }
      })
      .catch(error => console.log('error', error));
  }

  useEffect(() => {
    FetchSicalLinks()
  }, [])

  return (
    <>
      <footer className="container-fluid footer-color px-0">
        <div className="px-22  container">
          <div className="px-lg- p-0 footer-style">
            <div className="fot">
              <Link to="/">
                {" "}
                <ReactSVG src={logo} className="mt-2" />
              </Link>
              <p className="pb-0 mt-4">{"© 2023 Ilm Circle."}</p>
              <p className="pt-0"> {"All Rights Reserved."}</p>
            </div>
            <div className="fot">
              <strong className="str-height">{"Explore IIm Circle"}</strong>
              <ul className="mt-4">
                <li>
                  <Link to="/prices">{"Pricing"} </Link>
                </li>
                <li>
                  <Link to="/about-us">{"About us"} </Link>
                </li>
                <li>
                  <Link to="/contact"> {"Contact"}</Link>
                </li>
              </ul>
            </div>
            <div className="fot">
              <strong className="str-height">{"Follow us"} </strong>
              <ul className="icon-fot mt-4">
                {socail?.map((item) => {
                  return <>
                    {item?.name == 'instagram' || item?.name == 'Instagram' ?

                      <li>
                        <FiInstagram /> <a href={item?.link} target="_blank">{item?.name}</a>
                      </li>
                      // :
                      // item?.name == 'twitter' || item?.name == 'Twitter' ?
                      //   <li>
                      //     <BsTwitter />
                      //     <a href={item?.link} target="_blank">{t("Twitter")}  </a>
                      //   </li>
                      :
                      item?.name == 'linkdin' || item?.name == 'Linkdin' ?
                        <li>
                          {" "}
                          <BsLinkedin />
                          <a href={item?.link} target="_blank"> {item?.name}</a>
                        </li>
                        :

                        item?.name == 'facebook' || item?.name == 'Facebook' ?
                          <li>
                            {" "}
                            <FaFacebookSquare />
                            <a href={item?.link} target="_blank"> {item?.name}</a>
                          </li>
                          // :
                          // item?.name == 'youtube' || item?.name == 'Youtube' ?

                          //   <li>
                          //     {" "}
                          //     <BsYoutube />
                          //     <a href={item?.link} target="_blank"> {item?.name}</a>
                          //   </li>
                          :
                          null


                    }

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
                })}
              </ul>
            </div>
            <div className="fot">
              <strong className="str-height">{"Resources"}</strong>
              <ul className="mt-4">
                <li>

                  <Link to="/private-policy"> {"Privacy Policy"}</Link>
                </li>
                <li>
                  <Link to="/terms-of-services"> {"Terms of Service"}</Link>

                </li>
                <li>
                  <Link to="/help-center"> {"Help Center"}</Link>

                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;


