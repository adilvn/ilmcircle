//Events.js code after adding km  in filter



import React, { useState } from "react";
import "../dashboard.css";

//-------------components----------------//
import DashboardNavbar from "../DashboardCmp/DashboardNavbar";
import Footer from "../../layout/Footer";
import Button from "../../components/reuseable/Button";
import InputField from "../../components/reuseable/InputField";
import LikeButton from "../DashboardCmp/Likebutton";

//--------------dummay data------------------------//
//-------------libaray-------------------------//
import { SlLocationPin } from "react-icons/sl";
import { ReactSVG } from "react-svg";
import { Link, useNavigate } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars-2";
import { BiArrowBack } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
//-------------images-------------------------//
import download from "../../asserts/images/download.svg";
import eventLocation from "../../asserts/images/eventLocation.svg";
import { DropDown } from "./DropDown";
import { Loader } from "../../components/reuseable/Loader";
import { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import { format } from "date-fns";
import { DropDownNew } from "./DropDownNew";
import API_Routes from "../../Routes/API_Routes";
import { showMessage } from "../../components/reuseable/Tostify";

const Events = () => {
  const role = secureLocalStorage.getItem("role");
  const navigate = useNavigate()
  const [items, setItems] = useState([]);
  const [EventData, setEventData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [endingDate, setEndingDate] = useState([])
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedGender, setSelectedGender] = useState('')
  const [selectedDistance, setSelectedDistance] = useState("")
  const [newSelectedDistance, setNewSelectedDistance] = useState([])


  const [inputValue, setInputValue] = useState('')
  const [changeInputValue, setChangeInputValue] = useState("")
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentCity, setCurrentCity] = useState(null);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = {
          lat: position?.coords?.latitude,
          lng: position?.coords?.longitude,
        };
        curreCity(userLocation)
        setSelectedLocation(userLocation);
      });
    }
  }, []);
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }



  ///like unlike condition maping ////////
  const handleLike = (itemId, liked) => {
    const updatedItems = EventData.map((item) => {
      if (item.id === itemId) {
        return { ...item, liked };
      }
      return item;
    });
    setItems(updatedItems);
  };
  const token = secureLocalStorage.getItem("token");

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
    if (role != "student") {
      navigate("/")
    }
    GetEventsData();

  }, []);


  const GetEventsData = async () => {
    setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://ilmcircle.com/backend/api/student/allevents",
        requestOptions
      );

      if (response.status === 200) {
        const result = await response.json();

        setEndingDate(result?.data.startingTime);
        const data = result?.data.reverse();
        setLoader(false);

        const parsedData = data?.map((item) => {
          if (item?.location && item?.location !== '[object Object]') {
            try {
              const locationString = item?.location?.replace(/^"(.*)"$/, "$1");
              item.location = JSON.parse(locationString);
            } catch (error) {
              console.error(`Error parsing location --->:`, error);
            }
          }
          return item;
        });

        // Get user's location
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const userLocation = {
          lat: position?.coords?.latitude,
          lng: position?.coords?.longitude,
        };
        const userLat = userLocation?.lat;
        const userLon = userLocation?.lng;


        const updatedEventData = parsedData?.map((event) => {
          const lat1 = userLat;
          const lon1 = userLon;
          const lat2 = event?.location?.lat;
          const lon2 = event?.location?.long;
          const R = 6371;
          const dLat = (lat2 - lat1) * (Math.PI / 180);
          const dLon = (lon2 - lon1) * (Math.PI / 180);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;
          return { ...event, distance };
        });



        setEventData(updatedEventData);

        const SelectedDistance2 = [...new Set(updatedEventData?.map((distance) => distance?.distance?.toFixed(2)?.toString()))];

        const SelectedDistance2WithKM = SelectedDistance2.map((distance) => distance + " KM");


        setNewSelectedDistance(SelectedDistance2WithKM);


      } else {
        setLoader(false);
      }
    } catch (error) {
      console.log("error", error);
      setLoader(false);
    }
  };

  function formatDate(dateString, time) {
    if (dateString) {
      const date = new Date(dateString);

      if (time) {
        const timeRegex = /^(\d{1,2}):(\d{2}) (AM|PM)$/;
        const match = time.match(timeRegex);

        if (match) {
          const [_, hours, minutes, ampm] = match;
          const isPM = ampm === "PM";

          if (isPM && hours !== "12") {
            date.setHours(parseInt(hours, 10) + 12, parseInt(minutes, 10));
          } else {
            date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
          }
        } else {
          console.error("Invalid time format");
          return null;
        }
      }

      const formattedDate = format(date, "EEE • MMM d • h a 'CEST'");
      return formattedDate;
    }

    return null;
  }


  const endingTimeOfEvent = [...new Set(EventData.map((time) => time.startingTime))];
  const selectGender = [...new Set(EventData.map((gender) => gender.gender))];



  const handleSelectDistance = (item) => {
    setSelectedDistance(item);
    setCurrentPage(1);
  };
  const handleSelectDate = (item) => {
    setSelectedDate(item);
    setCurrentPage(1);
  };
  const handleSelectGender = (item) => {
    setSelectedGender(item);
    setCurrentPage(1);
  };

  let lengthData = EventData.length
  const filterData = (currentPage, itemsPerPage) => {
    let filteredData = EventData;
    lengthData = EventData.length

    if (selectedDate === '' && selectedGender === '' && changeInputValue === "" && selectedDistance === "") {
      return filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
    }

    if (selectedGender !== '' && selectedDate === '') {
      filteredData = filteredData.filter((item) => item?.gender === selectedGender);
      lengthData = filteredData?.length
    }

    if (selectedDate !== '' && selectedGender === '') {
      filteredData = filteredData?.filter((item) => item?.startingTime === selectedDate);
      lengthData = filteredData?.length
    }

    if (selectedDate !== '' && selectedGender !== '') {
      filteredData = filteredData?.filter(
        (item) => item?.gender === selectedGender && item?.startingTime === selectedDate
      );
      lengthData = filteredData.length
    }
    if (inputValue != "") {

      filteredData = filteredData?.filter((item) => {
        return (
          item?.location?.location?.toLowerCase()?.includes(inputValue?.toLowerCase()) ||
          item?.eventName.toLowerCase()?.includes(inputValue?.toLowerCase()) ||
          item?.createBy[0]?.orgName?.toLowerCase()?.includes(inputValue?.toLowerCase())

        );



      });
      lengthData = filteredData.length

    }


    if (selectedDistance !== '') {

      const selectedDistanceWithoutKM = parseFloat(selectedDistance.replace(' KM', ''));
      const tolerance = 0.01;

      filteredData = filteredData?.filter(
        (item) => {

          return Math.abs(item?.distance - selectedDistanceWithoutKM) < tolerance;
        }
      );

      lengthData = filteredData.length;
    }



    lengthData = filteredData.length
    return filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  };



  const curreCity = (selectedLocations) => {
    const apiKey = 'AIzaSyCByyO3JtJCxeA23nnf-GZUzLR4DikY-0o';
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${selectedLocations?.lat},${selectedLocations?.lng}&key=${apiKey}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'OK' && data.results.length > 0) {
          const addressComponents = data.results[0].address_components;
          for (const component of addressComponents) {
            if (component.types.includes('locality')) {
              const cityName = component.long_name;
              setCurrentCity(cityName)
              break;
            }
          }
        } else {
          console.log('Unable to retrieve city name.');
        }
      })
      .catch((error) => {
        console.error('Error while fetching data:', error);
      });
  }
  const filteredEventData = filterData(currentPage, itemsPerPage);
  const totalPages = Math.ceil(lengthData / itemsPerPage);
  const visibleButtons = 3;
  const buttonsNextAndPrevious = 2;

  let firstButton = Math.max(1, currentPage - buttonsNextAndPrevious);
  let lastButton = Math.min(totalPages, currentPage + buttonsNextAndPrevious);
  if (lastButton - firstButton < visibleButtons - 1) {
    if (currentPage <= buttonsNextAndPrevious) {
      lastButton = Math.min(totalPages, visibleButtons);
    } else {
      firstButton = Math.max(1, totalPages - visibleButtons + 1);
    }
  }


  useEffect(() => {
    if (!token) {
      navigate('/login')
    } if (role != "student") {
      navigate("/")
    }

    filterData();
  }, [selectedDate, selectedGender, selectedDistance, inputValue]);
  const handleClearFilter = () => {
    setSelectedDate('')

    filterData();
  }
  const handleClearFilter3 = () => {
    setSelectedDistance("");
    filterData();
  }
  const handleClearFilter2 = () => {
    setSelectedGender('')
    filterData();
  }
  const handleSearchClick = () => {
    setSelectedDate("")
    setSelectedGender("")

    setChangeInputValue(inputValue)

  }

  return (
    <>
      {role === "student" ?
        <>

          {loader && (
            <div className="loaderScreen">
              <Loader />
            </div>
          )}

          <DashboardNavbar />

          <section>
            <div className="container bg-pink-victor">
              <div className=" bg-pink-victor-box"></div>
              <div className="events-heading">
                <h6 className="text-center findEventMainHeading">Find Events</h6>
              </div>
              <div className="d-flex sticky-top  just-between event-responsive">
                <div className="search-input">
                  <InputField
                    placeholder="Search city, organization, subject..."
                    type="text"
                    className="eventInputField"
                    value={inputValue}
                    onInput={(e) => setInputValue(e.target.value)}

                  />
                  <span className="location-style">
                    <img className="me-1" src={eventLocation} alt="eventLocation" />{" "}
                    {currentCity ? currentCity : "Location"}
                  </span>
                </div>
                <div>
                  <Button class={"profile-btn"} data={"Search"} onClick={handleSearchClick} />
                </div>
              </div>

              <div className="event-row">
                <div className="event-box-one px-lg-0  px-3">
                  <div className="mb form-main pt-md-3 pt-0">
                    <label htmlFor="fname">Date </label>
                    <DropDownNew dataDrop={endingTimeOfEvent}
                      onSelectItem={handleSelectDate}
                      onClearFilter={handleClearFilter}
                    />
                  </div>
                  <div className="mb form-main">
                    <label htmlFor="fname">Distance </label>

                    <DropDownNew dataDrop={newSelectedDistance}
                      onSelectItem={handleSelectDistance}
                      onClearFilter={handleClearFilter3}
                    />

                  </div>

                  <div className="mb form-main">
                    <label htmlFor="fname">Participant Gender </label>
                    <DropDownNew dataDrop={selectGender}
                      onSelectItem={handleSelectGender}
                      onClearFilter={handleClearFilter2}

                    />


                  </div>

                </div>

                <div className="event-box-two">
                  {/* <Scrollbars style={{ height: 800 }}> */}
                  <div className="p-scroll px-0">
                    <h5 className="eventexploreText">
                      {lengthData} events to explore
                    </h5>
                    {filteredEventData?.length
                      ? filteredEventData?.map((item, index) => {
                        return (
                          <div key={index} className="border-card">
                            <div className="event-card">
                              <div>
                                <Link to={`/events-details/${item.id}/${item.userId}`}>
                                  < img
                                    className="img-fluid"
                                    src={item?.images[0]?.url}
                                    alt=""
                                  />
                                </Link >
                              </div >
                              <div className="card-content-event">
                                {item?.startingTime !== 'Invalid date' && item?.startingTime !== 'Invalid time value' && (
                                  <h5>{formatDate(item?.startingTime, item?.eventTime)}</h5>
                                )}                                <h3>{item.eventName}</h3>
                                <p className="text-muted d-flex align-items-center">
                                  {item?.createBy?.orgName
                                    ? item?.createBy?.orgName
                                    : item?.createBy[0]?.orgName}
                                  <span className="p-1 bg-dark mx-2 rounded-circle"></span>{" "}
                                  {item?.location?.location}
                                </p>


                                <div className="d-flex justify-content-end">

                                  <ul className="d-flex card-event-icon">
                                    <LikeButton
                                      itemId={item?._id}
                                      initialLiked={item?.isfavorite}
                                      handleLike={(item) => handleLike(item)}
                                      name="Event"
                                      runData={true}
                                      GetEventsData={GetEventsData}
                                    />
                                    <li>
                                      <ReactSVG src={download} />
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div >
                          </div >
                        );
                      })
                      : "No event found"}
                    {
                      lengthData > itemsPerPage ?
                        <nav
                          className="justify-content-center d-flex eventPage"
                          aria-label="Page navigation example "
                        >
                          <ul class="pagination">
                            {currentPage > 1 && (
                              <li class="page-item">
                                <button
                                  class="page-link"
                                  onClick={() => handlePageChange(currentPage - 1)}
                                >
                                  <span className="me-2">
                                    <BiArrowBack color="grey" fontSize={"16px"} />
                                  </span>
                                  Prev
                                </button>
                              </li>
                            )}
                            {Array.from(
                              { length: lastButton - firstButton + 1 },
                              (_, index) => index + firstButton
                            ).map((page) => (
                              <li className={`page-item `} key={page}>
                                <button
                                  className={`page-link ${currentPage === page ? "active" : ""
                                    }`}
                                  onClick={() => handlePageChange(page)}
                                >
                                  {page}
                                </button>
                              </li>
                            ))}

                            {currentPage < totalPages && (
                              <li class="page-item">
                                <button
                                  class="page-link"
                                  onClick={() => handlePageChange(currentPage + 1)}
                                >
                                  Next
                                  <span className="ms-2">
                                    <BsArrowRight color="grey" fontSize={"16px"} />
                                  </span>
                                </button>
                              </li>
                            )}
                          </ul>
                        </nav> : ""
                    }
                  </div >
                  {/* </Scrollbars> */}
                </div >
              </div >
            </div >
          </section >
          <Footer />
        </> : ""
      }


    </>
  );
};

export default Events;





