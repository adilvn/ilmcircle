import React, { useEffect } from "react";
import "../about/about.css";
import { useTranslation } from "react-i18next";
//--------------svg library--------------------//
import { ReactSVG } from "react-svg";

//-------------components---------------------//
import Header from "../../layout/Header";
import main from "../../asserts/images/quran.svg";
import PeopleSection from "../../components/reuseable/PeopleSection";
import Footer from "../../layout/Footer";
import API_Routes from "../../Routes/API_Routes";
import { useState } from "react";
import axios from "axios";
import { showMessage } from "../../components/reuseable/Tostify";
import { Loader } from "../../components/reuseable/Loader";
import DashboardNavbar from "../../Dashboard/DashboardCmp/DashboardNavbar";
import secureLocalStorage from "react-secure-storage";

const About = () => {
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();
  const [data, setData] = useState()
  const [loader, setLoader] = useState(false);

  const FetchAboutUSData = () => {
    setLoader(true)
    const formdata = new FormData();

    const axiosConfig = {
      method: 'get',
      url: API_Routes.ABOUTUS,
    };

    axios(axiosConfig)
      .then(response => {
        if (response.status == 200) {
          setData(response.data.data[0])
          setLoader(false)

        } else {
          showMessage(response?.message)
          setLoader(false)

        }

      })
      .catch(error => {
        console.error('Error:', error);
        setLoader(false)

      });
  }

  useEffect(() => {
    FetchAboutUSData()
  }, [])
  const token = secureLocalStorage.getItem('token')

  return (
    <>
      {loader &&
        <div className="loaderScreen">
          <Loader />
        </div>}
      <section>
        {token ? <DashboardNavbar /> : <Header />}
        <div className="container ">
          <div className="row main-about d-flex justify-content-center text-center">
            <div className="main-col aboutUsPara">
              <h6 className="px-sm-0 px-3">{data?.heading}</h6>
              <p className="mt-4 px-sm-0 px-3 " >
                {/* <p >{data?.title}</p> */}
                {/* <p className="mt-4">
                  {" "}
                  At IlmCircle, our mission is to bring the ummah together by
                  connecting, learning, and sharing. We are a dedicated platform
                  for learning Quran and Arabic, connecting Muslims around the
                  world.
                </p> */}
                <p dangerouslySetInnerHTML={{ __html: data?.description }} />
                {/* <p className="mt-4">
                  Our user-friendly platform is designed to provide you with a
                  seamless learning experience. We believe in the power of
                  peer-to-peer learning, fostering a strong community that
                  supports and encourages each other.
                </p>
                <p className="mt-4">
                  Join us on this enriching journey of knowledge and growth.
                </p>
                <p>-The IlmCircle Team</p> */}
              </p>
            </div>
          </div>
          <div className="row">
            <div className=" main-col-two">
              {data?.image?.url && <img style={{ objectFit: "covver" }} src={data?.image?.url} alt="data" className="img-fluid px-5" />}
            </div>
          </div>
        </div>
      </section>
      <div className="mb-text">
        <PeopleSection title={data?.title} />
      </div>

      <Footer />
    </>
  );
};

export default About;
