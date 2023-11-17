import React from "react";
import "./OrgDashboard.css";
import { UpComingEvents } from "./UpComingEvents";
import { ResourceLibrary } from "./ResourceLibrary";
import { MessageSection } from "./MessageSection";
import { FeedbackMain } from "./FeedbackMain";
import { Analytics } from "./Analytics";
import { bindActionCreators } from "redux";
import { actionCreaters } from "../../../Store/Index";
import { useDispatch } from "react-redux";
const OrgDashboardMain = () => {
  const dispatch = useDispatch();
  const { orgDashboardIndex } = bindActionCreators(actionCreaters, dispatch);


  return (
    <div className="mainDashboardPage">
      <div className="orgDashboardMain">
        <div className="row g-4">
          <div className="col-xl-7 ">
            <UpComingEvents orgDashboardIndex={orgDashboardIndex} />
          </div>
          <div className="col-xl-5 col-lg-6">
            <Analytics orgDashboardIndex={orgDashboardIndex} />
          </div>
          <div className="col-xxl-4 col-lg-6">
            <ResourceLibrary orgDashboardIndex={orgDashboardIndex} />
          </div>
          <div className="col-xxl-4 col-lg-6">
            <MessageSection orgDashboardIndex={orgDashboardIndex} />
          </div>
          <div className="col-xxl-4 col-lg-6">
            <FeedbackMain orgDashboardIndex={orgDashboardIndex} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgDashboardMain;



