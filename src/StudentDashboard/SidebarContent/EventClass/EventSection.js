import React, { useEffect, useMemo, useRef, useState } from "react";
import "./EventAndClass.css";
import { BsChevronDown, BsSearch, BsSortDown } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import { event_Class_Event } from "../DummyData/EventandClass";
import { EventCard2 } from "./EventCard2";
import arrowDown from "../../../asserts/images/goalTaskArrowDownRed.svg";
import secureLocalStorage from "react-secure-storage";
import { Loader } from "../../../components/reuseable/Loader";
import { filterArray2, filterArrayEventStudent } from "../../../OrganizationDashboard/OrgSidebarContent/OrgMyEvents/filterArray";
import eventFilterIcon from '../../../asserts/images/eventFilterIcon.svg'
export const EventSection = () => {
  const [show, setShow] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(false);

  const [filteredEvents, setFilteredEvents] = useState([]);

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
  const token = secureLocalStorage.getItem("token");

  useEffect(() => {
    GetEventsData();
  }, []);

  const GetEventsData = () => {
    setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://ilmcircle.com/backend/api/student/favorite/events/all",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {


        if (result?.status == 200) {
          setEvents(result?.data);
          setEventData(result?.data);
          setLoader(false);
          setFilteredEvents(result?.data)
        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });
  };

  function handleInputChange(event) {
    setSelectedItemFilter(1)
    setSearch(event.target.value);
  }

  const [isOpen2, setIsOpen2] = useState(false);
  const [selectedItemFilter, setSelectedItemFilter] = useState(0);
  const handleFilterChange = (e) => {
    setSearch("")
    setIsOpen2(!isOpen2)
    setShow(false)
    setSelectedItemFilter(e)

  }

  const filterEvents = () => {
    let dataFilter = eventData;
    if (search != "") {
      dataFilter = dataFilter.filter(
        (item) =>
          item?.favoriteId?.eventDetail
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          item?.favoriteId?.eventName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedItemFilter == 4) {
      dataFilter = dataFilter?.sort((itemA, itemB) => {
        const endDateA = new Date(itemA?.favoriteId?.endTime);
        const endDateB = new Date(itemB?.favoriteId?.endTime);
        return endDateB - endDateA;
      })
    }

    if (selectedItemFilter == 5) {
      dataFilter = dataFilter?.sort((itemA, itemB) => {
        const startDateA = new Date(itemA?.favoriteId?.startingTime);
        const startDateB = new Date(itemB?.favoriteId?.startingTime);
        return startDateA - startDateB;
      })

    }
    if (selectedItemFilter == 2) {
      dataFilter = dataFilter?.filter((item) => item?.favoriteId?.gender === "male");
    }
    if (selectedItemFilter == 3) {
      dataFilter = dataFilter?.filter((item) => item?.favoriteId?.gender === "female");

    }

    return dataFilter;

  }

  const MemoizedFilterEvents = useMemo(filterEvents, [selectedItemFilter, search]);
  useEffect(() => {
    const filtered = MemoizedFilterEvents
    setFilteredEvents(filtered);
  }, [selectedItemFilter, search]);

  return (
    <div>
      {/* <DashboardNavbar /> */}
      {loader && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div className="container-fluid pb-5">
        <div
          className="goalTask"
          style={{ backgroundColor: "transparent", border: "none" }}
        >
          <div className="goalTaskHeader ">
            <div className="row align-items-center mt-5">
              <div className="col-md-6">
                <div className="goalTaskDoneSection ">
                  <button
                    style={{ width: 140 }}
                    className={`doneBtn eventBtn d-flex align-items-center justify-content-between  py-2`}
                  >
                    <div className=" d-flex align-items-center justify-content-between ">
                      <div
                        className="span "
                        style={{ backgroundColor: "#E47171" }}
                      ></div>
                      Event
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

                    value={search}
                    onChange={handleInputChange}
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
                        {filterArrayEventStudent.map((item, index) => (
                          <div key={index}
                            className="categoryGoal my-2 point px-3"
                            style={{ fontFamily: "Open Sans" }}

                            onClick={() => handleFilterChange(item.id)}

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

            <div className="row mt-1 g-5">
              {filteredEvents?.length ? (
                filteredEvents?.map((item, index) => (
                  <div
                    key={index}
                    className="col-lg-3 col-sm-6 classSectionCards position-relative"
                  >
                    <EventCard2 item={item} index={index} GetEventsData={GetEventsData} />
                  </div>
                ))
              ) : (
                <div className="NoEventsTxt text-center">No Events Found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
