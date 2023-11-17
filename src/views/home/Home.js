import React, { useState } from "react";
import "../home/home.css";
import { Element, scroller } from 'react-scroll';
// ---------------------constant---------------------//
import { sectionOne } from "../../constant/Constant";

// ---------------------components---------------------//
import Header from "../../layout/Header";
import Button from "../../components/reuseable/Button";
import LeftSection from "../../components/reuseable/LeftSection";
import RightSection from "../../components/reuseable/RightSection";
import Testimonel from "../../components/sliders/Testimonel";
import Footer from "../../layout/Footer";

// ---------------------librarys---------------------//
import { ReactSVG } from "react-svg";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// ---------------------Images---------------------//
import myimg from "../../asserts/images/homeOurMission.png";
import left from "../../asserts/images/left.svg";
import right from "../../asserts/images/right.svg";
import leftqoutes from "../../asserts/images/left quote.svg";
import rightqoutes from "../../asserts/images/right quote.svg";
import RightOurMissionSection from "../../components/reuseable/RightOurMissionSection";
import PeopleSection from "../../components/reuseable/PeopleSection";
import { useEffect } from "react";
import { Loader } from "../../components/reuseable/Loader";
import { showMessage } from "../../components/reuseable/Tostify";
import API_Routes from "../../Routes/API_Routes";
import axios from "axios";

