import React from "react";
import img from "../../../../asserts/images/icon.png";
import download from "../../../../asserts/images/download.svg";
import heart from "../../../../asserts/images/downhert.svg";
import { ReactSVG } from "react-svg";
import { useState } from "react";
import API_Routes from "../../../../Routes/API_Routes";
import secureLocalStorage from "react-secure-storage";
import { showMessage } from "../../../../components/reuseable/Tostify";
import { useEffect } from "react";
import { format } from "date-fns";
import LikeButton from "../../../DashboardCmp/Likebutton";

const Event = ({ id }) => {

  const token = secureLocalStorage.getItem('token')
  const [allEvents, setEvents] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    GetProjects(id)
  }, [])

  const GetProjects = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(API_Routes.GETALLEVENTSADMIN + id, requestOptions)
      .then(response => response.json())
      .then(result => {

        if (result.status == 200) {
          setEvents(result?.data);
        } else {
          showMessage(result?.message, 'error');
        }
      })
      .catch((error) => {
        console.log('error', error);

      });
  }

  function formatDate(dateString) {
    if (dateString) {
      const date = new Date(dateString);
      const formattedDate = format(date, "EEE • MMM d • h a 'CEST'");
      return formattedDate;
    }
    const date = new Date(dateString);
    const formattedDate = format(date, "EEE • MMM d • h a 'CEST'");
    return formattedDate;
  }

  const handleLike = (itemId, liked) => {
    const updatedItems = allEvents?.map((item) => {
      if (item.id === itemId) {
        return { ...item, liked };
      }
      return item;
    });
    setItems(updatedItems);
  };
  return (
    <div className="mt-5">
      <div className="cultureEvent">
        <h5 className="vavncyHeading pb-2">Event</h5>

        <div className={allEvents.length ? `eventCultureMain mt-4` : ""}>
          {allEvents.length ? allEvents?.map((item, index) => (
            <div key={index} className="row align-items-center eventCol">

              <div className="col col-md-12 col-lg-9">
                <div className="row align-items-center ">
                  <div className="col col-2 col-md-2 p-0 col-lg-2">
                    <img src={item?.images[0]?.url} alt="" />
                  </div>
                  <div className="col col-10 p-0 ms-md-0 col-md-10 col-lg-10 ps-xl-0 ps-3 col col-10 p-0 ms-md-0 col-md-10 col-lg-10 pb-sm-2 pb-4">
                    <p className="eventDate mb-0">{item?.startingTime != 'Invalid date' || 'Invalid time value' && formatDate(item?.startingTime)}</p>
                    <p className="eventText mb-0">{item?.eventName}</p>
                  </div>
                </div>
              </div>
              <div className="col col-3 cultureIcons d-flex  ms-sm-auto">
                <LikeButton
                  itemId={item?._id}
                  initialLiked={item?.isfavorite}
                  handleLike={(item) => handleLike(item)}
                  name="Event"
                  runData={false}
                  GetEventsData={''}
                  showlarge={false}
                />
                <ReactSVG src={download} className="point p10" />
              </div>
            </div>
          )) :
            <div className='MediaEdit d-flex align-items-center justify-content-center '
            >
              <h4>No Event Found</h4>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Event;
