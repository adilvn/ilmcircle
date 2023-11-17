import React, { useMemo, useState } from "react";
import DashboardNavbar from "../../Dashboard/DashboardCmp/DashboardNavbar";
import "../MyFavorites/favorites.css";
import { favorite } from "./dummyArrayfav";
import { favoriteTeacher } from "./dummtArrayTeacher";
import { favoriteOrganization } from "./dummyArrayOrganizations";
import { favoriteEvents } from "./dummyArrayEvents";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import favPerson from "../../asserts/images/favperson.png";
import favMembers from "../../asserts/images/favMembers.png";
import favLocation from "../../asserts/images/favLocation.png";
import favLink from "../../asserts/images/FavLink.png";
import favCross from "../../asserts/images/favCross.png";
import favPin from "../../asserts/images/favPin.png";
import { AiOutlineClose } from "react-icons/ai";
import { Element, scroller } from "react-scroll";
import { Await, Link, useNavigate } from "react-router-dom";
import { BsPinAngle, BsFillPinAngleFill } from "react-icons/bs";
import { Loader } from "../../components/reuseable/Loader";
import secureLocalStorage from "react-secure-storage";
import API_Routes from "../../Routes/API_Routes";
import { showMessage } from "../../components/reuseable/Tostify";
import { useEffect } from "react";
import { format } from "date-fns";
function Favorites() {
  const role = secureLocalStorage.getItem("role");
  const [product, setProduct] = useState('');
  const [modalCategory, setModalCategory] = useState(false);
  const [loader, setLoader] = useState(false);
  const [allFavorite, setAllFavorite] = useState([]);
  const [allBuddies, setAllBuddies] = useState([]);
  const [allOrganization, setAllOrganization] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [myAllEvents, setMyAllEvents] = useState([])

  const [filterValue, setFilterValue] = useState("");
  const [searchApiData, setSearchApiData] = useState([]);
  const [indexes, setIndexes] = useState(0);
  const navigate = useNavigate();
  const token = secureLocalStorage.getItem("token");

  const scrollToSection = (sectionId) => {
    scroller.scrollTo(sectionId, {
      duration: 0,
      delay: 0,
      smooth: "easeInOutQuart",
    });
  };
  const dataDrop = [
    "Select",
    "Date: oldest to newest",
    "Date: newest to oldest",
  ];

  useEffect(() => {
    if (role != "student") {
      navigate("/");
    }
    GetFavoriteData();
  }, []);

  const GetFavoriteData = async () => {
    setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(API_Routes.GETFAVORITE, requestOptions);
      const result = await response.json();

      if (result.status === 200) {
        if (result.data && result.data.length > 0) {
          result.data.forEach((item) => {
            if (item.favoriteName === "Event") {
              setMyAllEvents([item]);
            } else if (item.favoriteName === "Organization") {
              setAllOrganization([item]);
            } else if (item.favoriteName === "Buddies") {
              setAllBuddies([item]);
            }
          });

          const parsedData = result?.data?.map((item) => {
            if (item?.favoriteId?.location) {
              try {
                const locationString = item?.favoriteId?.location?.replace(/^"(.*)"$/, "$1");
                item.favoriteId.location = JSON.parse(locationString);
              } catch (error) {
                console.error(`Error parsing location --->:`, error);
              }
            }
            return item;
          });
          setAllEvents(parsedData);
        } else {
          setAllEvents([]);
          setAllOrganization([]);
          setAllBuddies([]);
        }

        const parsedData = result.data.map((item) => {
          if (item?.favoriteId?.location) {
            try {
              const locationString = item?.favoriteId?.location.replace(/^"(.*)"$/, "$1");
              item.favoriteId.location = JSON.parse(locationString);
            } catch (error) {
              console.error(`Error parsing location --->:`, error);
            }
          }
          return item;
        });

        setSearchApiData(result.data);
        setAllFavorite(parsedData);
        setLoader(false);
      } else {
        showMessage(result.message, "error");
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

    return null; // or any other value to handle the case when no date is provided
  }


  const handleFilter = () => {
    let filterData = allFavorite;
    if (indexes == 0) {
      filterData = allFavorite;
    }

    if (indexes == 1) {
      filterData = filterData?.sort(
        (a, b) => new Date(a?.date) - new Date(b?.date)
      );
    }
    if (indexes == 2) {
      filterData = filterData?.sort(
        (a, b) => new Date(b?.date) - new Date(a?.date)
      );
    }
    return filterData;
  };

  const MemoizedFilterEvents = useMemo(handleFilter, [indexes, product]);
  useEffect(() => {
    if (role != "student") {
      navigate("/");
    }
    const filtered = MemoizedFilterEvents
    setAllOrganization(filtered);
  }, [product, indexes]);

  const handleChangeFilter = (item, index) => {
    setIndexes(index);
    setProduct(item);
  };
  // Events

  const CrossFavorite = (item) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();

    formdata.append("favoriteId", item?.favoriteId?._id);
    formdata.append("favoriteName", item?.favoriteName);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      "https://ilmcircle.com/backend/api/student/favorite/update",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {

        if (result.status == 200 || result.status == 201) {
          GetFavoriteData();
        }
      })
      .catch((error) => console.log("error", error));
  };

  // buddies

  const handleClickCross = (itemId) => {

    setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();

    formdata.append("favoriteName", "Buddies");
    formdata.append("usersId", itemId?.usersId?._id);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(API_Routes.ADDTOFAVORITE, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result?.status == 200 || result?.status == 201) {
          GetFavoriteData();

          setLoader(false);
          showMessage(result?.message);
        } else {
          setLoader(false);
          showMessage(result?.message, "error");
        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });
  };
  // Organization

  const handleClickCrossOrgaization = (itemId) => {

    setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();

    formdata.append("favoriteName", "Organization");
    formdata.append("usersId", itemId?.usersId?.userDetailId?.userId);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(API_Routes.ADDTOFAVORITE, requestOptions)
      .then((response) => response.json())
      .then((result) => {

        if (result.status == 200 || result.status == 201) {
          GetFavoriteData()

          setLoader(false);
          showMessage(result?.message);
        } else {
          setLoader(false);
          showMessage(result?.message, "error");
        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });
  };

  const PinUnpinEvent = (item) => {


    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("id", item?._id);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      "https://ilmcircle.com/backend/api/student/pin/update",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200 || result.status == 201) {
          GetFavoriteData();
        }
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <>
      {role == "student" ? (


        <div>
          {loader && (
            <div className="loaderScreen">
              <Loader />
            </div>
          )}
          <DashboardNavbar />

          <div className="container-fluid my-5">
            <div className="row ">
              <div className="col"></div>
              <div className="col-md-12">
                <div className="FavoriteHeading ps-4">
                  <h1>
                    Favourite ({allFavorite?.length ? allFavorite?.length : "0"})
                  </h1>
                </div>
                <div className="favoriteNavTab mt-5 favoriteCardsPadding">
                  <ul
                    class="row align-items-center nav nav-pills mb-3 gx-4 favoriteUl sticky-top justify-content-lg-between justify-content-center"
                    id="pills-tab"
                    role="tablist"
                  >
                    <li
                      onClick={() => scrollToSection("studyBuddies")}
                      class="nav-item nav-item col-md-2 col-sm-12 py-1"
                      role="presentation"
                    >
                      {/* <a href="#studyBuddies"> */}

                      <h6>Buddies</h6>
                      {/* </a> */}
                    </li>

                    <li
                      onClick={() => scrollToSection("teachers")}
                      class="nav-item nav-item col-md-2 col-sm-12 py-1"
                      role="presentation"
                    >
                      {/* <a href="#teachers"> */}

                      <h6>Teachers</h6>
                      {/* </a> */}
                    </li>
                    <li
                      onClick={() => scrollToSection("organization")}
                      class="nav-item nav-item col-md-2 col-sm-12 py-1"
                      role="presentation"
                    >
                      {/* <a href="#organization"> */}

                      <h6>Organizations</h6>
                      {/* </a> */}
                    </li>

                    <li
                      onClick={() => scrollToSection("events")}
                      class="nav-item nav-item col-md-2 col-sm-12 py-1"
                      role="presentation"
                    >
                      {/* <a href="#events"> */}

                      <h6>Events</h6>
                      {/* </a> */}
                    </li>
                  </ul>

                  <div className="px-4 pt-4">
                    <div className="width-class-25 float-end position-relative d-flex align-items-center gap-4">
                      <div className="SubPriceTextColor ms-auto">Sort by</div>

                      <div
                        className="statusField py-2 px-3 w-75  d-flex justify-content-between shadowBorder "
                        onClick={() => setModalCategory(!modalCategory)}
                      >
                        <span className="me-0">
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
                      {/* {(searchApiData?.length > 0 && modalCategory )? ( */}
                      {modalCategory ? (

                        <div
                          className="categroyDropDown  mt-2 z-3 position-absolute w-75 end-0"
                          style={{ backgroundColor: "#fcfcfc", top: "38px" }}
                        >
                          {dataDrop?.map((item, index) => (
                            <div
                              key={index}
                              className="categoryGoal my-2 point"
                              onClick={() => {
                                setProduct(item);
                                setModalCategory(false);
                                handleChangeFilter(item, index);
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
                    <Element id="studyBuddies" className=" cardsMain mt-5">
                      <h4 className="pt-4">Buddies</h4>
                      {allBuddies?.length > 0 ? (
                        <div className="row">
                          {allFavorite
                            ?.filter((item) => item?.favoriteName === "Buddies")
                            ?.map((item, index) => {
                              const riwayaArray = JSON?.parse(
                                item?.usersId?.goals[0]?.riwaya
                              );
                              const studyArray = JSON?.parse(
                                item?.usersId?.goals[0]?.study
                              );
                              const languageArray = JSON?.parse(
                                item?.usersId?.userDetailId?.language
                              );

                              return (
                                <div key={index} className="col-md-6 col-lg-3">
                                  <div className="card-wrap">
                                    <div className="card-content  position-relative ">
                                      <Link
                                        style={{ textDecoration: "none" }}
                                        aria-current="page"
                                      >
                                        <div className="imageContainer">
                                          <img
                                            className="card__image"
                                            src={
                                              item?.usersId?.userDetailId?.image
                                                ?.url
                                            }
                                            alt="productImage"
                                          />
                                        </div>

                                        <div className="card__content ">
                                          <h1 className="h-auto">
                                            {item?.usersId?.userDetailId?.firstName}{" "}
                                            {item?.usersId?.userDetailId?.lastName}
                                          </h1>
                                          <div className="text-resize multiline ">
                                            <div className="cardsFlex">
                                              <h2>Location:</h2>
                                              <h3>
                                                {item?.usersId?.userDetailId?.city},{" "}
                                                {
                                                  item?.usersId?.userDetailId
                                                    ?.country
                                                }
                                              </h3>
                                            </div>
                                            <div className="cardsFlex">
                                              <h2>Riwaya:</h2>
                                              <h3>{riwayaArray?.join(", ")}</h3>
                                            </div>
                                            <div className="cardsFlex">
                                              <h2>Study goal:</h2>
                                              <h3>{studyArray?.join(", ")}</h3>
                                            </div>
                                            <div className="cardsFlex">
                                              <h2>Memorization level:</h2>
                                              <h3>{item?.Memorizationlevel}</h3>
                                            </div>
                                            <div className="cardsFlex">
                                              <h2>Language:</h2>
                                              <h3>
                                                {languageArray
                                                  ?.map((item) => `${item.level}`)
                                                  .join(", ")}
                                              </h3>
                                            </div>
                                          </div>
                                        </div>
                                      </Link>
                                      <div className=" pe-2  position-absolute d-flex justify-content-between w-100   top-0  mt-4">
                                        {item?.isPin ? (
                                          <BsFillPinAngleFill
                                            className="mx-2 point"
                                            fontSize={"24px"}
                                            color="#252727C7"
                                            onClick={() => PinUnpinEvent(item)}
                                          />
                                        ) : (
                                          <BsPinAngle
                                            className="mx-2 point"
                                            fontSize={"24px"}
                                            color="#252727C7"
                                            onClick={() => PinUnpinEvent(item)}
                                          />
                                        )}
                                        <AiOutlineClose
                                          className="me-2 point"
                                          fontSize={"20px"}
                                          color="#252727C7"
                                          onClick={() => handleClickCross(item)}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      ) : (
                        <div className="row mt-sm-5 mt-3 g-4">
                          <div className="commingSoonTxt text-center">
                            No Favorites added yet!
                          </div>
                        </div>
                      )}
                    </Element>

                    <Element id="organization" className="cardsMain pt-5">
                      <h4 className="py-4">Organizations</h4>
                      {
                        allOrganization?.length > 0 ? (
                          <div className="row">
                            {allFavorite
                              ?.filter(
                                (item) => item?.favoriteName === "Organization"
                              )
                              ?.map((item, index) => {



                                const membersArray = item?.usersId?.member?.filter(
                                  (member) =>
                                    member?.role &&
                                    member?.role?.toLowerCase()?.includes('member')
                                );
                                const nonMembersArray = item?.usersId?.member?.filter(
                                  (member) =>
                                    !member?.role ||
                                    !member?.role?.toLowerCase()?.includes('member')
                                );

                                return (

                                  <div key={index} className="col-md-6 col-lg-3">

                                    <div className="card-wrap">
                                      <div className="card-content position-relative">
                                        <Link
                                          style={{ textDecoration: "none" }}
                                          aria-current="page"
                                        >
                                          <div className="imageContainer">
                                            <img
                                              className="card__image"
                                              src={
                                                item?.usersId?.userDetailId?.image
                                                  ?.url
                                              }
                                              alt="productImage"
                                            />
                                          </div>

                                          <div className="card__content">
                                            <h1 className="h-auto">
                                              {item?.usersId?.userDetailId?.orgName}
                                            </h1>
                                            <div className="text-resize multiline ">
                                              <div className="cardsFlex">
                                                <img
                                                  className="favIcon"
                                                  src={favPerson}
                                                  alt="favPerson"
                                                />
                                                <h3>

                                                  Organized by
                                                  {nonMembersArray[0]?.firstName ? " " + nonMembersArray[0]?.firstName : " Admin"}

                                                  {nonMembersArray?.length && (nonMembersArray?.length > 2) ? " and " + (nonMembersArray?.length - 1) + " others" : ""}
                                                  {nonMembersArray?.length && (nonMembersArray?.length === 2) ? " and " + (nonMembersArray?.length - 1) + " other" : ""}

                                                </h3>
                                              </div>
                                              <div className="cardsFlex">
                                                <img
                                                  className="favIcon"
                                                  src={favMembers}
                                                  alt="favMembers"
                                                />
                                                <h3>{membersArray?.length ? membersArray?.length : 0} members</h3>
                                              </div>

                                              <div className="cardsFlex">
                                                <img
                                                  className="favIcon"
                                                  src={favLocation}
                                                  alt="favLocation"
                                                />
                                                <h3 className="mb-0">
                                                  {
                                                    item?.usersId?.userDetailId
                                                      ?.address
                                                  }
                                                </h3>
                                              </div>
                                              <div className="cardsFlex">
                                                <img
                                                  className="favIcon"
                                                  src={favLink}
                                                  alt="favLink"
                                                />
                                                <h3 className="favouritesLink mb-0">
                                                  {
                                                    item?.usersId?.userDetailId
                                                      ?.website
                                                  }
                                                </h3>
                                              </div>
                                            </div>
                                          </div>
                                        </Link>

                                        <div className=" pe-2  position-absolute d-flex justify-content-between w-100   top-0  mt-4">
                                          {item?.isPin ? (
                                            <BsFillPinAngleFill
                                              className="mx-2 point"
                                              fontSize={"24px"}
                                              color="#252727C7"
                                              onClick={() => PinUnpinEvent(item)}
                                            />
                                          ) : (
                                            <BsPinAngle
                                              className="mx-2 point"
                                              fontSize={"24px"}
                                              color="#252727C7"
                                              onClick={() => PinUnpinEvent(item)}
                                            />
                                          )}
                                          <AiOutlineClose
                                            className="me-2 point"
                                            fontSize={"20px"}
                                            color="#252727C7"
                                            onClick={() =>
                                              handleClickCrossOrgaization(item)
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        ) : (
                          <div className="row mt-sm-5 mt-3 g-4">
                            <div className="commingSoonTxt text-center">
                              No Favorites added yet!
                            </div>
                          </div>
                        )

                      }
                    </Element>

                    <Element id="events" className="cardsMain pt-5">
                      <h4 className="py-4">Events</h4>
                      {allEvents?.length ? (
                        <div className="row">
                          {allFavorite
                            ?.filter((item) => item?.favoriteName === "Event")
                            ?.map((item, index) => {


                              return (
                                <div key={index} className="col-md-6 col-lg-3">
                                  <div className="card-wrap">
                                    <div className="card-content position-relative">
                                      <Link
                                        style={{ textDecoration: "none" }}
                                        aria-current="page"
                                      >
                                        <div className="imageContainer">
                                          <img
                                            className="card__image"
                                            src={item?.favoriteId?.images[0]?.url}
                                            alt="productImage"
                                          />
                                        </div>

                                        <div className="card__content">
                                          <div className="cardsFlex">
                                            {item?.favoriteId?.startingTime !== 'Invalid date' && item?.favoriteId?.startingTime !== 'Invalid time value' && (
                                              <h5>{formatDate(item?.favoriteId?.startingTime, item?.favoriteId?.eventTime)}</h5>
                                            )}                                            </div>
                                          <h1 className="h-auto">
                                            {item?.favoriteId?.eventName}
                                          </h1>
                                          <div className="text-resize multiline ">
                                            <div className="cardsFlex">
                                              <h3>
                                                {item?.favoriteId?.eventDetail.slice(0, 99)}... •{" "}
                                                {item?.favoriteId?.location?.location}
                                              </h3>
                                            </div>
                                            {/* <div className="cardsFlex">
                                              <h3>20 Attendees</h3>
                                            </div> */}
                                          </div>
                                        </div>
                                      </Link>
                                      <div className=" pe-2  position-absolute d-flex justify-content-between w-100   top-0  mt-4">
                                        {item?.isPin ? (
                                          <BsFillPinAngleFill
                                            className="mx-2 point"
                                            fontSize={"24px"}
                                            color="#252727C7"
                                            onClick={() => PinUnpinEvent(item)}
                                          />
                                        ) : (
                                          <BsPinAngle
                                            className="mx-2 point"
                                            fontSize={"24px"}
                                            color="#252727C7"
                                            onClick={() => PinUnpinEvent(item)}
                                          />
                                        )}
                                        <AiOutlineClose
                                          className="me-2 point"
                                          fontSize={"20px"}
                                          color="#252727C7"
                                          onClick={() => CrossFavorite(item)}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      ) : (
                        <div className="row mt-sm-5 mt-3 g-4">
                          <div className="commingSoonTxt text-center">
                            No Favorites added yet!
                          </div>
                        </div>
                      )}
                    </Element>

                    <Element id="teachers" className="cardsMain pt-5">
                      <h4 className="py-4">Teachers</h4>

                      <div className="row mt-sm-5 mt-3 g-4">
                        <div className="commingSoonTxt text-center">
                          Coming Soon
                        </div>
                      </div>
                    </Element>
                  </div>
                </div>
              </div>
              <div className="col"></div>
            </div>
          </div>
        </div>

      ) : ""}
    </>
  );
}

export default Favorites;
