import React, { useState, useRef } from "react";

//---------------components------------------------//
import DashboardNavbar from "../DashboardCmp/DashboardNavbar";
import Button from "../../components/reuseable/Button";
import { IoIosTimer } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
//-------------libray--------------------------//
import { BsArrowRight } from "react-icons/bs";
import { ReactSVG } from "react-svg";
import { Link, useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
//--------------------images--------------------------//
import download from "../../asserts/images/download.svg";
import heart from "../../asserts/images/downhert.svg";
import logo from "../../../src/asserts/images/Rectangle.svg";
import heartIcon from "../../asserts/images/eventdetailsHearIcon.svg";
import uploadIcon from "../../asserts/images/eventUploadIcon.svg";
import AddtoCalender from "../DashboardCmp/AddtoCalender";
//---------------dummay-data-----------------------//
import { EventData } from "../../constant/Dummay";
import Footer from "../../layout/Footer";
import EventFeedback from "./Islamic-Culture/EventFeedback";
import { ContactUsModal } from "./ContactUsModal";
import { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import { format } from "date-fns";
import { Loader } from "../../components/reuseable/Loader";
import LikeButton from "../DashboardCmp/Likebutton";
import { url } from "../../Routes/API_Routes";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";


// import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';


const EventDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [EventData, setEventData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [items, setItems] = useState([]);
  const [buddy, setBuddy] = useState();
  const [data, setData] = useState({});
  const [lat, setLat] = useState(0);
  const [long, setlong] = useState(0);
  const [location, setLocation] = useState('')




  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState('paper');

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);











  const { id } = useParams();
  const { userId } = useParams();

  useEffect(() => {
    GetEventsDetails(id);
  }, []);
  const token = secureLocalStorage.getItem("token");
  const handleLike = (itemId, liked) => {
    const updatedItems = EventData.map((item) => {
      if (item.id === itemId) {
        return { ...item, liked };
      }
      return item;
    });
    setItems(updatedItems);
  };
  const GetEventsDetails = (id) => {
    setLoader(true);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    return fetch(
      "https://ilmcircle.com/backend/api/student/event/" + id,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result?.status === 200) {

          setEventData(result?.data);
          if (result?.data?.location && result?.data?.location !== '[object Object]') {
            try {
              const locationString = result?.data?.location?.replace(/^"(.*)"$/, '$1');
              const parsedData = JSON.parse(locationString);
              setLat(parsedData?.lat)
              setlong(parsedData?.long)
              setLocation(parsedData?.location)


            } catch (error) {
              console.error(`Error parsing location --->`);
            }
          }
          setLoader(false);

          return result?.data;
        } else {
          setLoader(false);
        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });
  };

  const handleGetData = () => {
    GetEventsDetails(id)
  }
  const handleModal = () => {
    setShowModal(!showModal);
  };





  const apiKey = 'AIzaSyCByyO3JtJCxeA23nnf-GZUzLR4DikY-0o';

  const mapStyles = {
    height: '570px',
    width: '100%',
  };

  const defaultCenter = {
    lat: lat,
    lng: long,
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

      const formattedDate = format(date, "h a 'CEST' EEEE MMMM d yyyy")
        .replace(/(\b[a-z])/g, (char) => char.toUpperCase()); // Uppercase the first letter of each word

      return formattedDate;
    }

    return null;
  }
  const handleAddToCalendarClick = () => {
    console.log('Add to Calendar clicked');

  };






  return (
    <>
      {loader && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <DashboardNavbar />
      <div className="container-fluid ev-details-bg">
        <div className="container">
          <div className="ev-details">
            <h1>{EventData?.eventName}</h1>
            <ul className="d-flex align-items-center ev-details-fonts">
              <li>
                <span> Hosted by:</span>
              </li>
              <Link to={`/islamic-culture/${userId}`}>

                <li className="d-flex align-items-center point">
                  <li className="mx-10">
                    <ReactSVG src={logo} />
                  </li>
                  <li className="orange ">{EventData?.userId?.userDetailId?.orgName}</li>
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </div>
      {/* ///////////////slider/////////////// */}
      <div className="container">
        <div className="ev-details-main">
          <div className="ev-details-one">
            <div className="box-carousel">
              <Carousel useKeyboardArrows={true}>
                {EventData?.images?.map((URL, i) => (
                  <div key={i} className="slide">
                    <img
                      className="img-fluid "
                      alt="sample_file"
                      src={URL?.url}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
            {/* <h5 className="orange point" data-bs-toggle="modal" data-bs-target="#exampleModalLabel"> */}
            <h5 className="orange point"  >
              <span onClick={handleClickOpen('paper')}>
                See all <BsArrowRight />
              </span>
            </h5>


            <div className="eventDetailHeading mt-4">
              <h4>Details</h4>
              <p className="pe-3 mb-2">
                {EventData?.eventDetail?.slice(
                  0,
                  !showMore ? 200 : EventData?.eventDetail?.length
                )}
              </p>
              {EventData?.eventDetail?.length > 200 && (
                <h2
                  className="orange point fs-6"
                  onClick={() => setShowMore(!showMore)}
                >
                  Read {showMore ? "less" : "more"} <BsArrowRight />
                </h2>
              )}
            </div>
          </div>
          <div className="ev-details-two">
            <div className=" border border-bottom-0  rounded">
              <div className="d-flex  justify-content-centr align-items-center pt-3 pb-1 ">
                <div className="px-4"><IoIosTimer fontSize={"30px"} /></div>
                <div className=" pt-3"  >
                  <div className="d-flex " >
                    <span className=" to-from-class">From:</span>
                    <p className=" ps-2 font-size-16 font-size-16-bold">{formatDate(EventData?.startingTime, EventData?.eventTime)}</p>
                  </div>
                  <div>
                    <div className="d-flex" >
                      <span className=" to-from-class">To:  </span>
                      <p className=" padding-start font-size-16 font-size-16-bold">{formatDate(EventData?.endTime, EventData?.eventTime)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="font-size-14 add-to-calender orange point " >
                <p>

                  <AddtoCalender
                    itemId={EventData?._id}
                    initialLiked={EventData?.isFavorite}
                    handleLike={(item) => { handleLike(item) }}
                    name="Event"
                    runData={true}
                    GetEventsData={handleGetData}
                    showlarge={true} />
                </p>
              </div>

              <div className="d-flex  justify-content-centr align-items-center py-2 ">
                <div className="px-4"><CiLocationOn fontSize={"30px"} /></div>
                <div   >

                  <p >
                    <span className=" orange font-size-16-bold  font-size-20">   {EventData?.eventName}</span>
                    <br />  <span className="font-size-16">{location ? location : " "}</span>
                  </p>

                </div>
              </div>





            </div>
            <LoadScript googleMapsApiKey={apiKey}>
              <GoogleMap mapContainerStyle={mapStyles} center={defaultCenter} zoom={15}>
                <Marker position={defaultCenter} />
              </GoogleMap>
            </LoadScript>
            <EventFeedback EventData={EventData} />
          </div>
        </div>
      </div>
      <Footer />
      <div className="container-fluid sticky-bottom ev-details-bg">
        <div className="container">
          <div className="d-flex just-between respon align-items-lg-center">
            {EventData && (
              <div className="ev-bottom-box-one">
                <small>{EventData?.startingTime != 'Invalid date' || 'Invalid time value' && formatDate(EventData?.startingTime)}</small>
                <strong>{EventData?.eventName}</strong>
                <p>{EventData?.entranceFee} </p>
              </div>
            )}
            <div className="ev-bottom-box-two">
              <div className="d-flex just-between card-event-icon card-event-icon-res mb-0 ">
                <Button
                  onClick={() => setShowModal(true)}
                  className={"profile-btn profile-btn-whit res-btn"}
                  data={" Contact"}
                />
                <div className="d-flex   justify-content-end">

                  {/* <ReactSVG src={heart} /> */}
                  <LikeButton
                    itemId={EventData?._id}
                    initialLiked={EventData?.isFavorite}
                    handleLike={(item) => { handleLike(item) }}
                    name="Event"
                    runData={true}
                    GetEventsData={handleGetData}
                    showlarge={true}
                  />

                  <img
                    style={{ width: 34 }}
                    className="pointer"
                    src={uploadIcon}
                    alt="heartIcon"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactUsModal EventData={EventData} setShowModal={setShowModal} id={id} showModal={showModal} handleModal={handleModal} />



      <>
        <React.Fragment>


          <Dialog
            open={open}
            onClose={handleClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
          >
            <DialogContent dividers={scroll === 'paper'}>
              <DialogContentText
                id="scroll-dialog-description"
                ref={descriptionElementRef}
                tabIndex={-1}
              >
                <div className="align-item-center ">
                  {EventData?.images?.map((URL, i) => (
                    <div key={i} className="mx-2 my-3 iMgshadow" >
                      <img
                        style={{
                          height: 300, width: "100%", objectFit: "cover",
                        }}
                        className="img-fluid  "
                        alt="sample_file"
                        src={URL?.url}
                      />
                    </div>
                  ))}

                </div>

              </DialogContentText>
            </DialogContent>
            <DialogActions>
              {/* <h1 onClick={handleClose}> Cancel </h1> */}
              {/* <Button >Cancel</Button> */}

            </DialogActions>
          </Dialog>
        </React.Fragment></>
    </>
  );
};

export default EventDetails;



