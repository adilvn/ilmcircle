import React, { useState } from "react";
import { sectionOne } from "../../constant/Constant";
import { Link } from "react-router-dom";
import img from "../../asserts/images/masjid.png";
import { ReactSVG } from "react-svg";
import ramdan from "../../asserts/images/ramadan 2.svg";
import myimg from "../../asserts/images/homeOurMission.png";

import { useTranslation } from "react-i18next";
import { useEffect } from "react";
const RightOurMissionSection = ({ data }) => {
  const [missionData, setMsiionData] = useState([]);
  // const text = data[0]?.ourMission?.steps;

  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();
  const steps = data[0]?.ourMission?.steps
    ? JSON.parse(data[0]?.ourMission?.steps)
    : [];

  return (
    <>
      <div className="container">
        <div className="row w-100 section-one px-lg-0 px-3 homesectionRight align-items-sm-center  justify-content-center ">
          <div className="homesectionfour p10">
            <img
              style={{ width: 500 }}
              className="img-fluid"
              src={data[0]?.ourMission?.image?.url}
              alt=""
            />
          </div>
          <div className="homesectionfour2 p10 d-flex align-items-center">
            <div className="content-sec-one">
              <h2 style={{ textAlign: "center" }}>
                {data[0]?.ourMission?.title}
              </h2>
              <p className="pt-2 ">{data[0]?.ourMission?.description}</p>
            </div>
          </div>
        </div>

        <div className="row step-row px-3 mt-5 justify-content-center">
          {steps?.map((item, index) => (
            <div key={item} className="col-lg-3 col-md-6 p-0 m-0 ">
              <h1 className="step-home">
                <span className="step-mark">{index + 1}</span>&nbsp;{" "}
                {item?.title}
              </h1>
              <p className="text-center pt-2 text-interWord homeRighttextParagraph">
                {item?.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RightOurMissionSection;
