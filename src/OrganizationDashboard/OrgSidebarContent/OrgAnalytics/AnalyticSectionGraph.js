import React from "react";
import { AttandanceGraph } from "./AttandanceGraph";
import { RepeatGraph } from "./RepeatGraph";
import Piechart from "./RepeatAttandnace";
import AttendantLocationGraph from "./AttendantLocationGraph";
import AgeGraph from "./AgeGraph";

export const AnalyticSectionGraph = () => {
  return (
    <div className="graphSection ">
      <div className="heading mt-5">
        <h3 className="mb-0">People attended</h3>
        <p className="mb-0">
          May 1 - May 30 •
          <span className="fw-bold" style={{ color: "#2F90EC" }}>
            {" "}
            200
          </span>{" "}
          in total •
          <span className="fw-bold" style={{ color: "#B73838" }}>
            {" "}
            -0.1%
          </span>{" "}
          compared to last 30 days
        </p>
      </div>
      <div className="row justify-content-between my-5 ">
        <div className="forColLg7  attandanceGraphMain mt-5 d-sm-flex align-items-center justify-content-center">
          <div>
            <h4 className="graphHeading">Attendance per event</h4>
            <AttandanceGraph />
            <div className="row w-100   mt-3">
              <div className="col-lg-4 col-md-6 dotsMainContainerGraph mt-3 text-center">
                <span></span>
                <p className="mb-0 garphLineName">
                  Islamic Art & Calligraphy Exhibition <b>(125)</b>
                </p>
              </div>
              <div className="col-lg-4 col-md-6 dotsMainContainerGraph mt-2">
                <span style={{ backgroundColor: "#A7E4F8" }}></span>
                <p className="mb-0 garphLineName">
                  Journey Through Islamic History <b> (65)</b>
                </p>
              </div>
              <div className="col-lg-4 col-md-6 dotsMainContainerGraph mt-2">
                <span style={{ backgroundColor: "#D4E8EE" }}></span>
                <p className="mb-0 garphLineName">
                  Arabic Language & Poetry Festival <b> (10) </b>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5  mt-5 repeatAttendanceGraphMain d-flex align-items-center justify-content-center">
          {/* <RepeatGraph /> */}
          <Piechart />
        </div>
        <div className="col-lg-6  pe-lg-4 pt-4 graphPadding ps-0 ">
          <AttendantLocationGraph />
        </div>
        <div className="col-lg-6 pe-lg-4 graphPadding pt-4 ps-0">
          <AgeGraph />
        </div>
      </div>
    </div>
  );
};



