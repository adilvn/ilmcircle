import React from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import { lectureList, lectureList2 } from "../DummyData/EventandClass";
import { BsBellSlash, BsFillBellSlashFill } from "react-icons/bs";
import bellIcon from "../../../asserts/images/bellicons.png";
import ringBell from "../../../asserts/images/ringBell.png";
import { Link, useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";
import { useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { useEffect } from "react";
import moment from "moment";
import { Loader } from "../../../components/reuseable/Loader";
import { showMessage } from "../../../components/reuseable/Tostify";

export const EventsClass = ({ handleItem }) => {
  const [events, setEvents] = useState([]);
  const [loader, setLoader] = useState(false);

  const token = secureLocalStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    GetEventsData();
  }, []);

  const GetEventsData = () => {
    setLoader(true);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    return fetch(
      "https://ilmcircle.com/backend/api/student/favorite/events/all",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result?.status === 200) {
          setEvents(result?.data);
          setLoader(false);

          return result?.data;
        } else {
          setLoader(false);
        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });
  };

  const formatDate = (dateString) => {
    const formattedDate = moment(dateString, "MM/DD/YYYY").format("MMMM DD");
    return formattedDate;
  };


  const SendNotificationUpdate = (item, val) => {
    setLoader(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("sendNotification", true);
    formdata.append("eventId", item?.favoriteId?._id);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch("https://ilmcircle.com/backend/api/student/event/notification", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result?.status === 200 || result?.status === 201) {
          GetEventsData()
          setLoader(false);
          showMessage(result.message)
        } else {
          setLoader(false);
          showMessage(result.message, 'error')

        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });
  }

  return (
    <div className="eventSectionContainer">
      {loader && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div className="d-flex justify-content-between pt-sm-0 pt-3 margin-dashboard-calender">
        <h2 className="mainGoalsAndTaskHeading">Upcoming events and classes</h2>
        <BiRightArrowAlt
          fontSize={"25px"}
          className="point"
          onClick={() => navigate(`/student-dashboard/${2}`)}
        />
      </div>
      <div className="lecturesEvent">
        <h2 className="heading mt-1">Next lectures</h2>
        <div className="lectureSchudle" style={{ height: 192 }}>
          <div
            className="NoEventsTxt text-center fs-6 mt-3"
            style={{ color: "#f47b00" }}
          >
            Coming soon
          </div>

        </div>
        <h2 className="heading mt-2">Next events</h2>
        <div className="lectureSchudle" style={{ height: 134 }}>
          {events?.length ? events?.map((item, index) => (
            <div key={index} className="upperContainer py-2 d-flex justify-content-between">
              <div className="leftSideContainer d-flex align-items-center">
                <img src={item?.favoriteId?.images[0]?.url} alt="" />
                <div className="ms-2">
                  <h2 className="mb-0">{item?.favoriteId?.eventName}</h2>
                  <p className="mb-0">{item?.favoriteId?.name}</p>
                </div>
              </div>
              <div className="leftSideContainer d-flex align-items-center">
                <div className="me-2">
                  <h2 className="mb-0 text-end">
                    {formatDate(item?.favoriteId?.startingTime)}
                  </h2>
                </div>
                {item?.sendNotification ? (
                  <img
                    className="pointer"
                    onClick={() => SendNotificationUpdate(item, false)}
                    src={ringBell}
                    alt="ringBell"
                    style={{ width: "22px", height: "22px" }}
                  />
                ) : (
                  <img
                    className="pointer"
                    onClick={() => SendNotificationUpdate(item, true)}
                    src={bellIcon}
                    alt="bellIcon"
                    style={{ width: "22px", height: "22px" }}
                  />
                )
                }
              </div>
            </div>
          ))
            :
            <div
              className="NoEventsTxt text-center fs-6 mt-3"
              style={{ color: "#f47b00" }}
            >
              No event found
            </div>

          }
        </div>
      </div>
    </div>
  );
};
