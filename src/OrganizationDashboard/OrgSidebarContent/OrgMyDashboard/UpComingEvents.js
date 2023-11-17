import React, { useState, useEffect, useRef } from "react";
import { BsArrowRight } from "react-icons/bs";
import rightArrow from "../../../asserts/images/rightarro.png";
import { eventsArray } from "./Dummy";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreaters } from "../../../Store/Index";
import API_Routes from "../../../Routes/API_Routes";
import { Loader } from "../../../components/reuseable/Loader";
import { showMessage } from "../../../components/reuseable/Tostify";
import secureLocalStorage from "react-secure-storage";
import moment from "moment";
import { useNavigate } from "react-router-dom";
export const UpComingEvents = ({ orgDashboardIndex }) => {
  const [getEvents, setGetEvents] = useState([]);
  const [loader, setLoader] = useState(false);
  const token = secureLocalStorage.getItem("token");
  const mapDivRef = useRef(null);

  useEffect(() => {
    GetAllEvents();
  }, []);
  const GetAllEvents = () => {
    setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    var formdata = new FormData();

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      // body: formdata,
      redirect: "follow",
    };

    fetch(API_Routes.ALLEVENTS, requestOptions)
      .then((response) => response.json())
      .then((result) => {

        if (result.status == 200) {
          setGetEvents(result?.data);
          setLoader(false);
        } else {
          showMessage(result?.message, "error");
          setLoader(false);
        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });
  };

  const formattedDate = (item) => {
    return moment(item?.startingTime, "MM/DD/YYYY").format("MMMM DD");
  };
  const isToday = (item) => {
    return moment(item.startingTime, "MM/DD/YYYY").isSame(moment(), "day");
  };

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  }

  const navigate = useNavigate()

  return (
    <div className="pAll-24px sectionBg">
      {loader && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div className="header d-flex justify-content-between">
        <h3>My upcoming events</h3>
        <img
          src={rightArrow}
          width={24}
          height={24}
          alt=""
          className="pointer"
          onClick={() => {
            navigate(`/organization-dashboard/${1}`)

          }}
        />
      </div>
      <div
        className="allItemMain pt-sm-2"
      // style={{ display: "flex", flexDirection: "column-reverse" }}
      >
        {getEvents.length > 0 ? (
          getEvents.map((item) => (
            <div
              ref={mapDivRef}
              className="itemEvent d-flex align-items-center g-2 justify-content-between"
              key={item.id}
            >
              <div className="d-flex flex-wrap align-items-center p-sm-0 p-2 width-25">
                <img src={item?.images[0]?.url} alt="" />
                <h5 className="title me-0 mb-0 ms-2">
                  {truncateText(item?.eventName, 5)}
                </h5>
              </div>
              <div className="people p-sm-0 p-2 width-25">
                <h4 className="mb-0 text-center">{item?.views}</h4>
                <p className="mb-0 text-center">people seen</p>
              </div>
              <div className="people p-sm-0 p-2 width-25">
                <h4 className="mb-0 text-center">{item?.intrested}</h4>
                <p className="mb-0 text-center">people interested</p>
              </div>

              {isToday(item) ? (
                <div className=" d-flex justify-content-center width-25">
                  <div className="d-flex align-items-center todayDate pe-2 ">
                    <span></span>
                    <p className="mb-0 today">Today</p>
                  </div>
                </div>
              ) : (
                <div className=" d-flex justify-content-center width-25">
                  <p className="date todayDate p-sm-0 p-2 ">
                    {formattedDate(item)}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="MediaEdit d-flex align-items-center justify-content-center ">
            <h4>No Events Found</h4>
          </div>
        )}
      </div>
    </div>
  );
};
