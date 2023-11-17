import React, { useState } from "react";
import "./buddydetails.css";

//------------library-------------------------//
import { useParams } from "react-router-dom";

//---------------dummay-data--------------------//
import { buddyData } from "../../../constant/DummayBuddy";
import { Element, scroller } from "react-scroll";
//---------------------components---------------------//
import DashboardNavbar from "../../DashboardCmp/DashboardNavbar";
import Footer from "../../../layout/Footer";
import LikeButton from "../../DashboardCmp/Likebutton";
import Rating from "../../../components/reuseable/Rating";
import Button from "../../../components/reuseable/Button";

//-------------images-------------------------//
import download from "../../../asserts/images/download.svg";
import { ReactSVG } from "react-svg";
import RangeInput from "../../DashboardCmp/RangeInput";
import Availbility from "../../DashboardCmp/Availbility/Availbility";
import RangeSliderMui from "./RangeSliderMui";
import lectureImg1 from "../../../asserts/images/lectureImg1.png";
import lectureImg2 from "../../../asserts/images/lectureImg2.png";
import { showMessage } from "../../../components/reuseable/Tostify";
import API_Routes, { url } from "../../../Routes/API_Routes";
import { Loader } from "../../../components/reuseable/Loader";
import secureLocalStorage from "react-secure-storage";
import { useEffect } from "react";
import moment from "moment";
import Availbility2 from "../../DashboardCmp/Availbility/Availbility2";
import maleBuddy from "../../../asserts/images/maleBuddy.png"
import femaleBuddy from "../../../asserts/images/femaleBuddy.png"

