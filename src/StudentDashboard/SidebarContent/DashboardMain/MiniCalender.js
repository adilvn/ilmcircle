import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./MiniCalender.css";
import secureLocalStorage from "react-secure-storage";
import API_Routes from "../../../Routes/API_Routes";
import { showMessage } from "../../../components/reuseable/Tostify";
import { bindActionCreators } from "redux";
import { actionCreaters } from "../../../Store/Index";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const MiniCalender = () => {
  const [value, onChange] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loader, setLoader] = useState(false);
  const [tasks, setTasks] = useState([]); // Add a state variable for tasks

  const token = secureLocalStorage.getItem("token");
  const dispatch = useDispatch();

  const { studDashboardIndex } = bindActionCreators(actionCreaters, dispatch);

  useEffect(() => {
    GetEventsData();
    GetTaskList()
  }, []);


  useEffect(() => {
    onChange(value);
  }, [events]);


  const GetTaskList = () => {
    setLoader(true);
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

          setTasks(result.data);
          setLoader(false);
        } else {
          showMessage(result?.message, "error");
          setLoader(false);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("error", error);
      });
  };

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

  const renderDot = ({ date }) => {
    const eventDates = events?.map((event) => new Date(event?.favoriteId?.startingTime));
    const taskDates = tasks?.map((task) => new Date(task?.dueDate));
    const Event = eventDates?.some((eventDate) => eventDate?.toDateString() === date?.toDateString());
    const Task = taskDates?.some((taskDate) => taskDate?.toDateString() === date?.toDateString());

    if (Event && Task) {
      return (
        <div className="d-flex justify-content-center align-items-center" >
          <div className="event-dot2  "></div>
          <div className="task-dot2"></div>
        </div>
      );
    } else if (Event) {
      return <div className="event-dot"></div>;
    } else if (Task) {
      return <div className="task-dot"></div>;
    }

    return null;
  };

  const navigate = useNavigate()

  const handleDayClick = (date) => {

    navigate(`/student-dashboard/${3}`, {
      state: { item: date },
    })
  };
  return (
    <div className="miniCalender d-flex justify-content-center clander-top-scroll margin-dashboard-calender ms-sm-0 ms-1">
      <div>
        <Calendar
          onChange={onChange}
          value={value}
          // minDate={new Date()}
          onClickDay={handleDayClick}
          tileContent={renderDot} />
        <div className="calenderTextMain">
          <span className="calenderText">
            <span
              className="calenderIcon">
            </span>Class
          </span>
          <span className="calenderText">
            <span
              className="calenderIcon"
              style={{ backgroundColor: "#E47171" }}
            ></span>
            Event
          </span>
          <span className="calenderText">
            <span
              className="calenderIcon"
              style={{ backgroundColor: "#AA76ED" }}
            ></span>
            Task
          </span>
        </div>
      </div>
    </div>
  );
};
