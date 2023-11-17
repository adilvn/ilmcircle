import React from "react";
import { Organizers } from "./Organizers";

export const EventOrganizer = ({ aboutData }) => {
  return (
    <div className="eventOrganizer mx-4">

      <div className="mt-5">
        <h4 className="ms-md-0 ms-3">Board members</h4>
        <div className="mt-3">
  
          <Organizers aboutData={aboutData} />
        </div>
   
      </div>
    </div>
  );
};

     {/* <div className="mt-5">
          <div className="d-flex justify-content-between">
            <h4>Members(12)</h4>
            <h2 className="seeallMember point">
              See all <BsArrowRight />
            </h2>
          </div>
          <div className="mt-3">
            <Member />
          </div>
        </div>
        <div className="">
          <EventFeedback
            class1="m-0"
            class2="justify-content-start"
            class3="ms-3"
          />
        </div> */}