const FindBuddyDetails = () => {
  const [rate, setRate] = useState(3);
  const [items, setItems] = useState([]);
  const [mem, setMem] = useState();
  const [loader, setLoader] = useState(false);
  const token = secureLocalStorage.getItem("token");
  const [data, setData] = useState("");
  const [language, setLanguage] = useState("");
  const [contactPref, setContactPref] = useState("");
  const [studyGoal, setStudyGoal] = useState("");
  const [riwaya, setRiwaya] = useState("");
  const [memorization, setMemorization] = useState("");
  const [isFavoriteBuddy, setIsFavoriteBuddy] = useState();
  const [buddy, setBuddy] = useState();
  const [data2, setData2] = useState("");

  //-----useparams------//
  const { id } = useParams();
  const item = buddyData.find((item) => item?.id === parseInt(id));
  const user = secureLocalStorage.getItem("id");

  ///like unlike condition maping ////////
  const handleLike = (itemId, liked) => {
    const updatedItems = buddyData.map((item) => {
      if (item?.id === itemId) {
        return { ...item, liked };
      }
      return item;
    });
    setItems(updatedItems);
  };
  const scrollToSection = (sectionId) => {
    scroller.scrollTo(sectionId, {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
    });
  };
  ///like unlike condition maping ////////

  useEffect(() => {
    window.scrollTo(0, 0)
    GetFindBuddyData()

  }, [])

  const DateFormate = (item) => {
    const inputDate = item?.dob;
    const dateFormat = 'MM-DD-YYYY';
    const birthDate = moment(inputDate, dateFormat);
    const currentDate = moment();
    return currentDate.diff(birthDate, 'years');

  }

  const GetFindBuddyData = () => {
    setLoader(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(API_Routes.GETBUDDYDETAILS + id, requestOptions)
      .then(response => response.json())
      .then(result => {

        if (result.status == 200 || result.status == 201) {

          const riwaya = result?.data?.goals[0]?.riwaya && JSON.parse(result?.data?.goals[0]?.riwaya);
          const riwayaformattedString = result?.data?.goals[0]?.riwaya && `${riwaya.join(', ')}`;
          setRiwaya(riwayaformattedString)

          const study = result?.data?.goals[0]?.goal && JSON.parse(result?.data?.goals[0]?.goal);
          const studyformattedString = result?.data?.goals[0]?.goal && `${study.join(', ')}`;
          setStudyGoal(studyformattedString)

          setMemorization(result?.data?.goals[0]?.memorizationLevel)
          setIsFavoriteBuddy(result?.data?.isFavorite)
          const languageData = result?.data?.userDetailId?.language?.length && JSON.parse(result?.data?.userDetailId?.language);
          const levels = result?.data?.userDetailId?.language?.length && languageData.map(data => data?.level);
          const languages = result?.data?.userDetailId?.language?.length && levels.join(', ');
          setLanguage(languages)
          const conatctPre = result?.data?.availibility[0]?.contactPreferance && JSON.parse(result?.data?.availibility[0]?.contactPreferance);
          const contactformattedString = result?.data?.availibility[0]?.contactPreferance && `${conatctPre?.join(', ')}`;
          setContactPref(contactformattedString)





          // navigate('/dashboard')
          setData(result?.data)
          setLoader(false)

          // showMessage(result.message, 'success');
        } else {
          setLoader(false)
          showMessage(result.message, 'error');


        }
      })
      .catch(error => {
        console.log('error', error)
        setLoader(false)

      });
  }


  const sendMessage = async () => {
    // alert(data)
    setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("contactId", data?._id);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`${url}api/student/message/create`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 201) {
          fetchBuddy();
        }
        setLoader(false);
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });
  };

  const fetchBuddy = async (item, index) => {
    setLoader(true)

    try {
      setData2(item);
      var myHeaders = new Headers();

      myHeaders.append("Authorization", "Bearer " + token);
      const res = await fetch(`${url}api/student/buddy/${data?._id}`, {
        method: "GET",
        headers: myHeaders,
      });
      const resData = await res.json();
      if (resData?.status == 200) {
        setBuddy(resData.data);
        setLoader(false)

      }
    } catch (error) {
      console.log(error);
      setLoader(false)

    }
  };


  const matchingItem =
    buddy?.contact?.find(
      (item) =>
        (item?.userId === user && item?.contactId === buddy?._id) ||
        (item?.userId === buddy?._id && item?.contactId === user)
    ) ||
    buddy?.contacts?.find(
      (item) =>
        (item?.userId === user && item?.contactId === buddy?._id) ||
        (item?.userId === buddy?._id && item?.contactId === user)
    );

  const isBlockValue = matchingItem ? matchingItem.isBlock : null;
  const isMyIdMatch = matchingItem ? matchingItem.sendRequest : null;

  return (
    <>

      <DashboardNavbar />
      <section>
        {loader && <div className="loaderScreen">
          <Loader />
        </div>}
        <div className=" ev-details-bg">
          <div className="buddyDetailsMain">
            <div className="row tech-details-header">
              <div className="col-xl-7 gap-5 d-flex flex-wrap buddy-details-text">
                <div>
                  <img className="img-fluid" src={data?.userDetailId?.image?.url ? data?.userDetailId?.image?.url : (data?.userDetailId?.gender === "male" ? maleBuddy : femaleBuddy)} alt="" />
                </div>
                <div>
                  <div className="d-flex align-items-center gap-3">
                    <div>
                      <h6>{data?.userDetailId?.firstName} {data?.userDetailId?.lastName}</h6>
                    </div>
                    <div>
                      <ul className="d-flex icon-both mb-0">
                        <li>
                          <ReactSVG className="point" src={download} />
                        </li>
                        <li>
                          <LikeButton
                            itemId={data?._id}
                            initialLiked={data?.isFavorite}
                            handleLike={(item) => handleLike(item)}
                            userId={data?.userDetailId?.userId}
                            name="Buddies"
                            runData={true}
                            GetEventsData={GetFindBuddyData}
                            showlarge={false}
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="my-3">
                    <p>
                      Location: <span>{data?.userDetailId?.city}, {data?.userDetailId?.country}</span>
                    </p>
                    <p>
                      Age: <span>{DateFormate(data?.userDetailId)} years old</span>
                    </p>
                    <p>
                      Language: <span>{language && language}</span>
                    </p>
                    <p>
                      Contact preference: <span>{contactPref && contactPref}</span>
                    </p>
                  </div>

                  {/* {!isMyIdMatch && ( */}
                  <Button
                    class={"tech-btn tech-btn-2 me-3"}
                    data={"Send message"}
                    onClick={() => {
                      sendMessage();
                    }}
                  ></Button>
                  {/* )} */}
                  {/* <Button class={"tech-btn "} data={"Send Request "}></Button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" details-navlist sticky-top">
          <div className="buddyDetailsMain">
            <div className="row justify-content-around text-center teach-Navlist">
              <div className="col-md-3 py-1">
                <a onClick={() => scrollToSection("About-section")}>About me</a>
              </div>
              <div className="col-md-3 py-1">
                <a onClick={() => scrollToSection("study-goal-section")}>
                  Study goal
                </a>
              </div>
              <div className="col-md-3 py-1">
                <a onClick={() => scrollToSection("lectures")}>
                  Events and lectures
                </a>
              </div>
              <div className="col-md-3 py-1" >
                <a onClick={() => scrollToSection("Availability")}>
                  Availability
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* ///////////////section-two///////////// */}
        <Element className="buddyDetailsMain mb50" id="About-section">
          <h5>About me</h5>
          <div className="box-section-one col-lg-6 col-sm-12">
            <p className="text-interWord ">

              <small>{data?.userDetailId?.aboutMe}</small>
            </p>

          </div>
        </Element>

        {/* ///////////////section-three///////////// */}
        <div className="buddyDetailsMain mb50">
          <Element id="study-goal-section">
            <h5>Study goal and memorization level</h5>
          </Element>

          <div className="col-lg-6 col-md-6 col-xl-6 box-section-one ">
            <p>
              Study goal: <span className="memoLevel"> {studyGoal} </span>
            </p>
            <p>
              Riwaya: <span className="memoLevel"> {riwaya} </span>
            </p>
            <p>Memorization level:</p>
            <div className="row align-items-center mt-5">
              <div
                style={{ width: 73 }}
                className="col-lg-2 col-sm-2 d-flex justify-content-end "
              >
                <p className="mb-1 fw-500 pe-0"> 1 juzz</p>
              </div>
              <div className="col-lg-5 pe-0 d-flex justify-content-center col-md-7  col-sm-8 ps-0">
                <RangeSliderMui setMem={setMem} level={memorization} disabled={true} />
              </div>
              <div className="col-lg-2 col-sm-2">
                <p className="mb-1 fw-500">30 juzz</p>
              </div>
            </div>
          </div>
        </div>

        {/* ///////////////section-four///////////// */}
        <Element className="buddyDetailsMain mb50" id="lectures">
          <h5>Events and lectures</h5>
          <div className="col-lg-6  box-section-one Eventslectures">
            <ul
              class="nav nav-tabs gap-3"
              id="myTab"
              role="tablist"
              style={{ marginBottom: 32 }}
            >
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link active"
                  id="pills-home-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-home"
                  type="button"
                  role="tab"
                  aria-controls="pills-home"
                  aria-selected="true"
                >
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <img
                      style={{ width: 22 }}
                      src={lectureImg1}
                      className="mb-1 me-1"
                      alt=""
                    />
                    <div style={{ marginTop: 4 }}> Event</div>
                  </div>
                </button>
              </li>

              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  id="pills-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-profile"
                  type="button"
                  role="tab"
                  aria-controls="pills-profile"
                  aria-selected="false"
                >
                  <img src={lectureImg2} className="me-1" alt="" /> Lecture
                </button>
              </li>
            </ul>

            <div class="tab-content mt-2" id="pills-tabContent">
              <div
                class="tab-pane fade show active"
                id="pills-home"
                role="tabpanel"
                aria-labelledby="pills-home-tab"
                tabindex="0"
              >

                {data?.events?.length ? (
                  data?.events?.map((item, index) => {
                    return (
                      <p className={`border-bottom mb-0 mt-3 pb-0 `} key={index}>
                        Revive your connection:{" "}
                        {item?.favoriteId?.eventName
                          ? item?.favoriteId?.eventName
                          : "Data not found"}{" "}
                        <br></br>
                        <p className="mb-0 ps-0" style={{ marginTop: 8 }}>
                          Orgnaization :{" "}
                          <span>
                            {" "}
                            {item?.favoriteId?.userId?.email == "admin@gmail.com"
                              ? "Administrator"
                              : "Not found"}
                          </span>
                        </p>
                      </p>
                    );
                  })
                ) : (
                  <div className="text-center">No event</div>
                )}
                {/* {["1", "2", "3"].map((index) => {
                  return (
                    <p className={`border-bottom mb-0 mt-3 pb-0 `}>
                      Revive your connection: Quran Memorization of Spiritual
                      Growth <br></br>
                      <p className="mb-0 ps-0" style={{ marginTop: 8 }}>
                        Orgnaization : <span> Islamic culture center</span>
                      </p>
                    </p>
                  );
                })} */}
              </div>

              <div
                class="tab-pane fade"
                id="pills-profile"
                role="tabpanel"
                aria-labelledby="pills-profile-tab"
                tabindex="0"
              >
                {["1"].map(() => {
                  return (
                    <p className="">
                      {/* Revive your connection: Quran Memorization of Spiritual
                    Growth <br /> Orgnaization : */}

                      <span>
                        Coming Soon
                        {/* Islamic culture center */}
                      </span>
                    </p>
                  );
                })}
                {/* {["1", "2", "3"].map(() => {
                  return (
                    <p className="border-bottom">
                      Revive your connection: Quran Memorization of Spiritual
                      Growth <br /> Orgnaization :
                      <span>Islamic culture center</span>
                    </p>
                  );
                })} */}
              </div>
            </div>
          </div>
        </Element>
        {/* ///////////////section-four///////////// */}
        <Element className="buddyDetailsMain mb50" id="Availability">
          <h5>Availability</h5>
          <div className="col-lg-6 col-md-12 col-sm-12 col-sx-12  box-section-one ">
            <Availbility2 col={true} buddy={data} />
          </div>
        </Element>

        <Footer />
      </section>
    </>
  );
};

export default FindBuddyDetails;
