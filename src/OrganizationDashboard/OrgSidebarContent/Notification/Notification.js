import React, { useEffect, useState } from "react";
import "./Notification.css";
import DashboardNavbar from "../../../Dashboard/DashboardCmp/DashboardNavbar";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import CheckBox from "./CheckBox";
import { data } from "./DummyData";
import { RiDeleteBin6Line } from "react-icons/ri";
import secureLocalStorage from "react-secure-storage";
import { Loader } from "../../../components/reuseable/Loader";
import API_Routes from "../../../Routes/API_Routes";
import { showMessage } from "../../../components/reuseable/Tostify";
import moment from "moment";
import { BsSend } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export const Notification = () => {
  const [product, setProduct] = useState({});
  const [modalCategory, setModalCategory] = useState(false);
  // const [items, setNotifications] = useState(data);
  const [selectedItem, setSelectedItem] = useState([]);
  const dataDrop = [
    "Last 30 days",
    "Yesterday",
    "Today",
    "This month",
    "Custom",
  ];
  const token = secureLocalStorage.getItem("token");
  const [loader, setLoader] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [reply, setReply] = useState([]);
  const [showReply, setShowReply] = useState(false);
  const [isClearButtonVisible, setIsClearButtonVisible] = useState(false);
  const [messageText, setMessageText] = useState('');

  const navigate = useNavigate()

  const handleClickRow = (item) => {
    navigate(`${item?.details?.path}/${JSON.parse(item?.details?.index)}`);

    // studDashboardIndex({ studIndex: JSON.parse(item?.details?.index) })
  };
  const handleItemToggle = (e, itemId) => {
    e.stopPropagation();

    const updatedItems = notifications?.map((item) => {
      if (item._id === itemId) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    setNotifications(updatedItems);
  };

  const handleToggleReply = (itemId) => {
    setShowReply((prevShowReply) => ({
      ...prevShowReply,
      [itemId]: !prevShowReply[itemId],
    }));
  };


  const updateReplyText = (itemId, text) => {
    // Check if an entry with the same item ID already exists
    const replyEntryIndex = reply.findIndex(entry => entry.itemId === itemId);

    // If an entry exists, update the text; otherwise, create a new entry
    if (replyEntryIndex !== -1) {
      const updatedReply = [...reply];
      updatedReply[replyEntryIndex].text = text;
      setReply(updatedReply);
    } else {
      setReply(prevReply => [...prevReply, { itemId, text }]);
    }
  };
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setReply(e.target.value);

    // Toggle the visibility of the "X" button based on whether there's text in the input
    setIsClearButtonVisible(!!inputValue);
  };


  const handleSelectAllToggle = () => {
    const allSelected = notifications?.every((item) => item?.selected);
    const updatedItems = notifications?.map((item) => ({
      ...item,
      selected: !allSelected,
    }));
    setNotifications(updatedItems);
  };
  const handleDlt = (item) => {
    const dltItems = notifications?.filter((user) => {
      return user._id !== item._id;
    });
    // const addItem = items.filter((item) => {
    //   return item.selected;
    // });
    setSelectedItem(dltItems);
    setNotifications(dltItems);
  };

  useEffect(() => {
    GetNotifications()
  }, [])

  const GetNotifications = () => {
    setLoader(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(API_Routes.GETNOTIFICATIONORG, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status == 200 || result.status == 201) {
          setNotifications(result?.data)
          setLoader(false);
        } else {
          showMessage(result?.message, "error");
          setLoader(false);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("error", error);
      });
  }


  const UpdateNotification = (e, item, sendAll) => {
    if (e) {
      e.stopPropagation()
    }
    setLoader(true)

    const ids = notifications?.map((item) => {
      return item?._id
    })
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    if (sendAll == 1) {
      formdata.append("isRead", "true");
      ids?.forEach((e) => {
        formdata.append("id[]", e);
      })
    } else if (sendAll == 2) {
      formdata.append("isReply", "true");
      formdata.append("id[]", [item?._id]);

    } else if (sendAll == 4) {
      formdata.append("isRead", "false");
      ids?.forEach((e) => {
        formdata.append("id[]", e);
      })
    } else if (sendAll == 6) {
      formdata.append("isRead", "true");
      formdata.append("id[]", item?._id);
    } else {
      formdata.append("isRead", "false");
      formdata.append("id[]", item?._id);
    }


    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(API_Routes.UPDATENOTIFICATIONORG, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status == 200 || result.status == 201) {
          GetNotifications()
          setSelectedItem([])
          setLoader(false);
          showMessage(result?.message)
        } else {
          showMessage(result?.message, "error");
          setLoader(false);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("error", error);
      });
  }

  const UpdateFeedbackData = (item, replyEntry) => {
    setLoader(true)

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    const feedbackId = JSON.parse(item?.details?.feedBackId)
    var formdata = new FormData();
    formdata.append("id", feedbackId);
    formdata.append("reply", replyEntry?.text);



    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };


    fetch(API_Routes.UPDATEFEEDBACK, requestOptions)
      .then(response => response.json())
      .then(result => {


        if (result?.status == 200 || result?.status == 201) {
          setLoader(false)
          showMessage(result?.message)
          UpdateNotification("", item, 2)

          // setReply('')
          // GetNotifications()
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

  const formattedDate = (inputDate) => {
    return moment(inputDate).format('HH:mm MMMM D YYYY')
  };


  const handleDelete = (item, delAll) => {
    setLoader(true)
    const ids = notifications?.map((item) => {
      return item?._id
    })

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    if (delAll) {
      ids?.forEach((e) => {
        formdata.append("id[]", e);
      })
    } else {
      formdata.append("id[]", item?._id);
    }

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch("https://ilmcircle.com/backend/api/organization/notification/delete", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result?.status == 200 || result?.status == 201) {
          setLoader(false)
          showMessage(result?.message)
          setShowReply(false)
          GetNotifications()
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

  const filterData = () => {
    let filteredData = notifications
    if (product.category == "Custom" || product.category == "") {
      filteredData = filteredData
    }

    if (product.category === "Last 30 days") {
      const currentDate = new Date();
      const thirtyDaysAgo = new Date(currentDate);
      thirtyDaysAgo.setDate(currentDate.getDate() - 30);
      filteredData = filteredData.filter((item) => {
        const settedDate = new Date(item?.date);
        return settedDate >= thirtyDaysAgo;
      });
    }
    if (product.category === "Yesterday") {
      const currentDate = new Date();
      const oneDayAgo = new Date(currentDate);
      oneDayAgo.setDate(currentDate.getDate() - 1);
      const formattedDate = oneDayAgo.toLocaleDateString();
      filteredData = filteredData.filter((item) => {
        const settedDate = new Date(item?.date);
        const viewDate = settedDate?.toLocaleDateString();
        return viewDate === formattedDate;
      });
    }
    if (product.category == "Today") {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString();
      filteredData = filteredData.filter((item) => {
        const settedDate = new Date(item?.date);
        const viewDate = settedDate?.toLocaleDateString();
        return viewDate === formattedDate;
      });
    }
    if (product.category === "This month") {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();

      filteredData = filteredData.filter((item) => {
        const settedDate = new Date(item?.date);
        const itemYear = settedDate.getFullYear();
        const itemMonth = settedDate.getMonth();

        return itemYear === currentYear && itemMonth === currentMonth;
      });
    }



    return filteredData
  }



  const filteredEventData = filterData();
  useEffect(() => {
    filterData()
  }, [product.category])


  return (
    <div className="notificationMain ">
      {loader && <div className="loaderScreen">
        <Loader />
      </div>}
      <DashboardNavbar />
      <div className="p-md-5 p-3 m-md-5">
        <div className="header row">
          <h6 className="col-md-6">Notification</h6>
          <div className="field mt-3 col-md-6  goalTaskDoneSection d-flex justify-content-end">
            <div className="w-50 position-relative">
              <div
                className="statusField py-2 px-3  d-flex justify-content-between shadowBorder"
                onClick={() => setModalCategory(!modalCategory)}
              >
                <span className="me-0">
                  {product.category ? product.category : "Select"}
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
                  className="categroyDropDown  mt-2 position-absolute w-100"
                  style={{ backgroundColor: "#fcfcfc" }}
                >
                  {dataDrop.map((item) => (
                    <div
                      className="categoryGoal my-2 point"
                      onClick={() => {
                        setProduct({ category: item });
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
          </div>
        </div>

        <div className="section mt-5 pt-3">
          {filteredEventData?.length > 0 && (
            <div className="d-flex align-items-center  selectAll">
              <CheckBox
                checked={notifications?.every((item) => item.selected)}
                onChange={handleSelectAllToggle}
              />
              <p className="mb-0 ms-2">
                {filteredEventData?.every((item) => item.selected) ? (
                  <div>
                    <a onClick={(e) => UpdateNotification(e, "", 1)} className="orangeColor allOrangelinks "> Mark as read</a>

                    <a onClick={(e) => UpdateNotification(e, "", 4)} className="orangeColor allOrangelinks ms-3">
                      Mark as unread
                    </a>
                    <a onClick={() => handleDelete("", true)} className="orangeColor allOrangelinks ms-3">
                      Delete Selected Notification
                    </a>
                  </div>
                ) : (
                  "Select all"
                )}
              </p>
            </div>
          )}
          {filteredEventData?.length ?
            filteredEventData?.map((item) => {
              const inputVal = reply.find(entry => entry.itemId === item?._id)
              return <div key={item?._id} className={item?.isRead ? "item2" : "item"}>
                <div onClick={() => handleClickRow(item)} className=" d-flex  justify-content-between" key={item.id}>
                  <div className="d-flex align-items-center">
                    <CheckBox
                      checked={item?.selected}
                      onChange={(e) => handleItemToggle(e, item?._id)}

                    />
                    <div className="ms-3">
                      <p className="my-1 date">{formattedDate(item?.date)}</p>
                      <p className="my-1 text">{item?.title}</p>
                    </div>
                  </div>
                  <div className="pt-3 pe-2">
                    {item.selected && !notifications?.every((item) => item.selected) && (
                      <div>
                        <a onClick={(e) => UpdateNotification(e, item, 6)} className="orangeColor allOrangelinks">Mark as read</a>
                        <a onClick={(e) => UpdateNotification(e, item, 7)} className="orangeColor allOrangelinks ms-3">Mark as unread</a>
                        {/* <a className="orangeColor allOrangelinks ms-3">Delete Notification</a> */}

                      </div>
                    )}
                    <div className="d-flex justify-content-end mt-2">
                      <RiDeleteBin6Line
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(item);
                        }}
                        className=" mt-lg-0 mt-3 point "
                      />
                    </div>


                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <div>{console.log(item?.details?.index)}</div>
                  {JSON.parse(item.details.index) === 5 && item.isReply === false && (
                    <div>
                      {!showReply[item._id] && (
                        <button className="rplyBtn mx-2" onClick={() => handleToggleReply(item._id)}>Reply</button>
                      )}
                    </div>
                  )}
                  {showReply[item._id] && (
                    <div>
                      {JSON.parse(item?.details?.index) === 5 && item.isReply === false && (
                        <div className="position-relative mt-3">
                          <input
                            type="text"
                            className="inputFields w-100"
                            placeholder="Reply"
                            style={{ outline: 'none', padding: 10, border: '1px solid #e0e0db' }}
                            value={(reply.find((entry) => entry.itemId === item._id) || {}).text || messageText}
                            onChange={(e) => updateReplyText(item._id, e.target.value)}
                          />
                          {!inputVal?.text ? (
                            <button className="clearButton" onClick={() => handleToggleReply(item._id)}>X</button>
                          ) : (
                            <BsSend
                              onClick={() => UpdateFeedbackData(item, (reply.find((entry) => entry.itemId === item._id) || {}).text)}
                              className="position-absolute end-0 mt-0 w-auto me-3 pointer"
                              style={{ bottom: 13, right: 0 }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>


            }

            )
            :
            <div className='MediaEdit d-flex align-items-center justify-content-center '>
              <h4>No Notification Found</h4>
            </div>

          }
        </div>
      </div>
    </div>
  );
};
