import React, { useEffect, useRef, useState } from "react";
import "../Chat/messages.css";

//ILM cicle imports
import newMsg from "../../../asserts/images/newMsg.png";

import { studyBuddy } from "./ContactDummyArray";
import { teachers } from "./ContactDummyArray";

import chatSearch from "../../../asserts/images/chatSearch.png";
import img1 from "../../../asserts/images/chatUser1.png";

import ContactDetatils from "./ContactDetatils";
import { ContactOffCanvas } from "./ContactOffCanvas";
import secureLocalStorage from "react-secure-storage";
import API_Routes, { url } from "../../../Routes/API_Routes";
import { showMessage } from "../../../components/reuseable/Tostify";
import { Loader } from "../../../components/reuseable/Loader";
import { OrganizationContact } from "./OrganizationContact";
import OrganizationContactOffcanvas from "./OrganizationContactOffcanvas";

function Chat(props) {
  const [smallScreen, setSmallScreen] = useState("block");
  const [canvasScreen, setCanvasScreen] = useState(false);
  const [buddy, setBuddy] = useState();
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState([]);
  const [data, setData] = useState({});
  const [users, setUsers] = useState();
  const [loader, setLoader] = useState(false);


  const [filterValue, setFilterValue] = useState("")
  const [searchApiData, setSearchApiData] = useState([])
  const [data1, setData1] = useState([])

  const [OrganizationFriend, setOrganizationFriend] = useState([])

  const [show, setShow] = useState(false);
  const [organizationData2, setorganizationData2] = useState('')
  const ref = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [orgActiveIndex, setOrgActiveIndex] = useState(null);


  const [buddyScreen, setBuddyScreen] = useState(false)
  const [orgScreen, setOrgScreen] = useState(false)
  const handleAccordionItemClick = (index) => {
    setActiveIndex(index);
  };
  const token = secureLocalStorage.getItem("token");

  useEffect(() => {
    fetchConversations();
    const responsiveScreen = window.matchMedia("(max-width: 991px)");

    setCanvasScreen(responsiveScreen.matches);
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
    const filterData = users?.buddies?.filter(
      (item) => {
        const fullName = item?.userDetailId?.firstName + " " + item?.userDetailId?.lastName;
        return fullName.toLowerCase().includes(search?.toLowerCase());
      }
      // item?.userDetailId?.firstName
      //   ?.toLowerCase()
      //   .includes(search?.toLowerCase()) ||
      // item?.userDetailId?.lastName
      //   ?.toLowerCase()
      //   .includes(search?.toLowerCase())
    );


    const filterData2 = users?.organization?.filter((item) =>
      item?.userDetailId?.orgName?.toLowerCase().includes(search?.toLowerCase())
    );
    if (search.length == 0) {
      setConversations(users);
    } else {
      setConversations({ buddies: filterData, organization: filterData2 });
    }
  }, [search]);

  const fetchConversations = async () => {
    setLoader(true);
    try {
      var myHeaders = new Headers();

      myHeaders.append("Authorization", "Bearer " + token);
      const res = await fetch(`${url}api/student/allusers`, {
        method: "GET",
        headers: myHeaders,
      });
      const resData = await res.json();
      if (resData.status == 200) {
        setLoader(false);
        setConversations(resData.data);
        setUsers(resData?.data);
        setData1(resData?.data)
        setSearchApiData(resData?.data)
        setOrganizationFriend(resData?.data?.organization)
        setActiveIndex(null)
      } else {
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const blockUnBlockUser = async () => {

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("contactId", buddy?._id);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`${url}api/student/block`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200) {
          fetchBuddy(buddy);
          if (result?.data?.isBlock) {
            showMessage("User block successfully");
          } else {
            showMessage("User unblock successfully");
          }
        }
      })
      .catch((error) => console.log("error", error));
  };
  const sendMessage = async () => {
    setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("contactId", buddy?._id);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`${url}api/student/message/create`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 201) {
          fetchBuddy(buddy);
        }
        setLoader(false);
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });
  };

  const fetchBuddy = async (item, index) => {
    setLoader(true)

    try {
      setData(item);
      var myHeaders = new Headers();

      myHeaders.append("Authorization", "Bearer " + token);
      const res = await fetch(`${url}api/student/buddy/${item._id}`, {
        method: "GET",
        headers: myHeaders,
      });
      const resData = await res.json();
      if (resData?.status == 200) {

        setBuddy(resData?.data);
        setLoader(false)
        console.log(resData?.data)


      }
    } catch (error) {
      console.log(error);
      setLoader(false)

    }
  };
  const [organizationData, setOrganizationData] = useState({})
  const handleSendOrganozation = (item) => {

  }
  const fetchOrganizationBuddy = async (item, index) => {
    console.log(item);
    const MyId = item?._id

    setLoader(true)
    setorganizationData2(MyId)

    try {
      // setData(item);
      var myHeaders = new Headers();

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      myHeaders.append("Authorization", "Bearer " + token);
      const res = await fetch(API_Routes.GETISLAMICULTUREPROFILEDATA + MyId, requestOptions)
      const resData = await res.json();
      if (resData?.status == 200) {

        // setBuddy(resData?.data);
        setLoader(false)
        console.log(resData?.data)
        setOrganizationData(resData?.data)
        setOrganizationPortfolio(true)

      }
    } catch (error) {
      console.log(error);
      setLoader(false)

    }
  };

  const handleFilter = (e) => {
    if (e.target.value === "") {
      setData1(searchApiData);
    } else {
      const filteredData = {
        buddies: searchApiData?.buddies?.filter(item => {
          const fullName = item?.userDetailId?.firstName + " " + item?.userDetailId?.lastName;

          return fullName.toLowerCase().includes(e.target.value.toLowerCase());
        }),
        organization: searchApiData?.organization?.filter(item => {
          const orgName = item?.userDetailId?.orgName?.toLowerCase() || "";
          return orgName?.includes(e.target.value.toLowerCase());
        })
      };

      setData1(filteredData);
    }
    setFilterValue(e.target.value);
  }
  const [OrganizationPortfolio, setOrganizationPortfolio] = useState(false)
  return (
    <div className="overflow-x-hidden" style={{ paddingLeft: 64 }}>
      {loader && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div
        className=""
        style={{
          backgroundColor: "rgba(243, 250, 252, 1)",
        }}
      >
        <div className="row " style={{ height: "100vh" }}>
          <div
            className={`col-xl-3 col-lg-4 px-0 no-scr-bar d-${smallScreen} `}
            style={{
              border: " 1px solid var(--light-grey, #E0E0DB)",
              height: "100%",
              overflowY: "scroll",
            }}
          >
            <div style={{ marginTop: 25 }} className="px-sm-5 px-lg-4 ">
              <div className="message ILMLeftHeader">
                <h1>My Contact</h1>
                {/* <img style={{ cursor: "pointer" }} src={newMsg} alt="newMsg" /> */}
              </div>

              <div className="mt-4 position-relative">
                <input
                  type="text"
                  className={"chatSearch"}
                  placeholder={"Search"}
                  // onChange={(e) => setSearch(e.target.value)}
                  value={filterValue}
                  onInput={(e) => handleFilter(e)}
                />
                <img
                  onClick={() => setShow(!show)}
                  className="chatSearchSvg"
                  style={{ width: 18.5, height: 18.5 }}
                  src={chatSearch}
                  alt="chatSearch"
                />
              </div>

              <div className="mt-4 chatAccordion">
                <div class="accordion" id="accordionExample">
                  {data1?.buddies?.length === 0 && data1?.organization?.length == 0 ?
                    <div className='MediaEdit d-flex align-items-center justify-content-center pt-3 pe-3 '>
                      <h4>No Contact Found</h4>
                    </div> :

                    <>
                      {data1?.buddies?.length > 0 && (
                        <>
                          <div class="accordion-item">
                            <h2 class="accordion-header">
                              <button
                                class="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseOne"
                                aria-expanded="true"
                                aria-controls="collapseOne"
                              >
                                Buddies
                              </button>
                            </h2>

                            <div
                              id="collapseOne"
                              class="accordion-collapse collapse show"
                              data-bs-parent="#accordionExample"
                            >
                              <div class="accordion-body px-2">
                                {data1?.buddies?.map((item, index) => {
                                  return (
                                    <div key={index}>
                                      <div className="message">
                                        <div className="openMsg">
                                          <div>
                                            <div
                                              data-bs-toggle={
                                                canvasScreen ? "offcanvas" : ""
                                              }
                                              data-bs-target={
                                                canvasScreen
                                                  ? "#offcanvasExample"
                                                  : ""
                                              }
                                              className={`message ${activeIndex === index
                                                ? "chatActive d-flex justify-content-between"
                                                : "d-flex justify-content-between"
                                                }`}
                                              onClick={() => {
                                                setActiveIndex(index);
                                                fetchBuddy(item, index);
                                                setBuddyScreen(true)
                                                setOrgScreen(false)
                                              }}
                                            >
                                              <div className="d-flex ">
                                                <img
                                                  className="productImg rounded-circle"
                                                  src={
                                                    item?.userDetailId?.image?.url
                                                      ? item?.userDetailId?.image
                                                        ?.url
                                                      : img1
                                                  }
                                                  alt="chatUser1"
                                                  style={{
                                                    width: "50px",
                                                    height: "50px",
                                                  }}
                                                />
                                                <div className="ps-2">
                                                  <h6 className=" messageTitle fw-bold m-0">
                                                    {item?.userDetailId?.firstName
                                                      ? item?.userDetailId
                                                        ?.firstName +
                                                      " " +
                                                      item?.userDetailId?.lastName
                                                      : "Unknown"}
                                                  </h6>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          <hr
                            style={{
                              marginTop: "0.5rem",
                              marginBottom: "0.5rem",
                            }}
                          ></hr>
                        </>
                      )}

                      {data1?.organization?.length > 0 && (
                        <>
                          <div class="accordion-item">
                            <h2 class="accordion-header">
                              <button
                                class="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseThree"
                                aria-expanded="false"
                                aria-controls="collapseThree"
                              >
                                Organizations
                              </button>
                            </h2>
                            <div
                              id="collapseThree"
                              class="accordion-collapse collapse"
                              data-bs-parent="#accordionExample"
                            >
                              <div class="accordion-body px-2">
                                {OrganizationFriend?.map((item, index) => {
                                  return (
                                    <div key={index}>

                                      <div className="message">
                                        <div className="openMsg">

                                          <div >
                                            <div
                                              data-bs-toggle={
                                                canvasScreen ? "offcanvas" : ""
                                              }
                                              data-bs-target={
                                                canvasScreen
                                                  ? "#offcanvasExample2"
                                                  : ""
                                              }
                                              className={`message ${orgActiveIndex === index
                                                ? "chatActive d-flex justify-content-between"
                                                : "d-flex justify-content-between"
                                                }`}
                                              onClick={() => {
                                                fetchOrganizationBuddy(item, index)
                                                setOrgActiveIndex(index)
                                                setBuddyScreen(false)
                                                setOrgScreen(true)
                                              }
                                              }
                                            >
                                              <div className="d-flex " >
                                                <img
                                                  className="productImg rounded-circle"
                                                  src={
                                                    item?.userDetailId?.image?.url
                                                      ? item?.userDetailId?.image
                                                        ?.url
                                                      : img1
                                                  }
                                                  alt="chatUser1"
                                                  style={{
                                                    width: "50px",
                                                    height: "50px",
                                                  }}
                                                />
                                                <div className="ps-2">
                                                  <h6 className=" messageTitle fw-bold m-0">
                                                    {item?.userDetailId?.orgName
                                                      ? item?.userDetailId?.orgName
                                                      : "Unknown"}
                                                  </h6>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  }
                </div>
              </div>
            </div>
          </div>
          {buddyScreen && (
            <>
              {!canvasScreen ? (
                <div
                  className={`col-xl-9 col-lg-8 msgCol  chatCol px-0 `}
                  style={{ backgroundColor: "" }}
                >
                  {activeIndex != null && (
                    <div
                      className="px-4 py-4"
                      style={{
                        backgroundColor: "rgba(252, 252, 252, 1)",
                        height: "100vh",
                        overflowY: "scroll",
                      }}
                    >
                      <ContactDetatils
                        data={data}
                        buddy={buddy}
                        blockUser={blockUnBlockUser}
                        sendMessage={sendMessage}
                        fetchConversations={fetchConversations}
                      />

                    </div>
                  )}
                </div>
              ) : (
                <ContactOffCanvas
                  data={data}
                  buddy={buddy}
                  blockUser={blockUnBlockUser}
                  sendMessage={sendMessage}
                />
              )}
            </>
          )}


          {orgScreen && (
            <>
              {!canvasScreen ? (
                <div
                  className={`col-xl-9 col-lg-8 msgCol  chatCol px-0 `}
                  style={{ backgroundColor: "" }}
                >
                  {orgActiveIndex != null && (
                    <div
                      className="px-4 py-4"
                      style={{
                        backgroundColor: "rgba(252, 252, 252, 1)",
                        height: "100vh",
                        overflowY: "scroll",
                      }}
                    >
                      <OrganizationContact fetchConversations={fetchConversations} data={organizationData} data2={organizationData2} />
                    </div>
                  )}
                </div>
              ) : (
                <OrganizationContactOffcanvas fetchConversations={fetchConversations} data={organizationData} data2={organizationData2} />
              )}
            </>
          )}


        </div>
      </div>
    </div>
  );
}

export default Chat;


// place this before orgazization dropdown
{/* {conversations?.teacher?.length > 0 && (
                    <>
                      <div class="accordion-item">
                        <h2 class="accordion-header">
                          <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseTwo"
                            aria-expanded="false"
                            aria-controls="collapseTwo"
                          >
                            Teachers
                          </button>
                        </h2>
                        <div
                          id="collapseTwo"
                          class="accordion-collapse collapse"
                          data-bs-parent="#accordionExample"
                        >
                          <div class="accordion-body px-2 pt-4">
                            {conversations?.buddies?.map((item, index) => {
                              // studyBuddy.map((item, index) => {
                              return (
                                <div key={index}>
                                  <div className="message">
                                    <div className="openMsg">
                                      <div>
                                        <div
                                          data-bs-toggle={
                                            canvasScreen ? "offcanvas" : ""
                                          }
                                          data-bs-target={
                                            canvasScreen
                                              ? "#offcanvasExample"
                                              : ""
                                          }
                                          className={`message ${
                                            activeIndex === item.id
                                              ? "chatActive d-flex justify-content-between"
                                              : "d-flex justify-content-between"
                                          }`}
                                          onClick={() => fetchMessages(item)}
                                        >
                                          <div className="d-flex ">
                                            <img
                                              className="productImg rounded-circle"
                                              src={
                                                user == item.userId._id
                                                  ? item?.contactId
                                                      ?.userDetailId?.image?.url
                                                  : item?.userId?.userDetailId
                                                      ?.image?.url
                                              }
                                              alt="chatUser1"
                                              style={{
                                                width: "50px",
                                                height: "50px",
                                              }}
                                            />
                                            <div className="ps-2">
                                              <h6 className=" messageTitle fw-bold m-0">
                                                {user == item.userId._id
                                                  ? item?.contactId
                                                      ?.userDetailId
                                                      ?.firstName +
                                                    " " +
                                                    item?.contactId
                                                      ?.userDetailId?.lastName
                                                  : item?.userId?.userDetailId
                                                      ?.firstName +
                                                    " " +
                                                    item?.userId?.userDetailId
                                                      ?.lastName}
                                              </h6>
                                              <p className="recentMessage">
                                                {item.lastMessage}
                                              </p>
                                            </div>
                                          </div>
                                          <div>
                                            <div>
                                              <p className="userName">
                                                {item?.date}
                                              </p>
                                              <p className="unreadMsg">
                                                {item.unreadMsg}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <hr
                        style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
                      ></hr>
                    </>
                  )} */}