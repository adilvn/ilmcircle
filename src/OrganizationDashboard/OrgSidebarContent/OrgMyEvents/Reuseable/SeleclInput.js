

import React, { useState, useEffect } from "react";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";

export const SeleclInput = ({
  name,
  id,
  status,
  noData,
  disabled,
  defaultValue,
  dateEdit,
  onChange,
  selectedStartDate,
  setSelectedStartDate
}) => {
  const [showMonth, setShowMonth] = useState(false);
  const [showDay, setShowDay] = useState(false);
  const [date, setDate] = useState(selectedStartDate || {});
  const [showYear, setShowYear] = useState(false);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  const year = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getMaxDaysInMonth = (year, monthIndex) => {
    if (monthIndex === 1) {
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        return 29;
      } else {
        return 28;
      }
    } else {
      const maxDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      return maxDaysInMonth[monthIndex];
    }
  };

  const handleYearChange = (selectedYear) => {
    setSelectedStartDate({ ...selectedStartDate, year: selectedYear, month: "", day: "" });
    setShowYear(false);
    setShowMonth(false);
    setShowDay(false);
  };

  const handleMonthChange = (selectedMonthIndex) => {
    setSelectedStartDate({ ...selectedStartDate, month: selectedMonthIndex, day: 0 });
    setShowMonth(false);
    setShowDay(false);
  };

  const handleDayChange = (selectedDay) => {
    setSelectedStartDate({ ...selectedStartDate, day: parseInt(selectedDay) });
    setShowDay(false);
    onChange(`${selectedStartDate.month + 1}/${selectedDay}/${selectedStartDate.year}`);
  };

  useEffect(() => {
    if (selectedStartDate) {
      const monthName = month[selectedStartDate.month];
      setDate({ day: selectedStartDate.day, month: monthName, year: selectedStartDate.year });
    }
  }, [selectedStartDate]);

  const isCurrentYear = selectedStartDate.year === currentYear;
  const isNextYear = selectedStartDate.year === currentYear + 1;
  const isCurrentMonth = isCurrentYear && selectedStartDate.month + 1 === currentMonth;


  const isMonthDisabled = (monthIndex) => {
    if (selectedStartDate.year < currentYear) {

      return true;
    } else if (selectedStartDate.year === currentYear) {

      return monthIndex < currentMonth - 1;
    } else {
      return false;
    }
  }






  return (
    <div>
      {!noData && (
        <p
          className={
            status !== 1
              ? "textheading mb-1 mt-24px"
              : "textheading dateLocationText mb-1 mt-24px"
          }
        >
          {name} {status !== 1 ? "time (required)" : ""}
        </p>
      )}
      <div className="row">
        <div className="col-md-4 col-sm-6 mb-sm-0 mb-2">
          <div
            className="inputFields w-100 position-relative pointer"
            onClick={() => {
              if (dateEdit) {
                setShowYear(!showYear);
                setShowDay(false);
                setShowMonth(false);
              }
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>{selectedStartDate.year ? selectedStartDate.year : "Year"}</div>
              <span className="float-end">
                {showYear ? (
                  <BiChevronDown fontSize={"20px"} />
                ) : (
                  <BiChevronRight fontSize={"20px"} />
                )}
              </span>
            </div>
          </div>
          {showYear && (
            <div className="monthDropdown pt-1 mt-3">
              {year.map((item) => (
                <div
                  className={`my-2 ps-2 pointer${isCurrentYear && item < currentYear ? " disabled" : ""}`}
                  key={item}
                  onClick={() => {
                    if (!isCurrentYear || item >= currentYear) {
                      handleYearChange(item);
                    }
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="col-md-4 col-sm-6 mb-sm-0 mb-2">
          <div
            className="inputFields w-100 position-relative pointer"
            onClick={() => {
              if (dateEdit) {
                setShowMonth(!showMonth);
                setShowYear(false);
                setShowDay(false);
              }
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>{month[selectedStartDate.month] ? month[selectedStartDate.month] : "Month"}</div>
              <span className="float-end">
                {showMonth ? (
                  <BiChevronDown fontSize={"20px"} />
                ) : (
                  <BiChevronRight fontSize={"20px"} />
                )}
              </span>
            </div>
          </div>
          {selectedStartDate?.year && showMonth ? (
            <div className="monthDropdown pt-1 mt-3">
              {month.map((item, index) => (
                <div
                  className={`my-2 ps-2 pointer${isMonthDisabled(index) ? " disabled class-grey-color" : ""}`}
                  key={item}
                  onClick={() => {
                    if (!isMonthDisabled(index)) {
                      handleMonthChange(index);
                    }
                  }}

                  disabled={isMonthDisabled(index)}
                >
                  {item}
                </div>
              ))}
            </div>
          ) : ""}


        </div>
        <div className="col-md-4 col-sm-6 mb-sm-0 mb-2">
          <div
            className="inputFields w-100 position-relative pointer"
            onClick={() => {
              if (dateEdit) {
                setShowDay(!showDay);
                setShowMonth(false);
                setShowYear(false);
              }
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div type="text" className="w-100">
                {selectedStartDate.day ? selectedStartDate.day : "Day"}
              </div>
              <span className="float-end">
                {showDay ? (
                  <BiChevronDown fontSize={"20px"} />
                ) : (
                  <BiChevronRight fontSize={"20px"} />
                )}
              </span>
            </div>
          </div>
          {(selectedStartDate?.month !== "" && selectedStartDate?.year && showDay) ? (
            <div className="monthDropdown pt-1 mt-3">
              {Array.from({ length: getMaxDaysInMonth(selectedStartDate.year, selectedStartDate.month) }, (_, i) => (
                <div
                  className={`my-2 ps-2 pointer${isCurrentYear && isCurrentMonth && i < currentDay - 1 ? " disabled class-grey-color" : ""}`}
                  key={i}
                  onClick={() => {
                    if (!isCurrentYear || !isCurrentMonth || i >= currentDay - 1) {
                      handleDayChange(i + 1);
                    }
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          ) : ""}
        </div>
      </div>
    </div>
  );
};
