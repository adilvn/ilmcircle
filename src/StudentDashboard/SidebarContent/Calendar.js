import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";

import "./Calender.css";
import { ReactModal } from "../ReactModal";
import secureLocalStorage from "react-secure-storage";

function Calendar() {
  const calendarRef = useRef(null);
  const [data, setData] = useState(null); // Initialize data as null
  const [show, setShow] = useState(false);
  const [events, setEvents] = useState([]);

  const token = secureLocalStorage.getItem("token");

  useEffect(() => {
    const calendarApi = calendarRef.current.getApi();
    const today = new Date().toISOString()?.split("T")[0];

    GetEventsData().then((apiData) => {
      const eventData = apiData.map((item, index) => ({
        id: item?._id,
        borderColor: "#f5d3d3",
        location: item?.favoriteId?.location,
        title: item?.favoriteId?.eventName,
        start: formatDate(item?.favoriteId?.startingTime) + "T09:00:00",
        end: formatDate(item?.favoriteId?.endTime) + "T12:00:00",
        backgroundColor: "#f5d3d3",
      }));

      function formatDate(dateString) {
        const parts = dateString?.split("/");
        if (parts?.length === 3) {
          const [month, day, year] = parts;
          const formattedDay = day.trim().padStart(2, '0'); // Add leading zero if day < 10
          return `${year.trim()}-${month.trim()}-${formattedDay}`;
        }
        return "";
      }


      console.log('eventData', eventData)

      calendarApi?.addEventSource(eventData);
    });
  }, []);

  const hideModal = () => {
    setShow(false);
  };

  const handleEventClick = (e) => {
    setData(e.event.toPlainObject());
    setShow(true);
  };

  const GetEventsData = () => {
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
          console.log('result?.data', result?.data)

          setEvents(result?.data);
          return result?.data;
        }
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <>
      <div>
        <div className="eventCalender AllMainSection  py-4">
          <FullCalendar
            ref={calendarRef}
            eventClick={handleEventClick}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={"timeGridWeek"}
            headerToolbar={{
              start: "prev,title,next",
              end: "timeGridDay,timeGridWeek,dayGridMonth,dayGridYear",
            }}
            titleFormat={{ year: "numeric", month: "long" }}
            buttonIcons={{
              next: "right",
              prev: "left",
            }}
            // events={events}

            height={"90vh"}
          />
        </div>
      </div>
      {data && (
        <ReactModal hideModal={hideModal} show={show} data={data} />
      )}{" "}
    </>
  );
}

export default Calendar;
