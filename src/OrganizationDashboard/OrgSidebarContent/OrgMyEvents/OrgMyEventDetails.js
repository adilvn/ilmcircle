import React, { useState, useRef } from "react";
import DashboardNavbar from "../../../Dashboard/DashboardCmp/DashboardNavbar";
import "./myEvents.css";
import edit from "../../../asserts/images/orgEditIcon.png";
import colorEdit from "../../../asserts/images/colorEdit.png";
import colorArrowRight from "../../../asserts/images/colorArrowRight.png";
import { Element, scroller } from "react-scroll";

import { MdClose, MdEdit, MdOutlineKeyboardArrowRight } from "react-icons/md";
import closeIcon from "../../../asserts/images/myEventCloseIcon.png";
import mediaImagetwo from "../../../asserts/images/mediaImagetwo.jpg";
import mediaImageOne from "../../../asserts/images/mediaImageOne.jpg";
import mediaImageThree from "../../../asserts/images/mediaImageThree.png";
import mediaImageFour from "../../../asserts/images/mediaImageFour.png";
import deleteIcon from "../../../asserts/images/deleteIcon.png";

import plusIcon from "../../../asserts/images/newMsg.png";
import full from "../../../asserts/images/fill.png";
import half from "../../../asserts/images/half.png";
import empty from "../../../asserts/images/empty.png";
import flag from "../../../asserts/images/flag.png";
import { Attendee } from "./DummyArrayAttendee";
import img from "../../../asserts/images/download.svg";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { SeleclInput } from "./Reuseable/SeleclInput";
import { FaRegMap } from "react-icons/fa";
import { BsSearch, BsSortDown, BsUpload } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import Rating from "../../../components/reuseable/Rating";
import ReactStars from "react-rating-stars-component";
import { reviews } from "./dummyArrayReviews";
import { VscEye } from "react-icons/vsc";
import Toggle from "react-styled-toggle";
import OrgFeedBack from "./OrgFeedBack";
import OrgReview from "./OrgReview";
import { BiChevronDown, BiChevronRight, BiPlus } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import { showMessage } from "../../../components/reuseable/Tostify";
import { Loader } from "../../../components/reuseable/Loader";
import moment from "moment";
import API_Routes from "../../../Routes/API_Routes";
import axios from "axios";
import { setDate } from "date-fns";
import cross from '../../../asserts/images/myEventCloseIcon.png'
import { bindActionCreators } from "redux";
import { actionCreaters } from "../../../Store/Index";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { SelectedInput2 } from "./Reuseable/SelectedInput2";
import { NewSelectedInput1 } from "./Reuseable/NewSelectedInput1";
import { NewSelectedInput2 } from "./Reuseable/NewSelectedInput2";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";

