import React, { useEffect, useRef, useState } from "react";
import { BsSearch, BsSortDown, BsUpload } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import { event_Class_Event } from "../../../StudentDashboard/SidebarContent/DummyData/EventandClass";
import { EventsCard } from "./EventsCard";
import { BiPlusCircle } from "react-icons/bi";
import Button from "../../../components/reuseable/Button";
import "./Event.css";
import { CreateEventModal } from "./CreateEventModal";
import { Link, useNavigate } from "react-router-dom";
import { filterArray, sortArray, sortArray2 } from "./filterArray";
import { bindActionCreators } from "redux";
import { actionCreaters } from "../../../Store/Index";
import { useDispatch } from "react-redux";
import { RadioButton } from "./Reuseable/RadioButton";
import arrowDown from "../../../asserts/images/goalTaskArrowDownGreen.svg";
import eventFilterIcon from '../../../asserts/images/eventFilterIcon.svg'
import secureLocalStorage from "react-secure-storage";
import API_Routes from "../../../Routes/API_Routes";
import { Loader } from "../../../components/reuseable/Loader";
import { showMessage } from "../../../components/reuseable/Tostify";
import { setOrgDashboardIndex } from "../../../Store/Actions";
import { useMemo } from "react";
// Changes are done in the componets>>>>>>>>>>>>>>>