const Home = () => {
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();
  const scrollToSection = (sectionId) => {
    scroller.scrollTo(sectionId, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
    });
  };
  const [homeData, setHomeData] = useState([]);
  const [bannerData, setBannerData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [orgData, setOrgData] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [ourMission, setOutMission] = useState([]);
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [testimonialsheading, setTestimonialsheading] = useState([]);

  const [loader, setLoader] = useState(false);
  const [data, setData] = useState()


  const navigate = useNavigate();

  useEffect(() => {
    GetHomeData()
  }, [])


  const GetHomeData = () => {
    setLoader(true)
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch("https://ilmcircle.com/backend/api/page/home", requestOptions)
      .then(response => response.json())
      .then(result => {

        if (result.status == 200 || result.status == 201) {
          setLoader(false)
          const bannerData = result?.data?.filter((item) => item?.key == 'banner');
          setBannerData(bannerData)

          const stud_Data = result?.data?.filter((item) => item?.key == 'studentData');
          setStudentData(stud_Data)

          const org_Data = result?.data?.filter((item) => item?.key == 'organizationData');
          setOrgData(org_Data)


          const teacherData = result?.data?.filter((item) => item?.key == 'teacherData');
          setTeacherData(teacherData)
          const missionData = result?.data?.filter((item) => item?.key == 'missionSection');
          setOutMission(missionData)

          const testimo_Data = result?.data?.filter((item) => item?.key == 'customerData');
          setTestimonialsData(testimo_Data)


          const testimo_header = result?.data?.filter((item) => item?.key == 'customerHeader');
          setTestimonialsheading(testimo_header)
          // console.log('testimo_Data--->', testimo_Data)

        } else {
          setLoader(false)
          showMessage(result?.message)
        }

      })
      .catch(error => {
        setLoader(false)
        console.log('error', error)
      });
  }


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


  return (
    <>
      {/* {console.log('bannerData--->', cc)} */}
      {/* ///////// heroSection////////// */}
      {loader && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}

      <section className="container-fluid bg-img">
        <Header />
        <main className="container-fluid">
          <div className="row main-hero">
            <div className="box-1 ">
              {/* <ReactSVG className="img-fluid" src={left} /> */}
              {bannerData[0]?.banner?.leftImage?.url && <img style={{ width: 276, height: 280 }} className="img-fluid" src={bannerData[0]?.banner?.leftImage?.url} alt="img1" />}
            </div>
            <div className="box-2 ">
              <div className="content homecontent">
                <h6 className="home-heading">
                  {bannerData[0]?.banner?.title}
                  {/* Connecting <br />
                  <span>Hearts & Minds </span>
                  <br />
                  Through Quran */}
                </h6>

                <p className="mt-4">
                  {/* Connecting Hearts, Inspiring Minds */}
                  {bannerData[0]?.banner?.description}

                </p>
                <div className="btn-group">
                  {/* <a href={"#stud"}> */}

                  <Button
                    onClick={() => scrollToSection('stud')}
                    data={bannerData[0]?.banner?.firstBtnText}

                    class={"main-btn-1"}
                  ></Button>
                  {/* </a> */}
                  <Link to={bannerData[0]?.banner?.secondBtnLink.startsWith('/') ? bannerData[0]?.banner?.secondBtnLink : `/${bannerData[0]?.banner?.secondBtnLink}`}>
                    <Button
                      data={bannerData[0]?.banner?.secondBtnText}
                      class={"main-btn-2"}
                    ></Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="box-3 ">
              {bannerData[0]?.banner?.rightImage?.url && <img style={{ width: 276, height: 280 }} className="img-fluid" src={bannerData[0]?.banner?.rightImage?.url} alt="img1" />}

            </div>
          </div>
        </main>
      </section>
      {/* ///////// heroSection end ////////// */}

      {/* /////////Section one///////// */}
      {/* fluid ok  */}
      <Element className="container-fluid" id="stud">
        <LeftSection
          key2={studentData[0]?.key}
          head={studentData[0]?.studentData?.icon?.url}
          title={studentData[0]?.studentData?.title}
          para={studentData[0]?.studentData?.description}
          btnTitle={studentData[0]?.studentData?.btnText}
          img={studentData[0]?.studentData?.image?.url}
          btnLink={studentData[0]?.studentData?.btnLink}
          route="/"
          goto=""

        />
      </Element>

      {/* ////////section two ////// */}
      {/* fluid ok  */}
      <section className=" bg-right-color image-margin">
        <section className="container-fluid">
          <RightSection
            data={orgData}
          />
        </section>
      </section>

      {/* ///////////section three ////// */}
      {/* fluid ok  */}
      <section className="container-fluid py-4 margin-top-left-right">
        <LeftSection
          key2="teacher"
          head={teacherData[0]?.teacherData?.icon?.url}
          title={teacherData[0]?.teacherData?.title}
          para={teacherData[0]?.teacherData?.description}
          btnTitle={teacherData[0]?.teacherData?.btnText}
          img={teacherData[0]?.teacherData?.image?.url}
          btnLink=""
          route=""
          goto="/coming-soon"




        />
      </section>



      {/* ///////// section four //////// */}
      {/* fluid ok  */}
      <section className="container-fluid image-margin mt-5">

        <RightOurMissionSection
          data={ourMission}

        />

      </section>
      <div></div>

      {/* ////////////section four testimonal /////////// */}
      <section className="pb-60  image-margin">
        <div className="container-fluid">
          <div className="px-md-5 px-3">

            <div className="content-slider">
              <h6 className="sliderHeading6">{testimonialsheading[0]?.ourCustomer?.title}</h6>
              <p className="f-16 ">{testimonialsheading[0]?.ourCustomer?.description}</p>
            </div>
            <div className="qoutes-main">
              <div className="left-qoutes">
                <ReactSVG className="img-fluid" src={leftqoutes} />
              </div>
              <div className="right-qoutes">
                <ReactSVG className="img-fluid" src={rightqoutes} />
              </div>
              <Testimonel data={testimonialsData} />
            </div>
          </div>
        </div>
      </section>


      {/* ////////////section five /////////// */}

      <section className="container-fluid  ">
        <section >
          <div className="container ">
            <div className="row people-mainHome margin-170">
              <div className='bg-pinkHome'></div>
              <div className='people-box '>
                <div className="d-flex justify-content-center">
                  <h6 style={{ width: 470, }}>{data?.title}</h6>
                </div>
                <Button data={'Sign up'} class={'profile-btn people-btn'} onClick={() => navigate('/signup')}>  </Button>
              </div>
            </div>
          </div>
        </section>
      </section>


      {/* ////////////////footer ////////////////// */}
      <Footer />
    </>
  );
};

export default Home;