// Changings are done in the componet exibition spelling
function OrgMyEventDetails() {

  // const selectedItem = useSelector((state) => state?.selectedIndex);
  const locations = useLocation()
  // console.log('locationData', location?.state?.item)
  const selectedItem = locations?.state
  // console.log('selectedItem', selectedItem)

  const [eventName, setEventName] = useState();
  const [headingTitle, setHeadingTitle] = useState('');
  const [eventDetail, setEventDetail] = useState();
  const [entranceFee, setEntrenceFee] = useState();
  const [email, setEmail] = useState();
  const [cultureStreet, setCultureStreet] = useState('');

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [enableEditing, setEnableEditing] = useState(false);
  const [product, setProduct] = useState();
  const [modalCategory, setModalCategory] = useState(false);
  const [getdetails, setGetDetails] = useState('');
  const [startingTime, setStartingTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [deletedImages, setDeletedImages] = useState([]);
  const [previousImages, setPreviousImages] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState({});
  const [selectedEndDate, setSelectedEndDate] = useState({});
  const [selectedStartDateEnd, setSelectedStartDateEnd] = useState({});

  const [month, day, year] = startingTime?.split("/");
  const [month2, day2, year2] = endTime.split("/");
  const [editEnable, setEditEnable] = useState(false);
  const [editEnableLocation, setEditEnableLocation] = useState(false);

  const [dataImages, setDataImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const maxImages = 10;
  const [mediaEdit, setMediaEdit] = useState(false);
  const [dateEdit, setDateEdit] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [inputValue, setInputValue] = useState();

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [rate, setRate] = useState(3);
  const token = secureLocalStorage.getItem('token')
  const dispatch = useDispatch()
  const { orgDashboardIndex } = bindActionCreators(actionCreaters, dispatch);
  const [sendStartingDate, setSendStartingDate] = useState({})
  const navigate = useNavigate()
  console.log('cheack', cultureStreet)

  const ref = useRef(null);
  const ref2 = useRef(null);
  const fileInputRef = useRef(null);

  const [showMap, setShowMap] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [fullAddress, setFullAddress] = useState('');
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        setMarkerPosition({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  const handleInputChange = (e) => {
    // Update the input value state when the user types
    setInputValue(e.target.value);
  };


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

        // console.log('formattedAddress', formattedAddress)
        setFullAddress(formattedAddress);

        const realLocation = {
          location: formattedAddress,
          lat: e.latLng.lat(),
          long: e.latLng.lng(),
        }
        // console.log('realLocation', realLocation)

        setCultureStreet(realLocation)

        // setCultureStreet(formattedAddress)
      } else {
        setFullAddress('Address not found');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const handleDateChange = () => {
    setSendStartingDate(selectedStartDate)


  }
  useEffect(() => {
    setSendStartingDate(selectedStartDate)

  }, [selectedStartDate]);
  // console.log('product', product)
  useEffect(() => {
    getSingleEventsData()
  }, [])
  useEffect(() => {
    setSendStartingDate(selectedStartDate)

  }, [selectedStartDate]);




  const apiKey = "AIzaSyCByyO3JtJCxeA23nnf-GZUzLR4DikY-0o";

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      console.log('place', place)

      if (place && place.geometry && place.geometry.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        console.log('place', place)
        setSelectedLocation(location);

        setInputValue(place?.formatted_address)

      }
    }
  };

  const onLoad = (autocomplete) => {

    console.log('autocomplete', autocomplete)
    setAutocomplete(autocomplete);
  };

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       const userLocation = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude,
  //       };
  //       setSelectedLocation(userLocation);
  //     });
  //   }
  // }, []);

  const getSingleEventsData = () => {
    setLoader(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);


    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(API_Routes.GETEVENTSDETAILS + selectedItem?.item?._id, requestOptions)
      .then(response => response.json())
      .then(result => {


        console.log('getDATA---.', result)
        if (result.status == 200 || result.status == 201) {
          const data = result?.data
          console.log('before', data)

          const locationData = JSON.parse(data?.location)

          console.log('aaaaa', locationData)
          const userLocation = {
            lat: locationData?.lat,
            lng: locationData?.long,
          };
          setSelectedLocation(userLocation);
          // const realLocation = {
          //   location: locationData,
          //   lat: markerPosition?.lat,
          //   long: markerPosition?.lng,
          // }

          setInputValue(locationData?.location)


          setEventName(data?.eventName)
          setHeadingTitle(data?.eventName)
          setEventDetail(data?.eventDetail)
          setEntrenceFee(data?.entranceFee)
          setProduct(data?.gender)
          setEmail(data?.contactInfo)
          setImages(data?.images)
          setDataImages(data?.images)
          setPreviousImages(data?.images)
          setStartingTime(data?.startingTime)
          setEndTime(data?.endTime)
          setLoader(false)


          const startingDateParts = data?.startingTime.split("/");
          const endingDateParts = data?.endTime.split("/");
          // console.log('data .endTime', data?.endTime) 
          // console.log('data?.startingTime', data?.startingTime) 
          setSelectedStartDate({ year: startingDateParts[2], month: startingDateParts[0] - 1, day: startingDateParts[1] });
          setSelectedStartDateEnd({ year: endingDateParts[2], month: endingDateParts[0] - 1, day: endingDateParts[1] });
          setSendStartingDate({ year: startingDateParts[2], month: startingDateParts[0] - 1, day: startingDateParts[1] })
          // console.log('selectedStartDate', selectedStartDate) 
          // console.log('selectedStartDateEnd',selectedStartDateEnd) 
        } else {
          setLoader(false)
          showMessage(result.message, "error")
        }
      })
      .catch(error => {
        setLoader(false)
        console.log('error', error)
      });
  }

  const DeleteEvents = (e) => {
    e.stopPropagation()
    setLoader(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("id", selectedItem?.item?._id);

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(API_Routes.DELETEEVENTS, requestOptions)
      .then(response => response.json())
      .then(result => {
        // console.log(result)

        if (result?.status == 200 || result?.status == 201) {
          // GetAllEvents()
          navigate(`/organization-dashboard/${1}`)


          setLoader(false)
          showMessage(result?.message)
        } else {
          setLoader(false)
          showMessage(result?.message, 'error')

        }
      })
      .catch(error => {
        setLoader(false)
        console.log('error', error)
      });
  }


  const handleRatingChange = (newRating) => {
    // console.log("New rating:", newRating);
  };

  const scrollToSection = (sectionId) => {
    scroller.scrollTo(sectionId, {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
    });
  };

  const [images, setImages] = useState();




  function generateUniqueId() {
    // Generate a unique ID using a timestamp and a random number
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }



  const handlePlusIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleStartChange = (date) => {
    // console.log('selectedDate', date)
    setStart(date);
  };
  const maxImageLimit = 10;

  const handleEndChange = (date) => {
    setEnd(date);
  };

  const handleImageUpload = (event) => {
    const files = event.target.files;

    if (mediaEdit) {
      const totalImages = dataImages.length + imagePreviews.length;
      const remainingSlots = maxImageLimit - totalImages;

      if (files.length > remainingSlots) {
        showMessage(`You can only upload a maximum of 10 images`, 'error');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      if (files && files.length > 0) {
        // Slice the files array to the remaining slots
        const selectedImageArray = Array.from(files).slice(0, remainingSlots);
        setSelectedImages(selectedImageArray);

        const imagePreviewArray = selectedImageArray.map((image) =>
          URL.createObjectURL(image)
        );
        setImagePreviews(imagePreviewArray);

        // Clear the input value to allow selecting the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } else {
      showMessage('Image upload is disabled', 'error');
    }
  };

  const handleDeleteImage = (imageId, old) => {
    // console.log('old===>', old)

    const newSelectedImages = selectedImages.filter((image, index) => index !== imageId);
    const newImagePreviews = imagePreviews.filter((previewUrl, index) => index !== imageId);
    setSelectedImages(newSelectedImages);
    setImagePreviews(newImagePreviews);

    if (old) {
      const del = dataImages.filter((image) => image.id == imageId);
      const set = dataImages.filter((image) => image.id != imageId);
      // console.log('del===>', del)
      // console.log('set===>', set)

      setDeletedImages([...deletedImages, ...del]);
      setDataImages(set);
    }
  };


  const SendData = () => {
    // console.log('PriviousImages===>>', previousImages)
    // console.log('deletedImages===>>', deletedImages)

  }


  // console.log('start', start)
  // console.log('end', end)
  // console.log('selectedStartDateEnd', selectedStartDateEnd)


  const updateAPI = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    // console.log(currentYear ,"selectedStartDateselectedStartDateselectedStartDate")
    // console.log(currentMonth ,"selectedStartDateselectedStartDateselectedStartDate")
    console.log('selectedStartDate?.month', selectedStartDate?.month)

    if (selectedStartDate?.day <= 0) {
      return showMessage('Please select the starting day', 'error')
    }
    if (!selectedStartDate?.month) {
      return showMessage('Please select starting month ', 'error')

    }
    if (!selectedStartDate?.year) {
      return showMessage('Please select starting year', 'error')

    }
    if (selectedStartDateEnd?.day <= 0) {
      return showMessage('Please select the ending day', 'error')
    }
    // if (!selectedStartDateEnd?.month ) {
    //   return showMessage('Please select ending month ', 'error')
    // }

    if (!selectedStartDateEnd?.year) {
      return showMessage('Please select ending year', 'error')
    }





    const selectedStartYear = parseInt(selectedStartDate.year, 10);
    const selectedStartMonth = parseInt(selectedStartDate.month, 10);
    const selectedStartDay = parseInt(selectedStartDate.day, 10);

    const selectedEndYear = parseInt(selectedStartDateEnd.year, 10);
    const selectedEndMonth = parseInt(selectedStartDateEnd.month, 10);
    const selectedEndDay = parseInt(selectedStartDateEnd.day, 10);
    // console.log(
    //   selectedStartYear ,"selectedStartYear",
    //   selectedStartMonth ,"selectedStartMonth",
    //   selectedStartDay ,"selectedStartDay",
    //   selectedEndYear ,"selectedselectedEndYear",
    //   selectedEndMonth ,"selectedEndMonth",
    //   selectedEndDay ,"selectedEndDay",


    // )
    if (selectedStartYear < currentYear || selectedEndYear < currentYear) {
      return showMessage('Please select correct year 0001', 'error')

    }
    if (selectedStartYear === currentYear) {
      if (selectedStartMonth + 1 < currentMonth) {
        return showMessage('Please select correct month', 'error')

      }

    }
    if (selectedStartYear === currentYear) {
      if (selectedStartMonth + 1 === currentMonth) {
        if (selectedStartDay < currentDay)
          return showMessage('Please select correct date', 'error')

      }

    }

    if (selectedStartYear > selectedEndYear) {
      return showMessage('Please select correct year', 'error');
    }

    if (selectedStartYear === selectedEndYear) {
      if (selectedStartMonth > selectedEndMonth) {
        return showMessage('Please select correct month', 'error');
      }

      if (selectedStartMonth === selectedEndMonth) {
        if (selectedStartDay > selectedEndDay) {
          return showMessage('Please select correct date', 'error');
        }
      }
    }

    setLoader(true)

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const data = new FormData();
    console.log('cultureStreetPPP', inputValue)
    const locationData = {
      location: inputValue,
      lat: selectedLocation?.lat,
      long: selectedLocation?.lng,
    };
    console.log('locationDataaaa', locationData)
    data.append("location", JSON.stringify(locationData));

    data.append('eventName', eventName);
    data.append('startingTime', `${selectedStartDate?.month + 1}/${selectedStartDate?.day}/${selectedStartDate?.year}`)
    data.append('endTime', `${selectedStartDateEnd?.month + 1}/${selectedStartDateEnd?.day}/${selectedStartDateEnd?.year}`);
    data.append('entranceFee', entranceFee);
    data.append('eventDetail', eventDetail);
    data.append('gender', product);
    data.append('contactInfo', email);
    data.append('id', selectedItem?.item?._id);
    selectedImages.forEach((file) => {
      // console.log('images-->', file)
      // data.append(`images`, file);
    });
    data.append('deleteImages', JSON.stringify(deletedImages));
    data.append('previousImages', JSON.stringify(previousImages));
    axios
      .post(API_Routes.ORGUPDATEEVENT, data, { headers })
      .then((response) => {
        if (response.status == 200) {
          setLoader(false)
          showMessage(response?.data?.message);
          // setAddContactModal(false);
          getSingleEventsData()
          setDateEdit(false)
          setEditEnable(false)
          setMediaEdit(false)
          setEditEnableLocation(false)


          // GetEventsData();
        } else {
          setLoader(false);
          showMessage(response?.data?.message, 'error');

        }
      })
      .catch((error) => {
        setLoader(false);
        console.log('error', error);
      });
  }


  const dataDrop = [
    "Male", 'Female', 'Male and Female'
  ];

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };
  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
    // setOpenDelete(false)
  };
  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={(e) => DeleteEvents(e)}
      />
    </React.Fragment>
  );






  return (
    <div className="MyEventDetailsPadding">

      {loader && <div className="loaderScreen">
        <Loader />
      </div>}
      <div className="container-fluid my-5">
        <div className="row">
          <div className="orgHeaderSection">
            <div className="">
              <h1>My Event</h1>
            </div>
            <div className="">
              <MdOutlineKeyboardArrowRight size={25} strokeLinecap={1} />
            </div>
            <div className="">
              <h1>Event detail</h1>
            </div>
          </div>

          <div className="col-md-12">
            <div className="orgEventHeading">
              <div className="d-flex align-Items-center justify-content-between  gap-2">
                <h1>{headingTitle}</h1>
                <div className="d-flex align-Items-center gap-4">
                  <img
                    style={{ width: 28, height: 28 }}
                    src={deleteIcon}
                    alt="delete"
                    className="pointer"
                    onClick={() => confirmDeleteSelected()}
                  />
                  {/* <BsUpload className=" point mt-1" fontSize={" 22px"} /> */}
                </div>
              </div>
            </div>
            <div className="favoriteNavTab mt-5 ">
              <ul
                class="row align-items-center nav nav-pills mb-3 gx-4 favoriteUl sticky-top"
                id="pills-tab"
                role="tablist"
              >
                <li
                  onClick={() => scrollToSection("aboutEvent")}
                  class="nav-item col-md-2 col-sm-12"
                  role="presentation"
                >


                  <h6>About Event</h6>

                </li>
                <li
                  onClick={() => scrollToSection("Media")}
                  class="nav-item col-md-2 col-sm-12"
                  role="presentation"
                >


                  <h6>Media</h6>

                </li>
                <li
                  onClick={() => scrollToSection("dateLocation")}
                  class="nav-item col-md-2 col-sm-12"
                  role="presentation"
                >

                  <h6>Date &amp; Location</h6>

                </li>

                <li
                  onClick={() => scrollToSection("review")}
                  class="nav-item col-md-2 col-sm-12"
                  role="presentation"
                >

                  <h6>Reviews</h6>

                </li>
                <li
                  onClick={() => scrollToSection("feedback")}
                  class="nav-item col-md-2 col-sm-12"
                  role="presentation"
                >

                  <h6>Feedback</h6>

                </li>
              </ul>

              <div className=" mt-5">
                <Element id="aboutEvent" className="orgEventMain">
                  <div className="AboutEvent">
                    <div className="AboutEventFlex">
                      <h2>About Event</h2>

                      {editEnable ?

                        <img
                          style={{ width: 16.67, height: 16.67 }}
                          src={cross}
                          alt="edit"
                          className="pointer"
                          onClick={() => setEditEnable(false)}
                        />
                        :
                        <img
                          style={{ width: 16.67, height: 16.67 }}
                          src={edit}
                          alt="edit"
                          className="pointer"
                          onClick={() => setEditEnable(true)}
                        />
                      }
                    </div>

                    <div className="col-lg-8  col-md-12">
                      <div className="myEventsCard">
                        <div>
                          <h3>Event name</h3>
                          <div className="mt-2">
                            <input
                              disabled={!editEnable}
                              className="eventNameInput"
                              type="text"
                              onChange={(e) => setEventName(e.target.value)}
                              value={eventName}
                            />
                          </div>
                        </div>

                        <div className="mt-3">
                          <h3>Event detail</h3>
                          <div className="mt-2">
                            <textarea
                              disabled={!editEnable}
                              className="eventNameInput"
                              value={eventDetail}
                              name="eventDetail"
                              placeholder="Enter details"
                              onChange={(e) => setEventDetail(e.target.value)}
                              rows={14}
                              style={{ height: "330px" }}
                            />
                          </div>
                        </div>

                        <div className="mt-3">
                          <h3>Entrance fee</h3>

                          <select
                            disabled={!editEnable}
                            onChange={(e) => setEntrenceFee(e.target.value)}
                            class="form-select form-select-sm mt-2 eventNameInput"
                            aria-label=".form-select-sm example"
                          >
                            <option value="Free entrance" selected={entranceFee === "Free entrance"}>
                              Free entrance
                            </option>
                            <option value="Paid entrance" selected={entranceFee === "Paid entrance"}>
                              Paid entrance
                            </option>
                          </select>

                        </div>
                        <p className="textheading mb-2 mt-24px ">
                          Participants gender
                        </p>
                        <div className="w-100 position-relative">
                          <div
                            className="statusField py-2 px-3 d-flex justify-content-between shadowBorder eventNameInput"
                            onClick={() => {
                              if (editEnable) {
                                setModalCategory(!modalCategory)
                              }
                            }}
                          >
                            <span className="me-0 text-capitalize">
                              {product ? product : "Select"}
                            </span>
                            <span className="">
                              {modalCategory ? (
                                <BiChevronDown fontSize={"20px"} />
                              ) : (
                                <BiChevronRight fontSize={"20px"} />
                              )}
                            </span>
                          </div>
                          {modalCategory ? (
                            <div
                              className="categroyDropDown mt-2 z-3 position-absolute w-100 end-0 eventNameInput"
                              style={{
                                backgroundColor: "#fcfcfc",
                                top: "38px",
                                display: 'block'
                              }}
                            >
                              {dataDrop.map((item, index) => (
                                <div
                                  key={index}
                                  className={`categoryGoal my-2 point ${product === item ? item : "Select"
                                    }`}
                                  onClick={() => {
                                    setProduct(item);
                                    setModalCategory(false);
                                  }}
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>

                        <div className="mt-3">
                          <div className="d-flex align-items-center gap-3">
                            <h3>Contact information</h3>
                            {/* <img
                              style={{ width: 20, height: 20 }}
                              src={plusIcon}
                              alt="plusIcon"
                            /> */}
                          </div>

                          <div class="">
                            <div className="forgetInputs mt-2">
                              <input
                                disabled={!editEnableLocation}
                                type="text"
                                className="form-control loginPasswordInput eventNameInput"
                                id="exampleFormControlInput1"
                                name="email"
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                              />
                              <div className="emailInputsHandler">

                                {editEnableLocation ?

                                  <img

                                    onClick={() => setEditEnableLocation(false)}

                                    className="MyEventCross"
                                    style={{ width: 16.67, height: 16.67 }}
                                    src={closeIcon}
                                    alt="closeIcon"
                                  />
                                  :
                                  <img
                                    className="MyEventEdit"
                                    style={{ width: 16.67, height: 16.67 }}
                                    src={edit}
                                    alt="edit"

                                    onClick={() => setEditEnableLocation(true)}
                                  />
                                }
                                {/* <img
                                  className="MyEventEdit"
                                  style={{ width: 16.67, height: 16.67 }}
                                  src={edit}
                                  alt="edit"
                                />

                                <img
                                  className="MyEventCross"
                                  style={{ width: 16.67, height: 16.67 }}
                                  src={closeIcon}
                                  alt="closeIcon"
                                /> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Element>

                <Element id="Media" className="cardsMain pt-5">
                  <div id="aboutEvent" className="orgEventMain">
                    <div className="AboutEvent">
                      <div className="AboutEventFlex">
                        <h2>Media</h2>
                      </div>

                      <div className="col-lg-8 col-md-12">
                        <div className="myEventsCard">
                          <div className="row  " >

                            <div style={{ height: 430, overflowY: 'scroll' }} className="d-flex selected-images-container flex justify-center flex-wrap gap-3 selected-image-size">
                              {dataImages.map((item) => (
                                <div key={item.id} className="selected-image-container relative">
                                  <img src={item.url} alt={`Selected`} className="selected-image " style={{
                                    width: "256px",
                                    height: "160px",
                                    marginTop: 20,
                                    objectFit: "cover",
                                  }} />
                                  <div style={{ position: 'relative', top: -160, bottom: 0, right: 0, left: 235, width: 18, height: 21, }}>
                                    <button className="delete-button mb-0" style={{}} onClick={() => {

                                      if (mediaEdit) {
                                        handleDeleteImage(item.id, true)

                                      }
                                    }
                                    }

                                    >
                                      X
                                    </button>
                                  </div>
                                </div>
                              ))}
                              {imagePreviews.map((previewUrl, index) => (
                                <div key={previewUrl} className="selected-image-container relative">
                                  <img src={previewUrl} alt={`Selected`} className="selected-image" style={{
                                    width: "256px",
                                    height: "160px",
                                    marginTop: 20,
                                    objectFit: "cover",
                                  }} />
                                  <div style={{ position: 'relative', top: -160, bottom: 0, right: 0, left: 235, width: 18, height: 21, background: 'red', zIndex: 9999 }}>
                                    <button className="delete-button mb-0" style={{}} onClick={() => {
                                      if (mediaEdit) {
                                        handleDeleteImage(index, false)
                                      }
                                    }}>
                                      X
                                    </button>
                                  </div>
                                </div>
                              ))}

                            </div>
                          </div>

                          <hr
                            className="mt-5"
                            style={{
                              marginTop: "0.5rem",
                              marginBottom: "0.5rem",
                            }}
                          ></hr>

                          <div className="MedaiSectionTwo">
                            <div>
                              <h1>
                                In total <span>{images?.length}</span> files
                              </h1>
                            </div>
                            {!mediaEdit ?
                              <div
                                style={{ cursor: "pointer" }}
                                className="MediaEdit"
                                onClick={() => setMediaEdit(!mediaEdit)}
                              >

                                <h4>Edit</h4>
                                <img
                                  style={{ width: "16.667px", height: "16.66px" }}
                                  src={colorEdit}
                                  alt="edit"
                                />
                              </div>

                              :

                              <div
                                style={{ cursor: "pointer" }}
                                className="MediaEdit"
                                onClick={() => setMediaEdit(!mediaEdit)}
                              >

                                <h4>Disable Edit</h4>
                                <img
                                  style={{ width: "16.667px", height: "16.66px" }}
                                  src={colorEdit}
                                  alt="edit"
                                />
                              </div>

                            }

                          </div>
                          <div className="myEventsFileInput text-center">
                            <label
                              htmlFor="file-input"
                              className="file-input-label"
                            >
                              <input
                                type="file"
                                disabled={!mediaEdit}
                                id="upload-button"
                                accept="image/png, image/gif, image/jpeg"
                                className="file-input"
                                multiple
                                ref={fileInputRef}
                                onChange={(e) => handleImageUpload(e)}
                              />
                              Upload new file
                            </label>
                          </div>
                        </div>
                      </div>



                    </div>
                  </div>
                </Element>

                <Element id="dateLocation" className="cardsMain pt-5">
                  <div id="aboutEvent" className="orgEventMain">
                    <div className="AboutEvent">
                      <div className="AboutEventFlex">
                        <h2>Date & Location</h2>
                        {dateEdit ?
                          <img
                            style={{ width: 16.67, height: 16.67 }}
                            src={cross}
                            alt="edit"
                            className="pointer"
                            onClick={() => setDateEdit(!dateEdit)}
                          />

                          :

                          <img
                            style={{ width: 16.67, height: 16.67 }}
                            src={edit}
                            alt="edit"
                            className="pointer"
                            onClick={() => setDateEdit(!dateEdit)}
                          />}
                      </div>

                      <div className="col-lg-8 col-lg-8 createEventOrganizationModal">
                        <div className="myEventsCard">
                          <div className="col-md-7">
                            {/* <SeleclInput name={"Starting time"} status={1} /> */}
                            <NewSelectedInput1
                              name="Starting"
                              // disabled={!dateEdit}
                              onChange={handleStartChange}
                              status={1}
                              dateEdit={dateEdit}
                              defaultValue={{
                                year: selectedStartDate.year,
                                month: selectedStartDate.month,
                                day: selectedStartDate.day,
                              }}
                              selectedStartDate={selectedStartDate}
                              setSelectedStartDate={setSelectedStartDate}
                            // disabled={!dateEdit}
                            />
                            <NewSelectedInput2
                              name="Ending"

                              onChange={handleEndChange}
                              status={1}
                              dateEdit={dateEdit}

                              defaultValue={{
                                year: selectedStartDateEnd.year,
                                month: selectedStartDateEnd.month,
                                day: selectedStartDateEnd.day,
                              }}
                              selectedStartDateEnd={selectedStartDateEnd}
                              setSelectedStartDateEnd={setSelectedStartDateEnd}
                              sendStartingDate={sendStartingDate}
                            />

                            {/* {console.log('cultureStreet', cultureStreet)} */}
                            <p className="textheading mb-1 mt-24px ">Location</p>
                            <div className="position-relative">
                              <LoadScript googleMapsApiKey={apiKey} libraries={["places", "geometry", "visualization"]}>
                                <Autocomplete
                                  onLoad={onLoad}
                                  onPlaceChanged={handlePlaceSelect}
                                >
                                  <input className="inputFields w-100"
                                    type="text"
                                    disabled={!dateEdit}
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    placeholder="Cultural street 108, GTF, Bruxelles"

                                  />
                                </Autocomplete>

                                {dateEdit ?
                                  <FaRegMap
                                    // onClick={() => alert('working')}
                                    onClick={() => setShowMap(!showMap)}
                                    className="position-absolute end-0 w-auto me-3 pointer left-120"
                                    style={{ top: "13px" }}
                                  />
                                  :
                                  <FaRegMap
                                    className="position-absolute end-0 w-auto me-3 pointer left-120"
                                    style={{ top: "13px" }}
                                  />

                                }


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

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Element>


                <div className="row">
                  <div onClick={() => updateAPI()} className="col-md-8 myEventsFileInput text-center">
                    <label
                      htmlFor="file-input"
                      className="file-input-label"
                    >
                      <input
                        type="text"
                        className="file-input"
                      />
                      Send Data
                    </label>
                  </div>
                </div>
                <Element id="review" className="cardsMain pt-5">
                  <OrgReview selectedItem={selectedItem} />
                </Element>

                <Element id="feedback" className="cardsMain pt-5">
                  <OrgFeedBack selectedItem={selectedItem} />
                </Element>
              </div>
            </div>
          </div>
          <div className="col"></div>
          {deleteProductsDialog &&
            <Dialog
              visible={deleteProductsDialog}
              style={{ width: "32rem" }}
              breakpoints={{ "960px": "75vw", "641px": "90vw" }}
              // header="Confirm"
              draggable={false}
              modal
              footer={deleteProductsDialogFooter}
              onHide={hideDeleteProductsDialog}
            >
              <div className="confirmation-content">
                <div className="d-flex algn-items-center gap-3">
                  <i
                    className="pi pi-exclamation-triangle mr-3"
                    style={{ fontSize: "2rem" }}
                  />
                  <p className="ConfirmAlert">Confirm</p>

                </div>
                {/* {console.log('myProduct===>', product)} */}


                {/* {product && ( */}
                <div>
                  {/* {setDeleteProductID(product?._id)} */}
                  {/* {setDeleteProductID(product?._id)} */}
                  {/* {console.log('proIDSSSSS', product)} */}
                  <span>Are you sure you want to delete this event?</span>

                </div>
                {/* // )} */}
              </div>
            </Dialog>

          }
        </div>
      </div >
    </div >
  );
}

export default OrgMyEventDetails;
