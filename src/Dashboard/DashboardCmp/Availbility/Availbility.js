import React from "react";
import "./availbility.css";
import Button from "../../../components/reuseable/Button";
import { Availdata } from "./DummyArr";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import InputField from "../../../components/reuseable/InputField";
import { useEffect } from "react";
import { useState } from "react";
import check from '../../../asserts/images/checked.png'
import uncheck from '../../../asserts/images/uncheck.png'
import defaultSelected from '../../../asserts/images/defaultSelected.png'


const Availbility = ({ buddy, col }) => {
  const [daysData, setDaysData] = useState([]);
  const [page, setPage] = useState(3);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [availabilityBol, setAvailabilityBOl] = useState(false);
  const [isOpen5, setIsOpen5] = useState(false);
  const [isOpenEditing, setIsOpenEditing] = useState(false);
  const [newState, setNewState] = useState([])

  const [timeSlots, setTimeSlots] = useState([
    { day: 'Mon', time: [] },
    { day: 'Tue', time: [] },
    { day: 'Wed', time: [] },
    { day: 'Thu', time: [] },
    { day: 'Fri', time: [] },
    { day: 'Sat', time: [] },
    { day: 'Sun', time: [] },

  ]);

  const toggleTimeSlotSelection = (day, time) => {
    setSelectedTimeSlots((prevSelected) => {
      const isSelected = prevSelected.some((slot) => slot.day === day && slot.time === time);
      if (isSelected) {
        return prevSelected.filter((slot) => !(slot.day === day && slot.time === time));
      } else {
        return [...prevSelected, { day, time }];
      }
    });
  };
  useEffect(() => {

    if (buddy) {
      const availTimeArray = buddy && buddy?.availibility[0]?.availableTime;

      const selectedTimeSlot =
        availTimeArray?.map((slotData) => {
          const cleanedSlotData = "[" + slotData.replace(/\\/g, "") + "]";

          try {
            const parsedData = JSON?.parse(cleanedSlotData);
            return parsedData;
          } catch (error) {
            return null;
          }
        })
          .filter((parsedData) => parsedData !== null);

      setNewState(selectedTimeSlot)

      setSelectedTimeSlots(selectedTimeSlot);
      setDaysData([]);
      getDays();
    }

  }, [buddy]);

  const getDays = async () => {
    try {
      let selectedDays;
      let firstArray = [
        { day: "Mon", col: true },
        { day: "Tue", col: true },
        { day: "Wed", col: false },
        { day: "Thu", col: true },
        { day: "Fri", col: true },
        { day: "Sat", col: false },
        { day: "Sun", col: true },
      ];

      const day = buddy?.availibility[0]?.availableDays;

      await day?.map((dayString) => {
        const days = dayString?.split(",");
        selectedDays = days;
      });
      firstArray?.forEach((item) => {
        if (selectedDays?.includes(item?.day?.toLowerCase())) {
          item.col = true;
        } else {
          item.col = false;
        }
      });
      setDaysData(firstArray);

      const selectedTimeSlot = buddy?.availibility[0]?.availableTime?.map((slotData) => {
        // Clean up the string before parsing it as JSON
        const cleanedSlotData = "[" + slotData.replace(/\\/g, "") + "]"; // Wrap in square brackets

        try {
          const parsedData = JSON.parse(cleanedSlotData);
          return parsedData;
        } catch (error) {
          console.error("Error parsing JSON:", error);
          return null;
        }
      })
        .filter((parsedData) => parsedData !== null);

      const filteredTimeSlots = selectedTimeSlot[0]?.filter((item) =>
        firstArray.some((day) => day.col === true)
      );
      setSelectedTimeSlots(filteredTimeSlots);
    } catch (error) {
      console.log(error);
    }
  };
  const generateNumberArray = (start, end) => {
    if (end == "0") {
      end = "24";
    }
    const result = [];
    for (let i = Number(start); i < Number(end); i++) {
      result.push(i);
    }
    return result;
  };
  return (
    <>
      {/* <div className="row scrollable-div">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <small className="light-color mb-2">
            Displayed time is in your local time zone:{" "}
            <span className="orange-link gmttxt">GMT+2</span>
          </small>
          <small className="shed-month mb-2">
            {" "}
            <InputField type="month" />
          </small>
        </div>

        <div className="scrollable-div text-center shed-text">
          {daysData?.length && (
            <table>
              <tr>
                {daysData?.map((item) => {
                  return (
                    <th className="col
                    ">
                      {item.col === true ? (
                        <Button
                          class={"shed-btn shed-btn-blue"}
                          data={item?.day}
                        ></Button>
                      ) : (
                        <div style={{ minWidth: "1.8rem" }}>

                          <Button class={"shed-btn"} data={item?.day} ></Button>
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
              {selectedTimeSlots?.slice(0, page).map((item) => {
                return generateNumberArray(
                  item?.date?.split("-")[0],
                  item?.date?.split("-")[1]
                )?.map((num, i) => (
                  <tr key={i}>
                    {daysData?.map((day, index) => {
                      return day?.col == true ? (
                        <td key={index} className="mb-3">
                          {num} :00
                        </td>
                      ) : (
                        <td></td>
                      );
                    })}
                  </tr>
                ));
              })}
            </table>
          )}
        </div>
        {selectedTimeSlots?.length >= 3 && (
          <Link>
            {" "}
            <small
              className="d-flex align-items-center fullSchedule justify-content-center orange-link mt-3"
              onClick={() => {
                if (page == 3) {
                  setPage(8);
                } else {
                  setPage(3);
                }
              }}
            >
              {" "}
              Show {page == 3 ? "full" : "half"} Schedule <BsArrowRight />{" "}
            </small>{" "}
          </Link>
        )}
      </div> */}

      <div
        onClick={() => setAvailabilityBOl(true)}
        className=""
      >
        <div className="col-md-12">
          <div className="row justify-content-center gap-3">
            <div className="row avail-time justify-content-center">
              <div className="col-lg-12 justify-content-center p-0">

                {isOpenEditing &&
                  <div className="col-md-10 ms-5 ps-5 d-flex justify-content-center align-items-center">
                    <div className="AvailSlotsText ">
                      <h5>Choose your available timeslots by clicking on the dedicated grids, so we can find the study buddies that match the best with you!   </h5>
                      <p>There are {selectedTimeSlots?.length} time slots chosen: </p>
                    </div>
                  </div>
                }
                <div className={`d-flex gap-4 ${!col && "timeSlotsMain"}`}>
                  <div className={!col ? "col-md-8 " : "col-md-12"}>

                    <table className="time-slot-table">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Mon</th>
                          <th>Tue</th>
                          <th>Wed</th>
                          <th>Thu</th>
                          <th>Fri</th>
                          <th>Sat</th>
                          <th>Sun</th>
                        </tr>
                      </thead>
                      <tbody>
                        {['6-9', '9-12', '12-15', '15-18', '18-21', '21-0', '0-3', '3-6']?.map((time, timeIndex) => (
                          <tr key={timeIndex}>
                            <td>{time}</td>
                            {timeSlots?.map((slot, index) => {
                              return (
                                <td key={index}>
                                  <div
                                    onClick={() => {
                                      if (isOpenEditing) {
                                        toggleTimeSlotSelection(slot.day, time);
                                      }
                                    }}
                                    style={{ cursor: isOpenEditing ? 'pointer' : 'default' }}
                                  >
                                    <img
                                      className="profileimgStyles2"
                                      src={
                                        newState[0]?.some((selectedSlot) =>
                                          selectedSlot.day === slot.day && selectedSlot.time === time
                                        )
                                          ? isOpenEditing
                                            ? check
                                            : defaultSelected
                                          : uncheck
                                      }
                                      alt={
                                        selectedTimeSlots?.some((selectedSlot) =>
                                          selectedSlot.day === slot.day && selectedSlot.time === time
                                        )
                                          ? isOpenEditing
                                            ? 'check'
                                            : 'default-check'
                                          : 'uncheck'
                                      }
                                    />
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>


                  </div>

                  {/* <div style={{ marginTop: 36 }} className="col-md-5 ">
                    <div className="d-flex align-items-center gap-3">
                      <img className="profileimgStyles" src={uncheck} alt="uncheck" />
                      <p className="mb-0">Non available time slots</p>
                    </div>

                    <div style={{ paddingTop: 5 }} className="d-flex align-items-center gap-3">
                      <img className="profileimgStyles" src={isOpenEditing ? check : defaultSelected} alt="uncheck" />
                      <p className="mb-0">Available time slots</p>
                    </div>
                  </div> */}
                </div>




              </div>
            </div>



          </div>
        </div>
      </div>
    </>
  );
};

export default Availbility;
