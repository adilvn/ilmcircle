


import React, { useState, useEffect } from "react";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";

export const NewSelectedInput2 = ({
    name,
    id,
    status,
    noData,
    disabled,
    defaultValue,
    dateEdit,
    onChange,
    selectedStartDateEnd,
    setSelectedStartDateEnd,
    sendStartingDate,
}) => {
    const [showMonth, setShowMonth] = useState(false);
    const [showDay, setShowDay] = useState(false);
    const [date, setDate] = useState(selectedStartDateEnd || {});
    const [showYear, setShowYear] = useState(false);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();


    const year = Array.from({ length: 31 }, (_, i) => currentYear + i);
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
        setSelectedStartDateEnd({ ...selectedStartDateEnd, year: selectedYear, month: "", day: "" });
        setShowYear(false);
        setShowMonth(false);
        setShowDay(false);
    };

    const handleMonthChange = (selectedMonthIndex) => {
        setSelectedStartDateEnd({ ...selectedStartDateEnd, month: selectedMonthIndex, day: 0 });
        setShowMonth(false);
        setShowDay(false);
    };

    const handleDayChange = (selectedDay) => {
        setSelectedStartDateEnd({ ...selectedStartDateEnd, day: parseInt(selectedDay) });
        setShowDay(false);
        onChange(`${selectedStartDateEnd.month + 1}/${selectedDay}/${selectedStartDateEnd.year}`);
    };

    useEffect(() => {
        if (selectedStartDateEnd) {
            const monthName = month[selectedStartDateEnd.month];
            setDate({ day: selectedStartDateEnd.day, month: monthName, year: selectedStartDateEnd.year });
        }
    }, [selectedStartDateEnd]);

    const isCurrentYear = selectedStartDateEnd.year === currentYear;
    const isNextYear = selectedStartDateEnd.year === currentYear + 1;
    const isCurrentMonth = isCurrentYear && selectedStartDateEnd.month + 1 === currentMonth;

    const isMonthDisabled = (monthIndex) => {
        if (selectedStartDateEnd.year < sendStartingDate.year ||
            (selectedStartDateEnd.year === sendStartingDate.year &&
                monthIndex < sendStartingDate.month)

        ) {
            return true;
        }
        if (
            selectedStartDateEnd.year === sendStartingDate.year &&
            monthIndex + 1 === sendStartingDate.month &&
            monthIndex <= currentMonth - 2
        ) {
            return true;
        }
        return false;
    };

    const isDayDisabled = (day) => {
        if (
            selectedStartDateEnd.year < sendStartingDate.year ||
            (selectedStartDateEnd.year === sendStartingDate.year &&
                selectedStartDateEnd.month < sendStartingDate.month) ||
            (selectedStartDateEnd.year === sendStartingDate.year &&
                selectedStartDateEnd.month === sendStartingDate.month &&
                day < sendStartingDate.day)
        ) {
            return true;
        }
        if (
            selectedStartDateEnd.year === sendStartingDate.year &&
            selectedStartDateEnd.month === sendStartingDate.month &&
            day === sendStartingDate.day &&
            day < currentDay
        ) {
            return true;
        }
        return false;
    };



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
                <div className="col-md-4 col-sm-6">
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
                            <div>{selectedStartDateEnd.year ? selectedStartDateEnd.year : "Year"}</div>
                            <span className="float-end">
                                {showYear ? (
                                    <BiChevronDown fontSize={"20px"} />
                                ) : (
                                    <BiChevronRight fontSize={"20px"} />
                                )}
                            </span>
                        </div>
                    </div>
                    {(sendStartingDate?.year && showYear && sendStartingDate?.day) ? (
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
                    ) : ""}
                </div>
                <div className="col-md-4 col-sm-6">
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
                            <div>{month[selectedStartDateEnd.month] ? month[selectedStartDateEnd.month] : "Month"}</div>
                            <span className="float-end">
                                {showMonth ? (
                                    <BiChevronDown fontSize={"20px"} />
                                ) : (
                                    <BiChevronRight fontSize={"20px"} />
                                )}
                            </span>
                        </div>
                    </div>
                    {(sendStartingDate?.year && (sendStartingDate?.month === 0 || sendStartingDate?.month > 0) && sendStartingDate?.day && selectedStartDateEnd?.year && showMonth) ? (
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
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    ) : ""}
                </div>

                <div className="col-md-4 col-sm-6">
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
                                {selectedStartDateEnd.day ? selectedStartDateEnd.day : "Day"}
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
                    {(sendStartingDate?.year && (sendStartingDate?.month === 0 || sendStartingDate?.month > 0) && sendStartingDate?.day && (selectedStartDateEnd?.month === 0 || selectedStartDateEnd?.month > 0) && selectedStartDateEnd?.year && showDay) ? (
                        <div className="monthDropdown pt-1 mt-3">
                            {Array.from(
                                { length: getMaxDaysInMonth(selectedStartDateEnd.year, selectedStartDateEnd.month) },
                                (_, i) => (
                                    <div
                                        className={`my-2 ps-2 pointer${isDayDisabled(i + 1) ? " disabled class-grey-color" : ""
                                            }`}
                                        key={i}
                                        onClick={() => {
                                            if (!isDayDisabled(i + 1)) {
                                                handleDayChange(i + 1);
                                            }
                                        }}
                                    >
                                        {i + 1}
                                    </div>
                                )
                            )}
                        </div>
                    ) : ""}
                </div>
            </div>
        </div>
    );
};













