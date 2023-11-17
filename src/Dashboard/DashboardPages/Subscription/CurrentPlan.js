import moment from "moment";
import React from "react";
import { AiOutlineRight } from "react-icons/ai";

export const CurrentPlan = (props) => {
  const formattedDate = (date) => {
    return moment(date).utc().format("HH:mm MMMM DD YYYY");
  }
  return (
    <div className="currentPlan mt-4">
      <div className="border-bottom d-flex align-items-center justify-content-between px-2">
        <div>
          <h5>{formattedDate(props.date)}</h5>
          <p className={props.class}>${props.text}</p>
        </div>
        <div className="changeBtn point">
          <AiOutlineRight />
        </div>
      </div>
    </div>
  );
};