export const OrgMyEvents = () => {
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const componentRef = useRef();
  const componentRef2 = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  // const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(0);
  // const [selectedItemFilter, setSelectedItemFilter] = useState("");
  const [selectedItemFilter, setSelectedItemFilter] = useState(0);

  const [getEvents, setGetEvents] = useState([]);
  const [loader, setLoader] = useState(false);
  const [userInput, setUserInput] = useState("");

  const ref = useRef(null);
  const dispatch = useDispatch();
  const { orgDashboardIndex } = bindActionCreators(actionCreaters, dispatch);
  const navigate = useNavigate()
  const token = secureLocalStorage.getItem('token')
  const [selectedFilter, setSelectedFilter] = useState(null);

  const [filteredEvents, setFilteredEvents] = useState([]);




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
  useEffect(() => {
    const handleClick = (event) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  useEffect(() => {
    const handleClick2 = (event) => {
      if (
        componentRef2.current &&
        !componentRef2.current.contains(event.target)
      ) {
        setIsOpen2(false);
      }
    };

    document.addEventListener("click", handleClick2);

    return () => {
      document.removeEventListener("click", handleClick2);
    };

  }, []);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleRadioChange = (e) => {
    setSelectedItem(e);
    setIsOpen(false);
    setIsOpen2(false)
  };
  const handleFilterChange = (e) => {
    setSelectedItemFilter(e)

    setIsOpen(false);
    setIsOpen2(!isOpen2)

  };

  const handleModal = () => {
    setShowModal(!showModal);
  };
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  useEffect(() => {
    GetAllEvents()

  }, [])
  const GetAllEvents = () => {
    setLoader(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    var formdata = new FormData();

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      // body: formdata,
      redirect: 'follow'
    };

    fetch(API_Routes.ALLEVENTS, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('ALLEvents===>', result)

        if (result.status == 200) {
          setGetEvents(result?.data)
          setLoader(false)
          // setFilteredEvents(result?.data)
          setFilteredEvents(result?.data);

        } else {
          showMessage(result?.message, 'error')
          setLoader(false)

        }


      })
      .catch(error => {
        console.log('error', error)
        setLoader(false)

      });
  }

  const filterEvents = () => {
    let dataFilter = getEvents;


    if (userInput === "" && selectedItem === 0 && selectedItemFilter === 0) {
      return getEvents;
    }

    if (userInput !== "") {
      dataFilter = dataFilter.filter((item) => {
        return (
          item.eventName.toLowerCase().includes(userInput.toLowerCase()) ||
          item.entranceFee.toLowerCase().includes(userInput.toLowerCase()) ||
          item.location.toLowerCase().includes(userInput.toLowerCase()) ||
          item.eventDetail.toLowerCase().includes(userInput.toLowerCase()) ||
          item.gender.toLowerCase().includes(userInput.toLowerCase())
        );
      });
    }

    if (selectedItem !== 0) {
      if (selectedItem === 1) {


        dataFilter = dataFilter.filter((item) => item.gender === "male");
        return dataFilter;
      }
      if (selectedItem === 2) {

        dataFilter = dataFilter.filter((item) => item.gender === "female");
        return dataFilter;
      }
      if (selectedItem === 3) {


        const currentDate = new Date();
        dataFilter = dataFilter.filter((item) => {
          const endDate = new Date(item.endTime);
          return endDate > currentDate;
        });
      }
      if (selectedItem === 4) {


        const currentDate = new Date();
        dataFilter = dataFilter.filter((item) => {
          const startDate = new Date(item.startingTime);
          const endDate = new Date(item.endTime);

          return endDate < currentDate;
        })


      }


      if (selectedItem === 5) {
        const currentDate = new Date();


        dataFilter = dataFilter.filter((item) => {
          const startDate = new Date(item.startingTime);
          const endDate = new Date(item.endTime);

          return currentDate >= startDate && currentDate <= endDate;
        });
      }




    }

    if (selectedItem === 1) {
      return dataFilter;
    }
    if (selectedItemFilter === 1) {
      return dataFilter;
    }


    if (selectedItemFilter > 1 && selectedItemFilter < 6) {

      dataFilter = dataFilter.sort((itemA, itemB) => {
        const startDateA = new Date(itemA.startingTime);
        const startDateB = new Date(itemB.startingTime);
        const endDateA = new Date(itemA.endTime);
        const endDateB = new Date(itemB.endTime);

        if (selectedItemFilter == 2) {
          return endDateB - endDateA;
        }

        if (selectedItemFilter == 3) {
          return startDateA - startDateB;

        }
        if (selectedItemFilter == 4) {

          return (endDateA - startDateA) - (endDateB - startDateB);


        }
        if (selectedItemFilter == 5) {

          return (endDateB - startDateB) - (endDateA - startDateA);

        }
      });
    }





    return dataFilter;
  };

  const MemoizedFilterEvents = useMemo(filterEvents, [selectedItem, userInput, selectedItemFilter]);
  useEffect(() => {
    const filtered = MemoizedFilterEvents
    setFilteredEvents(filtered);
  }, [selectedItem, userInput, selectedItemFilter]);

  const handleClickSearch = () => {
    setShow(!show)
    setIsOpen(false);
    setIsOpen2(false)

  }




  return (
    <div className="eventOrganization screenPadding">
      {/* <DashboardNavbar /> */}
      {loader && <div className="loaderScreen">
        <Loader />
      </div>}
      <div className="container-fluid ">
        <div
          className="goalTask"
          style={{ backgroundColor: "transparent", border: "none" }}
        >
          <div className="goalTaskHeader ">
            <div className="row ">
              <div className="col-lg-6 d-flex justify-content-sm-start justify-content-between align-items-center">


                <h5 className="">My event</h5>
                <Button
                  data="Create new"
                  icon={<BiPlusCircle className="me-2 mb-1" />}
                  class="profile-btn2 ms-3"
                  onClick={handleModal}
                />
              </div>
              {getEvents.length ?
                <div
                  style={{ gap: 8 }}
                  className="navSide  col-lg-6 d-flex justify-content-end pe-4"
                >
                  <div className="position-relative" ref={ref} style={{ height: "46px" }}>
                    <input
                      type="text"
                      className={`${show ? "searchFilterInputOpen me-0" : "searchFilterInput me-0"
                        } searchFilterInput`}
                      value={userInput}
                      onChange={handleInputChange}
                      placeholder={show ? "Search" : ""}
                    />
                    <span className="">
                      <BsSearch
                        className={show ? `searchSvg2` : "searchSvg point"}
                        // onClick={() => setShow(!show)}
                        onClick={handleClickSearch}
                        fontSize={" 22px"}
                      />
                    </span>
                  </div>

                  <div className="mt-1 position-relative filterGoal">
                    <span className="goalSectionIcons">
                      <img
                        onClick={toggleDropdown}
                        style={{ width: 40, height: 40 }}
                        className="point"
                        src={eventFilterIcon}
                        alt="eventFilterIcon"
                      />
                    </span>
                    {isOpen && (
                      <div className="eventFilterDropdown mt-2">
                        {filterArray.map((item, index) => (
                          <div className="item " key={index}>
                            <label className="radio-label">
                              <div className="d-flex align-items-center pointer" >
                                <div className="d-flex align-items-center">
                                  <input
                                    type="radio"
                                    className="radio-input"
                                    checked={selectedItem === index}
                                    onChange={() => handleRadioChange(index)}
                                  // onChange={() => {setSelectedItem(index) setIsOpen(false) } }
                                  />
                                  <span className="custom-radio"></span>
                                </div>
                                <div>{item.name}<b> {item.details}</b> </div>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div
                    className="mt-1 position-relative mt-1"
                    ref={componentRef2}
                  >
                    <span className="goalSectionIcons">
                      <BsSortDown
                        className="  point"
                        onClick={() => {
                          setIsOpen2(!isOpen2);
                          setIsOpen(false)
                          setShow(false)
                        }}
                        fontSize={" 22px"}
                      />
                    </span>
                    {isOpen2 && (
                      <div class=" eventFilterDropdown mt-2">
                        {sortArray2.map((item, index) => (
                          <div
                            onClick={() => handleFilterChange(item.id)}
                            className="item"
                            // onClick={() =>  setIsOpen2(!isOpen2)}
                            key={index}
                          >
                            <div>{item.name}<b>{item.details}</b> </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-1 position-relative filterGoal">
                    <span className="goalSectionIcons ">
                      <BsUpload className=" point" fontSize={" 22px"} />
                    </span>
                  </div>

                </div> : ""
              }
            </div>

            <div className="row mt-5 g-4">
              {filteredEvents.length ? filteredEvents?.map((item, index) => (
                <div
                  onClick={() => {
                    navigate(`/organization-dashboard/${9}`, {
                      state: { item: item }
                    });

                  }}
                  key={index}
                  className="col-lg-3 col-md-6 col-sm-6 classSectionCards position-relative"
                >
                  <EventsCard GetAllEvents={GetAllEvents} item={item} index={index} />
                </div>
              ))

                :
                <div className='MediaEdit d-flex align-items-center justify-content-center '>
                  <h4>No Events Found</h4>
                </div>}

            </div>
          </div>
        </div>
        <CreateEventModal showModal={showModal} setShowModal={setShowModal} GetAllEvents={GetAllEvents} handleModal={handleModal} />
      </div>
    </div>
  );
};
