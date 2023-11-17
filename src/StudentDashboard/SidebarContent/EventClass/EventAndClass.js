import React, { useEffect, useRef, useState } from "react";
import "./EventAndClass.css";
import { BsChevronDown, BsSearch, BsSortDown } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import img from "../../../asserts/images/download.svg";
import { event_Class } from "../DummyData/EventandClass";
import { EventCard } from "./EventCard";
import arrowDown from "../../../asserts/images/goalTaskArrowDownGreen.svg";
import eventFilterIcon from '../../../asserts/images/eventFilterIcon.svg'
import { filterArray, filterArray2, sortArrayLibrary2 } from "../../../OrganizationDashboard/OrgSidebarContent/OrgMyEvents/filterArray";
export const EventAndClass = () => {
  const [show, setShow] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [isOpen2, setIsOpen2] = useState(false);
  return (
    <div>
      {/* <DashboardNavbar /> */}
      <div className="container-fluid ">
        <div
          className="goalTask"
          style={{ backgroundColor: "transparent", border: "none" }}
        >
          <div className="goalTaskHeader ">
            <h5 className="">My Events and Classes</h5>
            <div className="row align-items-center mt-5">
              <div className="col-md-6 ">
                <div className="goalTaskDoneSection">
                  <button style={{ width: 140 }} className={`doneBtn d-flex align-items-center justify-content-between  py-2`}>
                    <div className=" d-flex align-items-center justify-content-between ">
                      <div className="span"></div>
                      Class
                    </div>
                    <img className="ms-2" src={arrowDown} alt="arrowDown" />
                  </button>
                </div>
              </div>


              <div style={{ gap: 8 }} className="navSide  col-md-6 d-flex justify-content-end  pt-sm-0 pt-4">
                <div className="position-relative" ref={ref}>
                  <input
                    type="text"
                    className={`${show ? "searchFilterInputOpen me-0" : "searchFilterInput me-0"
                      } searchFilterInput`}
                    placeholder={show ? "Search" : ""}
                  />
                  <span className="">
                    <BsSearch
                      className={show ? `searchSvg2` : "searchSvg point"}
                      onClick={() => setShow(!show)}
                      fontSize={" 22px"}
                    />
                  </span>
                </div>

                <span className="goalSectionIcons filterGoal">
                  <img style={{ width: 40, height: 40 }} className="point" src={eventFilterIcon} alt="eventFilterIcon" />
                </span>

                <span className="goalSectionIcons">

                  
                <div className="mt-1 position-relative mt-1">
                  <span className="goalSectionIcons mt-1">
                    <BsSortDown
                      className="  point"
                      onClick={() => {
                        setIsOpen2(!isOpen2);
                        // setIsOpen1(false);
                      }}
                      fontSize={" 26px"}
                    />
                  </span>
                  {isOpen2 && (
                    <div
                      className="categroyDropDown z-3  mt-2 position-absolute end-0 width-dropDown"
                      
                    >
                      {filterArray2.map((item, index) => (
                        <div key={index}
                          className="categoryGoal my-2 point px-3"
                          style={{ fontFamily: "Open Sans" }}
                          onClick={() => setIsOpen2(!isOpen2)}
                         
                        ><div>{item.name}<b>{item.details}</b></div>
                          
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                  {/* <BsSortDown className=" point" fontSize={" 23px"} /> */}
                </span>
              </div>
            </div>

            <div className="row mt-sm-5 mt-3 g-4">
              <div className="commingSoonTxt text-center">
                Coming Soon
              </div>
              {/* {event_Class.map((item, index) => (
                <div
                  key={index}
                  className="col-lg-3 col-sm-6  classSectionCards position-relative"
                >
                  <EventCard item={item} index={index} />
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
