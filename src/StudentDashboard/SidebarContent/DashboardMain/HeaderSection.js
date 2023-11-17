import React from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import { BsArrowRepeat } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { EventsClass } from "../EventClass/EventsClass";
import { MiniCalender } from "./MiniCalender";
import reverseIcon from "../../../asserts/images/reverseIcon.png";
import editIcon from "../../../asserts/images/orgEditIcon.png";
import { useDispatch, useSelector } from "react-redux";
import { actionCreaters } from "../../../Store/Index";
import { bindActionCreators } from "redux";
import { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import { setAyat, setGoalTaskData } from "../../../Store/Actions";
import API_Routes from "../../../Routes/API_Routes";
import axios from "axios";
import Slider from "react-slick";
import { useState } from "react";
import { Loader } from "../../../components/reuseable/Loader";
import myEventCloseIcon from '../../../asserts/images/myEventCloseIcon.png'
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import { showMessage } from '../../../components/reuseable/Tostify'
import { useNavigate } from "react-router-dom";

export const HeaderSection = () => {
  const dispatch = useDispatch();
  const { studDashboardIndex } = bindActionCreators(actionCreaters, dispatch);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [memorizationTip, setMemorizationTip] = useState([]);

  const goalTask = useSelector((state) => state.goalTask);
  const getAyat = useSelector((state) => state.Ayat);

  const token = secureLocalStorage.getItem("token");
  const navigate = useNavigate();

  const handleItemClick = (index) => {
    navigate(`/student-dashboard/${index}`);

  };
  const slideStatus = secureLocalStorage.getItem('slider')
  useEffect(() => {

    GetTaskList();
    AyatData()
    MemorizationTips()
  }, []);


  useEffect(() => {
    const slideStatus = secureLocalStorage.getItem('slider');
    setIsPlaying(slideStatus === "Play");
  }, []);
  const GetTaskList = () => {
    setLoader(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(API_Routes.GETALLGOALTASK, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200 || result.status == 201) {
          dispatch(setGoalTaskData(result?.data));
          setLoader(false)

        } else {
          setLoader(false)
          showMessage(result?.message)
        }
      })
      .catch((error) => {
        setLoader(false)
        console.log("error", error);
      });
  };

  const ShowDrop = (e) => {
    secureLocalStorage.setItem('slider', e.target.value);
    setIsPlaying(e.target.value === "Play");
  }

  const AyatData = () => {
    setLoader(true)
    const axiosConfig = {
      method: 'get',
      url: 'https://ilmcircle.com/backend/api/page/ayat',
    };

    axios(axiosConfig)
      .then((response) => {
        if (response.status == 200 || response.status == 201) {
          setLoader(false)
          dispatch(setAyat(response?.data?.data));

        } else {
          setLoader(false)
          showMessage(response?.data?.message, 'error')
        }
        // console.log('AyatData==>', response.data.data);

      })
      .catch((error) => {
        console.log('error', error);
        setLoader(false)

      });


  }


  const MemorizationTips = () => {
    setLoader(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(API_Routes.GETMEMORIZATIONTIPS, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status == 200 || result.status == 201) {
          setMemorizationTip(result?.data)
          setLoader(false)


        } else {
          setLoader(false)
          showMessage(result.message, 'error')

        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false)

      });
  }

  // const dueDate = (date) => {
  //   const [day, month, year] = date.split("/").map(Number);
  //   console.log('date', date)

  //   const inputDate = new Date(year, month - 1, day);

  //   const currentDate = new Date();

  //   currentDate.setHours(0, 0, 0, 0);

  //   const timeDifference = currentDate - inputDate;

  //   const daysAgo = Math.floor(timeDifference / (24 * 60 * 60 * 1000));

  //   if (daysAgo === 0) {
  //     return "Today";
  //   } else if (daysAgo === 1) {
  //     return "Yesterday";
  //   } else {
  //     return `${daysAgo} days ago`;
  //   }
  // };


  const dueDate = (dateString) => {
    const inputDate = new Date(dateString);

    const currentDate = new Date();

    // Set both dates to the same time (midnight) for accurate comparison
    inputDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const timeDifference = currentDate - inputDate;

    const daysAgo = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    if (daysAgo === 0) {
      return "Today";
    } else if (daysAgo === 1) {
      return "Yesterday";
    } else if (daysAgo < 0) {
      return `${Math.abs(daysAgo)} days left`;
    }
    else {
      return `${daysAgo} days ago`;
    }
  };

  const date = "2023-10-04";
  const formattedDate = dueDate(date);




  const sliderSettings = {
    dots: false,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const sliderSettings2 = {
    dots: false,
    autoplay: false,
  };

  const sliderSettingsMemo = {
    dots: false,
    autoplay: true,
  };
  return (
    <div>
      {loader && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div className="row gy-5 ms-lg-0 ms-sm-4">
        <div className="col-lg-6  ms-sm-0 ms-3">
          <MiniCalender />
        </div>
        <div className="col-lg-6 ms-sm-0 ms-3 me-sm-0 me-2 ">
          <div className="mainGoalsAndTask margin-dashboard-calender ms-sm-0 ms-1">
            <div
              className="d-flex justify-content-between sticky-top "
              style={{ background: "#fcfcfc", paddingTop: 24 }}
            >
              <h2 className="mainGoalsAndTaskHeading">My goals and tasks</h2>
              <BiRightArrowAlt
                fontSize={"25px"}
                className="point"
                onClick={() => navigate(`/student-dashboard/${3}`)}
              />
            </div>

            {goalTask?.length ? goalTask?.map((item, index) => (
              <div key={index} className="subMenues d-flex justify-content-between align-items-center">
                <h3 className="subMenuesTitle ">{item?.name}</h3>
                <div>
                  <p className="subMenuesTitleSidebar mb-0 text-center">
                    {dueDate(item?.dueDate)}
                  </p>
                  {item?.status == "In progress" ? (
                    <pre className=" progressDiv mb-0">
                      <span className=" dot"></span>
                      <span className="text text-capitalize">
                        {item?.status}
                      </span>
                    </pre>
                  ) : item.status == "Done" ? (
                    <pre
                      className=" progressDiv mb-0"
                      style={{ backgroundColor: "#C5E4D7" }}
                    >
                      <span
                        className="dot"
                        style={{ background: "#2FA070" }}
                      ></span>
                      <span className="text text-capitalize">
                        {item?.status}
                      </span>
                    </pre>
                  ) : (
                    <pre
                      className=" progressDiv mb-0"
                      style={{ backgroundColor: "#E0E0DB" }}
                    >
                      <span
                        className=" dot"
                        style={{ background: "#404040" }}
                      ></span>
                      <span className="text text-capitalize">
                        {item?.status}
                      </span>
                    </pre>
                  )}
                </div>
              </div>
            )) :
              <div
                className="NoEventsTxt text-center fs-6 mt-3"
                style={{ color: "#f47b00" }}
              >
                No goals & task found
              </div>
            }
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-7  ms-sm-0  ms-3 ">
          <div className="margin-dashboard-calender">

            <EventsClass handleItem={handleItemClick} />
          </div>
        </div>

        {/* {getAyat.map(()=>{
          return <div>
            
          </div>
        })} */}
        <div className="col-lg-5  ms-sm-0  ms-3">
          <div className="centertedMainDiv margin-dashboard-calender">
            <div className="centerIconContainer d-flex align-items-center gap-2 justify-content-end text-end p-1">
              {showDropdown ? (
                <img
                  className="mx-2 pointer"
                  style={{ width: 16.67, height: 16.67 }}
                  src={myEventCloseIcon}
                  alt="editIcon"
                  onClick={() => setShowDropdown(false)}
                />
              ) : (
                <img
                  className="mx-2 pointer"
                  style={{ width: 16.67, height: 16.67 }}
                  src={editIcon}
                  alt="editIcon"
                  onClick={() => setShowDropdown(true)}
                />
              )}

              {showDropdown && (
                <div className="custom-select" style={{ width: 200 }}>
                  <select
                    className="form-select custom-select"
                    onChange={(e) => ShowDrop(e)}
                    value={isPlaying ? "Play" : "Pause"}

                  >
                    <option selected disabled>Select</option>
                    <option value="Play">Play</option>
                    <option value="Pause">Pause</option>
                  </select>
                </div>
              )}

              <img
                className="ms-2 me-4 pointer"
                style={{ width: 14.58, height: 17.2 }}
                src={reverseIcon}
                alt="reverseIcon"
                onClick={() => AyatData()}
              />
            </div>

            {isPlaying ? (
              <>
                {/* {alert('slide')} */}
                <Slider autoplay {...sliderSettings}>
                  {getAyat.map((item) => (
                    <div key={item._id}>
                      <div className="h3">"{item.ayat}"</div>
                      <div className="pText">({item.detail})</div>
                    </div>
                  ))}
                </Slider>
              </>
            ) : (
              <Slider {...sliderSettings2}>
                {getAyat.map((item) => (
                  <div key={item._id}>
                    <div className="h3">"{item.ayat}"</div>
                    <div className="pText">({item.detail})</div>
                  </div>
                ))}
              </Slider>
            )}
          </div>
          <div className="memorizingContainer margin-dashboard-calender">
            <div className="d-flex justify-content-between">
              <h3 className="memorizingHeader">Memorizing tips</h3>
              <img
                className="ms-2 me-4 pointer"
                style={{ width: 14.58, height: 17.2 }}
                src={reverseIcon}
                alt="reverseIcon"
                onClick={MemorizationTips}
              />
            </div>
            <div className="textContainer">
              <Slider autoplay {...sliderSettingsMemo}>
                {memorizationTip?.map((item) => (
                  <div key={item._id}>
                    <p className="mb-0">
                      {item?.description}
                    </p>
                  </div>
                ))}
              </Slider>
              {/* <p className="mb-0">
                Stay organized: Keep your study materials and notes organized,
                so you can easily access and review them when needed.
              </p> */}
            </div>


          </div>
        </div>
      </div>
    </div >
  );
};
