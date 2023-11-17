import React, { useState } from "react";
import { MdClose, MdEdit } from "react-icons/md";

import { BsUpload } from "react-icons/bs";
import { AiOutlineRight } from "react-icons/ai";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import { useEffect } from "react";
export const SelectedInput = ({
    name,
    id,
    status,
    noData,
    disabled,
    defaultValue,
    onChange, // Add an onChange prop to receive the selected date
}) => {
    const [showMonth, setShowMonth] = useState(false);
    const [showDay, setShowDay] = useState(false);
    const [date, setDate] = useState(defaultValue || {});
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

    const monthNumberToName = (monthNumber) => {
        return month[parseInt(monthNumber) - 1];
    };

    const handleYearChange = (e) => {
        setDate({ ...date, year: e.target.value });
    };

    const handleMonthChange = (selectedMonth) => {
        setDate({ ...date, month: selectedMonth });
        setShowMonth(false);
    };
    const handleDayChange = (selectedDay) => {
        setDate({ ...date, day: selectedDay });
        const formattedDate = `${date.month}/${selectedDay}/${date.year}`;
        onChange(formattedDate);
    };

    useEffect(() => {
        const month = monthNumberToName(defaultValue?.month || "");
        setDate({ day: defaultValue?.day || "", month: month, year: defaultValue?.year || "" });
    }, [defaultValue]);



    return (
        <div>
            {console.log('date===>', date)}

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
                    <input
                        type="text"
                        placeholder="Year"
                        className="inputFields w-100"
                        value={date.year || ''}
                        onChange={handleYearChange}
                    />
                </div>
                <div className="col-md-4 col-sm-6">
                    <div
                        className="inputFields w-100 position-relative pointer"
                        onClick={() => setShowMonth(!showMonth)}
                    >
                        <div className="d-flex justify-content-between align-items-center">
                            <div>{date.month ? date.month : 'Month'}</div>
                            <span className="float-end">
                                {showMonth ? <BiChevronDown fontSize={"20px"} /> : <BiChevronRight fontSize={"20px"} />}
                            </span>
                        </div>
                    </div>
                    {showMonth && (
                        <div className="monthDropdown pt-1 mt-3">
                            {month.map((item) => (
                                <div
                                    className="my-2 ps-2 pointer"
                                    key={item}
                                    onClick={() => handleMonthChange(item)}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="col-md-4 col-sm-6">
                    <div className="inputFields w-100 position-relative pointer" onClick={() => setShowDay(!showDay)}>


                        <div className="d-flex justify-content-between align-items-center">
                            <div type="text" className="w-100">
                                {date.day ? date.day : 'Day'}
                            </div>
                            <span className="float-end">
                                {showDay ? <BiChevronDown fontSize={"20px"} /> : <BiChevronRight fontSize={"20px"} />}
                            </span>
                        </div>

                    </div>
                    {showDay && (
                        <div className="monthDropdown pt-1 mt-3">
                            {Array.from(Array(31).keys()).map((item) => (
                                <div
                                    className="my-2 ps-2 pointer"
                                    key={item}
                                    onClick={() => handleDayChange(item + 1)}
                                >
                                    {item + 1}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

