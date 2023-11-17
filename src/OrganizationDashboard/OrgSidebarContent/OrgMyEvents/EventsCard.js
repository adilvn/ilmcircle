import React, { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsPinAngle, BsFillPinAngleFill } from "react-icons/bs";
import { format } from "date-fns";
import secureLocalStorage from "react-secure-storage";
import { showMessage } from "../../../components/reuseable/Tostify";
import { Loader } from "../../../components/reuseable/Loader";
import API_Routes from "../../../Routes/API_Routes";

export const EventsCard = ({ item, index, GetAllEvents }) => {
  const {
    card,
    content,
    startingTime,
    eventDetail,
    cardImg,
    eventName,
    images,
  } = item;

  // function formatDate(dateString, time) {
  //   if (dateString) {
  //     const date = new Date(dateString);
  //     // alert(date)
  //     const formattedDate = format(date, "EEE • MMM d • h a 'CEST'");
  //     return formattedDate;
  //   }
  //   // const date = new Date(dateString);
  //   // const formattedDate = format(date, "EEE • MMM d • h a 'CEST'");
  //   // return formattedDate;
  // }

  function formatDate(dateString, time) {
    if (dateString) {
      const date = new Date(dateString);

      if (time) {
        // Parse the time string in hh:mm a format (e.g., "9:02 PM")
        const timeRegex = /^(\d{1,2}):(\d{2}) (AM|PM)$/; // Valid time format regex
        const match = time.match(timeRegex);

        if (match) {
          const [_, hours, minutes, ampm] = match; // Extract matched groups
          const isPM = ampm === "PM";

          // Adjust the hours if it's PM and not 12 PM
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

    return null; // or any other value to handle the case when no date is provided
  }

  const [loader, setLoader] = useState(false);

  const token = secureLocalStorage.getItem("token");

  const PinUnpinEvents = (e, item) => {
    e.stopPropagation();
    setLoader(true);
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

    fetch(API_Routes.PINUNPINEVENTS, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200 || result?.status == 201) {
          GetAllEvents();
          setLoader(false);
          showMessage(result?.message);
        } else {
          setLoader(false);
          showMessage(result?.message);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("error", error);
      });
  };

  const DeleteEvents = (e, item) => {
    e.stopPropagation();
    setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("id", item?._id);

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(API_Routes.DELETEEVENTS, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result?.status == 200 || result?.status == 201) {
          GetAllEvents();
          setLoader(false);
          showMessage(result?.message);
        } else {
          setLoader(false);
          showMessage(result?.message, "error");
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("error", error);
      });
  };
  const handlePinAngleClick = (e) => {
    e.stopPropagation(); // Prevent the event from propagating
    // alert('PinAngle button clicked'); // Show an alert when the PinAngle button is clicked
  };

  const handleDeleteBinClick = (e) => {
    e.stopPropagation(); // Prevent the event from propagating
    // alert('DeleteBin button clicked'); // Show an alert when the DeleteBin button is clicked
  };

  return (
    <>
      {loader && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div style={{ cursor: "pointer" }} className={`card eventCard`}>
        <img
          style={{ height: 246 }}
          src={images[0]?.url}
          className={`card-img-top`}
          alt="..."
        />

        <div className="card-body p-2">
          <h1 className="eventCardDueDate my-1">
            {startingTime != "Invalid date" &&
              formatDate(startingTime, item?.eventTime)}
          </h1>

          <h3 style={{ height: 56 }} className="card-title">
            {eventName}
          </h3>
          <p className="card-text my-1">{eventDetail?.slice(0, 100)}</p>
          <span className="pb-0 cardAttributes">{card}</span>
        </div>
        <div className="pe-2 position-absolute w-auto organizationEventicon top-0 end-0 mt-2">
          {item?.isPin ? (
            <BsFillPinAngleFill
              className="mx-2 point"
              fontSize={"27px"}
              color="#252727C7"
              onClick={(e) => PinUnpinEvents(e, item)}
            />
          ) : (
            <BsPinAngle
              className="mx-2 point"
              fontSize={"27px"}
              color="#252727C7"
              onClick={(e) => PinUnpinEvents(e, item)}
            />
          )}
          <RiDeleteBin6Line
            className="mx-2 point"
            fontSize={"29px"}
            color="#252727C7"
            onClick={(e) => DeleteEvents(e, item)} // Add click event handler
          />
        </div>
      </div>
    </>
  );
};
