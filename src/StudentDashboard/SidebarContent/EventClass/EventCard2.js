import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsFillPinAngleFill, BsPinAngle } from "react-icons/bs";
import { format } from "date-fns";
import secureLocalStorage from "react-secure-storage";
import { useState } from "react";
import API_Routes from "../../../Routes/API_Routes";
import { showMessage } from "../../../components/reuseable/Tostify";
export const EventCard2 = ({ item, index, GetEventsData }) => {
  const { card, content, date, content2, cardImg } = item;
  const token = secureLocalStorage.getItem("token");
  const [showPin, setShowPin] = useState(false);


  const CrossFavorite = (itemId) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    // if (userId) {
    //   formdata.append("favoriteId", userId);

    // } else {
    formdata.append("favoriteName", "Event");
    formdata.append("favoriteId", itemId?.favoriteId._id);
    // }

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(API_Routes.ADDTOFAVORITE, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200 || result.status == 201) {
          GetEventsData();
          // setLiked(!liked);
          // setLoader(false);
          showMessage(result.message);
        } else {
          // setLoader(false);
          showMessage(result.message, "error");
        }
      })
      .catch((error) => {
        console.log("error", error);
        // setLoader(false);
      });
  };

  const PinUnpinEvent = (item) => {

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("id", item?._id);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      "https://ilmcircle.com/backend/api/student/pin/update",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200 || result.status == 201) {
          GetEventsData();
        }
      })
      .catch((error) => console.log("error", error));
  };

  function formatDate(dateString, time) {
    if (dateString) {
      const date = new Date(dateString);

      if (time) {
        const timeRegex = /^(\d{1,2}):(\d{2}) (AM|PM)$/;
        const match = time.match(timeRegex);

        if (match) {
          const [_, hours, minutes, ampm] = match;
          const isPM = ampm === "PM";

          if (isPM && hours !== "12") {
            date.setHours(parseInt(hours, 10) + 12, parseInt(minutes, 10));
          } else {
            date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
          }
        } else {
          console.error("Invalid time format");
          return null;
        }
      }

      const formattedDate = format(date, "EEE • MMM d • h a 'CEST'");
      return formattedDate;
    }

    return null;
  }
  return (
    <>
      <div class={`card eventCard `}>
        <img
          style={{ height: 224.03 }}
          src={item?.favoriteId?.images[0]?.url}
          class={`card-img-top `}
          alt="..."
        />




        <div class="card-body p-2">
          {item?.favoriteId?.startingTime !== 'Invalid date' && item?.favoriteId?.startingTime !== 'Invalid time value' && (
            <h1 className="eventCardDueDate my-1">{formatDate(item?.favoriteId?.startingTime, item?.favoriteId?.eventTime)}</h1>
          )}
          <h3 style={{ height: 56 }} class="card-title">
            {item?.favoriteId?.eventName}
          </h3>
          <p style={{ height: 44.08 }} class="card-text my-1">
            {item?.favoriteId?.eventDetail.slice(0, 80)}
          </p>
          <span className="pb-0 cardAttributes">{card}</span>
        </div>
        {index != 2 ? (
          <div className="pt-4 pe-2 position-absolute d-flex justify-content-between w-100 top-0 end-0 mt-2">
            {item?.isPin ? (
              <BsFillPinAngleFill
                className="mx-2 point"
                fontSize={"24px"}
                color="#252727C7"
                onClick={() => PinUnpinEvent(item)}
              />
            ) : (
              <BsPinAngle
                className="mx-2 point"
                fontSize={"24px"}
                color="#252727C7"
                onClick={() => PinUnpinEvent(item)}
              />
            )}

            <AiOutlineClose
              className="mx-2 point"
              fontSize={"24px"}
              color="#252727C7"
              onClick={() => CrossFavorite(item)}
            />
          </div>
        ) : (
          ""
        )}
        <div
          className={`div  ${index == 2 ? "overlayclassFinished pt-1" : ""}`}
        >
          {index == 2 ? (
            <>
              <div className="d-flex justify-content-between w-100 pe-2 position-absolute top-0 end-0 mt-2">
                <BsFillPinAngleFill className="mx-2 point" fontSize={"24px"} />
                <AiOutlineClose className="mx-2 point" fontSize={"24px"} />
              </div>
              <p className="classFinished text-white"> Event ended</p>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
