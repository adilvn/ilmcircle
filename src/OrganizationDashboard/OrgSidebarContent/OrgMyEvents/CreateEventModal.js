import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";

import { AiOutlineRight } from "react-icons/ai";
import { EventStep1 } from "./EventStep1";
import { EventStep2 } from "./EventStep2";
import secureLocalStorage from "react-secure-storage";

import { FaRegMap } from "react-icons/fa";
import { SeleclInput } from "./Reuseable/SeleclInput";
import Button from "../../../components/reuseable/Button";

import {
  BiArrowToTop,
  BiChevronDown,
  BiChevronUp,
  BiChevronRight,
} from "react-icons/bi";
import { useRef } from "react";
import CheckBox from "../Notification/CheckBox";
import moment from "moment";
import { useDropzone } from "react-dropzone";
import { showMessage } from "../../../components/reuseable/Tostify";
import { SelectedInput } from "./Reuseable/SelectedInput";
import API_Routes from "../../../Routes/API_Routes";
import { SelectedInput2 } from "./Reuseable/SelectedInput2";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import { Loader } from "../../../components/reuseable/Loader";


export const CreateEventModal = ({
  showModal,
  handleModal,
  setShowModal,
  GetAllEvents,
}) => {
  const [data, setData] = useState({});
  const [step, setStep] = useState(true);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [entranceFee, setEntranceFee] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [time, setTime] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [product, setProduct] = useState({});
  const [modalCategory, setModalCategory] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [selectedItem5, setSelectedItem5] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState({});
  const [selectedStartDateEnd, setSelectedStartDateEnd] = useState({});
  const currentDate = new Date();
  const [sendStartingDate, setSendStartingDate] = useState({});
  const [selectedTime, setSelectedTime] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [loader, setLoader] = useState(false )
  const [fullAddress, setFullAddress] = useState('');
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       const { latitude, longitude } = position.coords;
  //       setCurrentLocation({ lat: latitude, lng: longitude });
  //       setMarkerPosition({ lat: latitude, lng: longitude });
  //     });
  //   }
  // }, []);

  const apiKey = "AIzaSyCByyO3JtJCxeA23nnf-GZUzLR4DikY-0o";
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      // console.log('place', place)

      if (place && place.geometry && place.geometry.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setSelectedLocation(location);

        setLocation(place?.formatted_address)

      }
    }
  };
  const onLoad = (autocomplete) => {

    setAutocomplete(autocomplete);
  };
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setSelectedLocation(userLocation);
      });
    }
  }, []);

  const onMarkerDragEnd = async (e) => {
    setMarkerPosition({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${e.latLng.lat()},${e.latLng.lng()}&key=AIzaSyCByyO3JtJCxeA23nnf-GZUzLR4DikY-0o`
      );

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const formattedAddress = response.data.results[0].formatted_address;
        setFullAddress(formattedAddress);
        setLocation(formattedAddress)
      } else {
        setFullAddress('Address not found');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };
  const handleTimeChange = (event) => {
    const selectedTimeValue = event.target.value;
    setTime(selectedTimeValue);
    // Format the selected time into "h:mm AM/PM" format (e.g., "5:00 AM" or "5:00 PM")
    const formattedTime = formatTime(selectedTimeValue);
    setSelectedTime(formattedTime);
  };

  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour > 12 ? hour - 12 : hour;
    const formattedTime = `${formattedHour}:${minutes} ${period}`;
    return formattedTime;
  };

  const handleDateChange = () => {
    setSendStartingDate(selectedStartDate);
  };
  const handleDateChangeNot = () => {
    setSendStartingDate({ year: "", month: "", day: "" });
  };

  useEffect(() => {
    setSendStartingDate(selectedStartDate);
  }, [selectedStartDate]);

  const handleStartChange = (date) => {
    setStart(date);
    setSelectedStartDateEnd({});
    setEnd("");
  };

  const handleEndChange = (date) => {
    const startDate = new Date(start);
    const endDate = new Date(date);
    if (endDate >= startDate) {
      // console.log("End date is greater");
      setEnd(date);
    } else if (endDate < startDate) {
      // console.log("Start date is greater");
    } else {
      // console.log("Invalid date format");
    }
  };
  useEffect(() => {
    setSendStartingDate(selectedStartDate);
  }, [selectedStartDate]);

  const handleItemClick3 = (itemName, index) => {
    setSelectedItem5(itemName);
    setModalCategory(false);
    setIsOpen3(!isOpen3);
  };
  const dropdown3Ref = useRef(null);
  const dataDrop = ["Male", "Female", "Male and Female"];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setEntranceFee(option);
    setSelectedOption(option);
    setIsOpen(false);
  };

  const onDrop = (acceptedFiles) => {
    if (selectedFiles.length + acceptedFiles.length <= 10) {
      setSelectedFiles([...selectedFiles, ...acceptedFiles]);
      setUploadedImages(acceptedFiles.map((file) => URL.createObjectURL(file)));
    } else {
      showMessage("You can only upload a maximum of 10 images.", "error");
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop,
    accept: ".jpg, .png, .svg",
    multiple: true,
  });

  const deleteImage = (index) => {
    const updatedImages = [...uploadedImages];
    updatedImages.splice(index, 1);
    setUploadedImages(updatedImages);

    const updatedSelectedFiles = [...selectedFiles];
    updatedSelectedFiles.splice(index, 1);
    setSelectedFiles(updatedSelectedFiles);
  };

  const handleStep2 = () => {
    setStep(false);
  };
  const token = secureLocalStorage.getItem("token");


  const CreateNewEvent = () => {
        if (selectedStartDate?.day <= 0) {
      return showMessage("Please select the starting day", "error");
    }
    if (!selectedStartDate?.month) {
      return showMessage("Please select starting month ", "error");
    }
    if (!selectedStartDate?.year) {
      return showMessage("Please select starting year", "error");
    }
    if (selectedStartDateEnd?.day <= 0) {
      return showMessage("Please select the ending day", "error");
    }
    if (!selectedStartDateEnd?.month) {
      return showMessage("Please select ending month ", "error");
    }

    if (!selectedStartDateEnd?.year) {
      return showMessage("Please select ending year", "error");
    }
    if (!selectedTime) {
      return showMessage("Please select event time", "error");
    }


    setShowModal(true);
    setLoader(true)
  
    const dateObject = moment(start, 'MMMM/D/YYYY');
    const formattedDate = dateObject.format('MM/DD/YYYY');
    const dateObject2 = moment(end, 'MMMM/D/YYYY');
    const formattedDate2 = dateObject2.format('MM/DD/YYYY');
    const locationData = {
      location: location,
      lat: selectedLocation?.lat,
      long: selectedLocation?.lng,
    };
    const formData = new FormData();
    formData.append('eventName', eventName);
    formData.append(
      'startingTime',
      `${selectedStartDate?.month + 1}/${selectedStartDate?.day}/${selectedStartDate?.year}`
    );
    formData.append(
      'endTime',
      `${selectedStartDateEnd?.month + 1}/${selectedStartDateEnd?.day}/${selectedStartDateEnd?.year}`
    );
    formData.append('location', JSON.stringify(locationData));
    formData.append('entranceFee', entranceFee);
    formData.append('eventDetail', eventDetails);
    formData.append('gender', product?.category);
    formData.append('contactInfo', contactInfo);
    formData.append('eventTime', selectedTime);
    selectedFiles?.forEach((e) => {
      formData.append('images', e);
    });
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    setShowModal(true);
    setLoader(true);
    axios.post(API_Routes.CREATEEVENTS, formData, config)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          GetAllEvents();
          setShowModal(false);
          showMessage(response?.data?.message);
          setLoader(false);
          setEntranceFee('');
          setEventDetails('');
          setContactInfo('');
          setEventName('');
          setSelectedFiles([]);
          setSelectedStartDate({});
          setSelectedTime(null);
          setSelectedStartDateEnd({})
          setSelectedTime([])
          setEntranceFee("");
          setSelectedOption("");
          setSelectedItem5("");
          setSelectedOption("")
        } else {
          setLoader(false);
          showMessage(response?.data?.message, 'error');
        }
      })
      .catch((error) => {
        console.log('error', error);
        setLoader(false);
      });
  };
  

  
  return (
    <>
     {loader && <div className="loaderScreen"><Loader /></div>}
    <Dialog
      visible={showModal}
      dismissableMask={true}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      modal
      draggable={false}
      className=" createEventOrganizationModal createEventOrganizationModal2"
      onHide={handleModal}
    >
      <div className=" mt-2 p-4 pt-2">
        <h4 className="heading">Create new event</h4>
        <div className="steps mt-2">
          <a className="ms-0" onClick={() => setStep(true)}>
            Step 1
          </a>
          <AiOutlineRight className="mb-1" fontSize={"20px"} />{" "}
          <a onClick={() => setStep(false)}>Step 2</a>
        </div>
        {step ? (
          <div>
            <div className="mt-4 ">
              <p className="textheading mb-1">Event name (required)</p>
              <input
                type="text"
                className="inputFields w-100"
                placeholder="Ex. Islamic Exhibition"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
              <div>
                <SeleclInput
                  name="Starting"
                  onChange={handleStartChange}
                  status={1}
                  dateEdit={true}
                  defaultValue={{
                    year: selectedStartDate.year,
                    month: selectedStartDate.month,
                    day: selectedStartDate.day,
                  }}
                  selectedStartDate={selectedStartDate}
                  setSelectedStartDate={setSelectedStartDate}
                />
                <SelectedInput2
                  name="Ending"
                  onChange={handleEndChange}
                  status={1}
                  dateEdit={true}
                  defaultValue={{
                    year: selectedStartDateEnd.year,
                    month: selectedStartDateEnd.month,
                    day: selectedStartDateEnd.day,
                  }}
                  selectedStartDateEnd={selectedStartDateEnd}
                  setSelectedStartDateEnd={setSelectedStartDateEnd}
                  sendStartingDate={sendStartingDate}
                />

                <div className="mt-3">
                  <label>Select Time</label>
                  <input
                    type="time"
                    className="inputFields w-100 pointer"
                    onChange={handleTimeChange}
                    value={time}
                  />
                </div>
              </div>
              <p className="textheading mb-1 mt-24px">Location (required)</p>
              <div className="position-relative">
                <LoadScript googleMapsApiKey={apiKey} libraries={["places", "geometry", "visualization"]}>
                  <Autocomplete
                    onLoad={onLoad}
                    onPlaceChanged={handlePlaceSelect}
                  >
                    <input className="inputFields w-100"
                      type="text"
                      placeholder="Cultural street 108, GTF, Bruxelles"

                    />
                  </Autocomplete>
                  <FaRegMap
                    // onClick={() => alert('working')}
                    onClick={() => setShowMap(!showMap)}
                    className="position-absolute end-0 w-auto me-3 pointer left-120"
                    style={{ top: "13px" }}
                  />

                  {showMap &&
                    <div style={{ height: "400px", width: "100%" }}>
                      <GoogleMap
                        center={selectedLocation}
                        zoom={14}
                        mapContainerStyle={{
                          height: "100%",
                          width: "100%",
                        }}
                      >
                        {selectedLocation && (
                          <Marker position={selectedLocation} />
                        )}
                      </GoogleMap>

                    </div>
                  }


                </LoadScript>
              </div>

              <div className="entrance-fee-dropdown">
                <p className="textheading mb-1 mt-24px">
                  Entrance fee (required)
                </p>
                <div
                  className="inputFields w-100 fw-bold statusField py-2 px-2  d-flex justify-content-between shadowBorder"
                  onClick={toggleDropdown}
                >
                  {selectedOption ? selectedOption : "Select an option"}

                  {isOpen ? (
                    <div>
                      <BiChevronDown fontSize={"20px"} />
                    </div>
                    // <BiChevronUp fontSize="20px" />
                  ) : (
                    <div>
                      <BiChevronRight fontSize={"20px"} />
                    </div>
                    // <BiChevronDown fontSize="20px" />
                  )}
                </div>
                {isOpen && (
                  <ul className="dropdown-options EntranceFeeDropdown">
                    <li onClick={() => handleOptionClick("Free entrance")}>
                      Free entrance
                    </li>
                    <li onClick={() => handleOptionClick("Paid entrance")}>
                      Paid entrance
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <Button
              data="Next step"
              class="profile-btn w-100 mt-5"
              onClick={handleStep2}
            />
            <div className="text-center mt-2">
              <button
                onClick={() => {
                  handleModal();
                }}
                className="cancelBtn"
              >
                Cancel{" "}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mt-4 ">
              <div>
                <p className="textheading mb-1">Upload thumbnail pictures</p>
                <div
                  {...getRootProps()}
                  className={`eventUploadFile w-100 text-center point ${isDragActive ? "drag-active" : ""
                    }`}
                >
                  <input {...getInputProps()} />
                  <BiArrowToTop color="black" fontSize={"25px"} />
                  <h3 className="mt-3">
                    {isDragActive
                      ? "Drop your files here"
                      : "Drag or upload your files* here"}
                  </h3>
                  <h4 className="">*Available formats: Jpg, Png, Svg</h4>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="mt-3 d-flex flex-wrap">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="image-preview-container">
                        <img
                          style={{ width: 80, height: 80 }}
                          src={image}
                          alt={`Uploaded Thumbnail ${index + 1}`}
                        />
                        <button
                          className="delete-button"
                          onClick={() => deleteImage(index)}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <p className="textheading mb-1 mt-24px">Event details</p>
                <div className="">
                  <input
                    type="text"
                    className="inputFields w-100"
                    placeholder="Ex. Islamic Exhibition"
                    value={eventDetails}
                    onChange={(e) => setEventDetails(e.target.value)}
                  />
                </div>
              </div>

              <p className="textheading mb-2 mt-24px ">Participants gender</p>
              <div
                className="w-100 position-relative allItems me-3"
                ref={dropdown3Ref}
              >
                <div
                  className="statusField py-2 px-2  d-flex justify-content-between shadowBorder"
                  onClick={() => setIsOpen3(!isOpen3)}
                >
                  <span className="me-0 py-1">{selectedItem5 || "Select"}</span>

                  <span className="py-1">
                    {isOpen3 ? (
                      <BiChevronDown fontSize={"20px"} />
                    ) : (
                      <BiChevronRight fontSize={"20px"} />
                    )}
                  </span>
                </div>
                {isOpen3 ? (
                  <div
                    className="categroyDropDown z-1  mt-2 position-absolute w-100"
                    style={{ backgroundColor: "#fcfcfc" }}
                  >
                    {dataDrop.map((item, index) => (
                      <div
                        className="categoryGoal my-2 point"
                        key={index}
                        onClick={() => {
                          setProduct({ category: item });
                          handleItemClick3(item, index);
                        }}
                      >
                        <CheckBox
                          checked={item === selectedItem5}
                          className="greenCheckBox me-2"
                        />
                        {item}
                      </div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div>
              <p className="textheading mb-1 mt-24px ">Contact information</p>
              <div className="">
                <input
                  type="text"
                  className="inputFields w-100"
                  placeholder="Ex. Email, phone number"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                />
              </div>
            </div>
            <Button
              data="Create event"
              class="profile-btn w-100 mt-5"
              onClick={() => CreateNewEvent()}
            />
            <div className="text-center mt-2">
              <button
                onClick={() => {
                  handleModal();
                }}
                className="cancelBtn"
              >
                Cancel{" "}
              </button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
    </>
  );
};
  // console.log('selectedLocation', selectedLocation)

  // const CreateNewEvent = () => {
  //   if (selectedStartDate?.day <= 0) {
  //     return showMessage("Please select the starting day", "error");
  //   }
  //   if (!selectedStartDate?.month) {
  //     return showMessage("Please select starting month ", "error");
  //   }
  //   if (!selectedStartDate?.year) {
  //     return showMessage("Please select starting year", "error");
  //   }
  //   if (selectedStartDateEnd?.day <= 0) {
  //     return showMessage("Please select the ending day", "error");
  //   }
  //   if (!selectedStartDateEnd?.month) {
  //     return showMessage("Please select ending month ", "error");
  //   }

  //   if (!selectedStartDateEnd?.year) {
  //     return showMessage("Please select ending year", "error");
  //   }
  //   if (!selectedTime) {
  //     return showMessage("Please select event time", "error");
  //   }


  //   setShowModal(true);
  //   setLoader(true)






  //   const dateObject = moment(start, "MMMM/D/YYYY");
  //   const formattedDate = dateObject.format("MM/DD/YYYY");

  //   const dateObject2 = moment(end, "MMMM/D/YYYY");
  //   const formattedDate2 = dateObject2.format("MM/DD/YYYY");

  //   var myHeaders = new Headers();
  //   myHeaders.append("Authorization", "Bearer " + token);
  //   const startDate = new Date(start);
  //   const endDate = new Date(end);
  //   var formdata = new FormData();
  //   formdata.append("eventName", eventName);
  //   formdata.append(
  //     "startingTime",
  //     `${selectedStartDate?.month + 1}/${selectedStartDate?.day}/${selectedStartDate?.year}`);
  //   formdata.append(
  //     "endTime",
  //     `${selectedStartDateEnd?.month + 1}/${selectedStartDateEnd?.day}/${selectedStartDateEnd?.year}`);
  //   const locationData = {
  //     location: location,
  //     lat: selectedLocation?.lat,
  //     long: selectedLocation?.lng,
  //   };
  //   // console.log('locationData', locationData)
  //   formdata.append("location", JSON.stringify(locationData));
  //   formdata.append("entranceFee", entranceFee);
  //   formdata.append("eventDetail", eventDetails);
  //   formdata.append("gender", product?.category);
  //   formdata.append("contactInfo", contactInfo);
  //   formdata.append("eventTime", selectedTime);

  //   selectedFiles?.forEach((e) => {
  //     formdata.append("images", e);
  //   });

  //   var requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: formdata,
  //     redirect: "follow",
  //   };

  //   fetch(API_Routes.CREATEEVENTS, requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       if (result.status == 200 || result.status == 201) {
  //         GetAllEvents();
  //         setShowModal(false);
  //         showMessage(result?.message);
  //         setLoader(false)
  //         setEntranceFee("")
  //         setEventDetails("")
  //         setContactInfo("")  
  //         setEventName("")
  //         setSelectedFiles([])
  //         setSelectedStartDate({})
  //         setSelectedTime(null)

  //       } else {
  //         // setShowModal(false)
  //         setLoader(false)
  //         showMessage(result?.message, "error");
  //       }
  //     })
  //     .catch((error) => console.log("error", error));
  // };