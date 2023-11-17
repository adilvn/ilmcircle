import React, { useEffect, useRef, useState } from "react";
// import DashboardNavbar from "../../Dashboard/DashboardCmp/DashboardNavbar";
import GoalsTasks from "./Goals/GoalsTasks";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./Goals/GoalTask.css";
import { BsChevronDown, BsSearch, BsSortDown } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import img from "../../asserts/images/download.svg";
import { sortArrayTask } from "../../OrganizationDashboard/OrgSidebarContent/OrgMyEvents/filterArray";
import eventFilterIcon from "../../asserts/images/eventFilterIcon.svg";
import secureLocalStorage from "react-secure-storage";
import API_Routes from "../../Routes/API_Routes";
import { showMessage } from "../../components/reuseable/Tostify";
import { Loader } from "../../components/reuseable/Loader";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const GoalTask = () => {
  let emptyProduct = {
    id: null,
    status: null,
    dueDate: "",
    priority: "",
    members: "",
    description: "",
    comment: "",
  };
  const [show, setShow] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const [done, setDone] = useState([]);
  const [inProgress, setInprogress] = useState([]);
  const [notStarted, setNotStarted] = useState([]);
  const [value, setValue] = useState(false);
  const [taskStatus, setTaskStatus] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [TaskMember, setTaskMember] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskComment, setTaskComment] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteProductID, setDeleteProductID] = useState("");
  const [taskData, setTaskData] = useState([]);

  const [hideModal, setHideModal] = useState(false);
  const [product, setProduct] = useState({});
  const [loader, setLoader] = useState(false);
  const [allSelectedItem, setAllSelectedItem] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [markTxt, setMarkTxt] = useState("");
  const [markIds, setMarkIds] = useState([]);
  const [selectedArrayTasks, setSelectedArrayTasks] = useState([]);

  const token = secureLocalStorage.getItem("token");
  const [filterTask, setFiltertask] = useState(null);

  const childRef = useRef();
  const selectedItem = useSelector((state) => state?.studentIndex);


  const location = useLocation()
  // console.log('locationData', location?.state?.item)
  const paramDate = location?.state?.item
  const handleFilter = (item, index) => {
    setIsOpen2(!isOpen2);
    setFiltertask(index);
  };

  const handleDelete = (item) => {
    // console.log('itemasasas', item)
    if (!allSelectedItem?.length) {
      showMessage("Please select Items to delete", "warning");
    } else {
      setOpenDelete(true);
    }
  };
  const ref = useRef(null);
  useEffect(() => {
    // console.log(token)
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
    GetTaskList();
  }, []);

  const GetTaskList = () => {
    setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(API_Routes.GETALLGOALTASK, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200 || result.status == 201) {
          setTaskData(result);
          setOpenDelete(false);

          const data = result?.data?.filter((item) => {
            if (item.status == "Done") {
              return item;
            }
          });

          setDone(data);

          const data2 = result?.data?.filter((item) => {
            return item.status == "In progress";
          });

          setInprogress(data2);

          const data3 = result?.data?.filter((item) => {
            if (item.status == "Not started") {
              return item;
            }
          });

          setNotStarted(data3);
          // setValue(true);
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
  };
  function changeDateFormat(inputDate) {
    return inputDate?.split("-").join("/");
  }
  const sendCreateTaskData = () => {
    // console.log('product?.Name', product?.Name)
    setLoader(true);

    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + token);

    const formattedDate = changeDateFormat(product?.dueDate);
    const membersData = product?.member?.map((item) => {
      return item?.member?.id;
    });
    // console.log('product?.memberCreate', membersData);

    var formdata = new FormData();
    if (product) {
      product?.status && formdata.append("status", product?.status);
      product?.category && formdata.append("category", product?.category);
      product?.dueDate && formdata.append("dueDate", formattedDate);
      product?.priority && formdata.append("priority", product?.priority);
      // product?.member.length &&
      membersData?.forEach((e) => {
        formdata.append("members", e);
      });
      product?.description &&
        formdata.append("description", product?.description);
      product?.comment && formdata.append("comment", product?.comment);
    }
    product?.name && formdata.append("name", product?.name);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      "https://ilmcircle.com/backend/api/student/task/create",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200 || result.status == 201) {
          setHideModal(true);
          GetTaskList();

          setLoader(false);
          showMessage(result?.message);
          setProduct({});
        } else {
          setLoader(false);
          showMessage(result?.message, "error");
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("error", error);
      });
  };
  function updateSelectedIds(selectedIds, newId) {
    if (selectedIds?.length) {
      if (newId !== undefined && !selectedIds.includes(newId)) {
        selectedIds.push(newId);
      }
      return selectedIds;
    } else {
      return;
    }
  }

  // console.log('update:::', product)
  const sendUpdatedTaskData = (selectedIds, txt) => {
    let selectedIdsdata = updateSelectedIds(selectedIds, product._id);
    const inputDate = taskDueDate;
    const formattedDate = changeDateFormat(product?.dueDate);
    const membersData = product?.member?.map((item) => {
      return item?.member?.id;
    });
    // console.log('update:::', product)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    // myHeaders.append("Content-Type", "application/json");
    var formdata = new FormData();
    if (selectedIdsdata?.length) {
      selectedIdsdata?.forEach((i) => formdata.append("id[]", i));
    } else {
      formdata.append("id[]", product?._id);
    }

    // product?.status && formdata.append("status", product?.status);
    txt
      ? formdata.append("status", txt)
      : product?.status && formdata.append("status", product?.status);

    product?.category && formdata.append("category", product?.category);
    formattedDate && formdata.append("dueDate", formattedDate);
    product?.priority && formdata.append("priority", product?.priority);
    // product?.member.length &&
    // formdata.append("members", membersData);
    membersData?.forEach((e) => {
      formdata.append("members", e);
    });
    product?.description &&
      formdata.append("description", product?.description);
    product?.comment && formdata.append("comment", product?.comment);
    product?.name && formdata.append("name", product?.name);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(API_Routes.UPDATEDGOALSTASK, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200 || result.status == 201) {
          // console.log('Updated successfully--->', result)
          setHideModal(true);
          GetTaskList();
          // childRef.current
          // setHideModal(true)
          setLoader(false);
          showMessage(result?.message);
          setSelectedArrayTasks([]);
          selectedIdsdata = [];
          selectedIds = [];
          setProduct({});
        } else {
          setLoader(false);
          showMessage(result?.message, "error");
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("error", error);
      });
  };

  const DeletedProducts = (proId) => {
    // console.log('proId', proId)
    const ids = allSelectedItem?.map((item) => {
      return item?._id;
    });
    // console.log('ids===>', ids)

    setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();

    ids?.forEach((e) => {
      // console.log('e===>', e)
      formdata.append("id", e);
    });

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(API_Routes.DELETEGOALSTASK, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log('DELETEAPICALLED')

        if (result.status == 200 || result.status == 201) {
          showMessage(result?.message);
          GetTaskList();
          setLoader(false);
          setTaskComment(false)
        } else {
          setLoader(false);
          showMessage(result?.message, "error");
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("error", error);
      });
  };

  useEffect(() => {
    // console.log('item', taskData)

    const data = taskData?.data?.filter(
      (item) =>
        item?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item?.category.toLowerCase().includes(search.toLowerCase()) ||
        item?.priority.toLowerCase().includes(search.toLowerCase()) ||
        item?.status.toLowerCase().includes(search.toLowerCase()) ||
        item?.dueDate.toLowerCase().includes(search.toLowerCase()) ||
        item?.description.toLowerCase().includes(search.toLowerCase())
    );
    const dataF = data?.filter((item) => {
      if (item.status == "Done") {
        return item;
      }
    });
    setDone(dataF);

    const data2 = data?.filter((item) => {
      return item.status == "In progress";
    });
    // console.log("data2:==>", data2);

    setInprogress(data2);

    const data3 = data?.filter((item) => {
      if (item.status == "Not started") {
        return item;
      }
    });

    setNotStarted(data3);
  }, [search]);
  return (
    <div className=" py-4 AllMainSection">
      {loader && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}

      <div className="container-fluid pb-5">
        <div className="goalTask">
          <div className="row goalTaskHeader ">
            <h5 className="col-md-6">My Goals and Tasks</h5>

            <div
              style={{ gap: 8, height: "51px" }}
              className="navSide  col-md-6 d-flex justify-content-end"
            >
              <div className=" position-relative mt-1" ref={ref}>
                <input
                  type="text"
                  className={`${show
                    ? "searchFilterInputOpen me-0"
                    : "searchFilterInput me-0"
                    } searchFilterInput`}
                  placeholder={show ? "Search" : ""}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <span className="">
                  <BsSearch
                    className={show ? `searchSvg2` : "searchSvg point"}
                    onClick={() => setShow(!show)}
                    fontSize={" 22px"}
                  />
                </span>
              </div>

              <div className="mt-1 position-relative mt-1">
                <span className="goalSectionIcons">
                  <BsSortDown
                    className="point"
                    onClick={() => {
                      setIsOpen2(!isOpen2);
                    }}
                    fontSize={" 24px"}
                  />
                </span>
                {isOpen2 && (
                  <div
                    className="categroyDropDown z-3  mt-2 position-absolute end-0 right-position drop-down-width"
                    style={{ backgroundColor: "#fcfcfc" }}
                  >
                    {sortArrayTask?.map((item, index) => (
                      <div
                        key={index}
                        className="categoryGoal my-2 point px-3"
                        style={{ fontFamily: "Open Sans" }}
                        onClick={() => {
                          handleFilter(item, index);
                        }}
                      >
                        {index == 3 ? (
                          <div onClick={() => handleDelete(item)}>{item}</div>
                        ) : (
                          item
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {console.log("value", value)}
          {
            // taskData.length ?

            (filterTask == 0 ? (
              <GoalsTasks
                // setTaskStatus={setTaskStatus}
                // setTaskCategor={setTaskCategory}
                // setTaskDueDate={setTaskDueDate}
                // setPriority={setPriority}
                // setTaskMember={setTaskMember}
                // setTaskDescription={setTaskDescription}
                setTaskComment={setTaskComment}
                sendCreateTaskData={sendCreateTaskData}
                sendUpdatedTaskData={sendUpdatedTaskData}
                setDeleteProductID={setDeleteProductID}
                deleteProductID={deleteProductID}
                DeletedProducts={DeletedProducts}
                openDelete={openDelete}
                setOpenDelete={setOpenDelete}
                setAllSelectedItem={setAllSelectedItem}
                setMarkIds={setMarkIds}
                setMarkTxt={setMarkTxt}
                // selectedItem={selectedItem?.item}
                // taskStatus={taskStatus}
                // taskCategory={taskCategory}
                // taskDueDate={taskDueDate}
                // priority={priority}
                // TaskMember={TaskMember}
                // taskDescription={taskDescription}
                taskComment={taskComment}
                setProduct={setProduct}
                product={product}
                hideModal={hideModal}
                setHideModal={setHideModal}
                item={done}
                filterName="Done"
              />
            ) : filterTask == 1 ? (
              <GoalsTasks
                // setTaskStatus={setTaskStatus}
                // setTaskCategor={setTaskCategory}
                // setTaskDueDate={setTaskDueDate}
                // setPriority={setPriority}
                // setTaskMember={setTaskMember}
                // setTaskDescription={setTaskDescription}
                setTaskComment={setTaskComment}
                setDeleteProductID={setDeleteProductID}
                DeletedProducts={DeletedProducts}
                sendCreateTaskData={sendCreateTaskData}
                sendUpdatedTaskData={sendUpdatedTaskData}
                setHideModal={setHideModal}
                setProduct={setProduct}
                product={product}
                openDelete={openDelete}
                setOpenDelete={setOpenDelete}
                setAllSelectedItem={setAllSelectedItem}
                setMarkIds={setMarkIds}
                setMarkTxt={setMarkTxt}
                setSelectedArrayTasks={setSelectedArrayTasks}
                // selectedItem={selectedItem?.item}
                // taskStatus={taskStatus}
                // taskCategory={taskCategory}
                // taskDueDate={taskDueDate}
                // priority={priority}
                // TaskMember={TaskMember}
                // taskDescription={taskDescription}
                taskComment={taskComment}
                hideModal={hideModal}
                item={inProgress}
                filterName="In Progress"
              />
            ) : filterTask == 2 ? (
              <GoalsTasks
                // setTaskStatus={setTaskStatus}
                // setTaskCategor={setTaskCategory}
                // setTaskDueDate={setTaskDueDate}
                // setPriority={setPriority}
                // setTaskMember={setTaskMember}
                // setTaskDescription={setTaskDescription}
                setTaskComment={setTaskComment}
                sendCreateTaskData={sendCreateTaskData}
                sendUpdatedTaskData={sendUpdatedTaskData}
                setHideModal={setHideModal}
                setProduct={setProduct}
                product={product}
                setDeleteProductID={setDeleteProductID}
                DeletedProducts={DeletedProducts}
                setAllSelectedItem={setAllSelectedItem}
                openDelete={openDelete}
                setOpenDelete={setOpenDelete}
                setMarkIds={setMarkIds}
                setMarkTxt={setMarkTxt}
                setSelectedArrayTasks={setSelectedArrayTasks}
                // selectedItem={selectedItem?.item}
                // taskStatus={taskStatus}
                // taskCategory={taskCategory}
                // taskDueDate={taskDueDate}
                // priority={priority}
                // TaskMember={TaskMember}
                // taskDescription={taskDescription}
                taskComment={taskComment}
                hideModal={hideModal}
                item={notStarted}
                filterName="Not Started"
              />
            ) : (
              <div>
                <GoalsTasks
                  // setTaskStatus={setTaskStatus}
                  // setTaskCategor={setTaskCategory}
                  // setTaskDueDate={setTaskDueDate}
                  // setPriority={setPriority}
                  // setTaskMember={setTaskMember}
                  // setTaskDescription={setTaskDescription}
                  setTaskComment={setTaskComment}
                  sendCreateTaskData={sendCreateTaskData}
                  sendUpdatedTaskData={sendUpdatedTaskData}
                  setDeleteProductID={setDeleteProductID}
                  deleteProductID={deleteProductID}
                  DeletedProducts={DeletedProducts}
                  setAllSelectedItem={setAllSelectedItem}
                  openDelete={openDelete}
                  setOpenDelete={setOpenDelete}
                  setMarkIds={setMarkIds}
                  setMarkTxt={setMarkTxt}
                  setSelectedArrayTasks={setSelectedArrayTasks}
                  selectedItem={paramDate}
                  // taskStatus={taskStatus}
                  // taskCategory={taskCategory}
                  // taskDueDate={taskDueDate}
                  // priority={priority}
                  // TaskMember={TaskMember}
                  // taskDescription={taskDescription}
                  taskComment={taskComment}
                  setProduct={setProduct}
                  product={product}
                  hideModal={hideModal}
                  setHideModal={setHideModal}
                  item={done}
                  filterName="Done"
                />
                <GoalsTasks
                  // setTaskStatus={setTaskStatus}
                  // setTaskCategor={setTaskCategory}
                  // setTaskDueDate={setTaskDueDate}
                  // setPriority={setPriority}
                  // setTaskMember={setTaskMember}
                  // setTaskDescription={setTaskDescription}
                  setTaskComment={setTaskComment}
                  setDeleteProductID={setDeleteProductID}
                  DeletedProducts={DeletedProducts}
                  sendCreateTaskData={sendCreateTaskData}
                  sendUpdatedTaskData={sendUpdatedTaskData}
                  setHideModal={setHideModal}
                  setAllSelectedItem={setAllSelectedItem}
                  openDelete={openDelete}
                  setOpenDelete={setOpenDelete}
                  // selectedItem={selectedItem?.item}
                  setProduct={setProduct}
                  product={product}
                  setMarkIds={setMarkIds}
                  setMarkTxt={setMarkTxt}
                  setSelectedArrayTasks={setSelectedArrayTasks}
                  // taskStatus={taskStatus}
                  // taskCategory={taskCategory}
                  // taskDueDate={taskDueDate}
                  // priority={priority}
                  // TaskMember={TaskMember}
                  // taskDescription={taskDescription}
                  taskComment={taskComment}
                  hideModal={hideModal}
                  item={inProgress}
                  filterName="In Progress"
                />
                <GoalsTasks
                  // setTaskStatus={setTaskStatus}
                  // setTaskCategor={setTaskCategory}
                  // setTaskDueDate={setTaskDueDate}
                  // setPriority={setPriority}
                  // setTaskMember={setTaskMember}
                  // setTaskDescription={setTaskDescription}
                  setTaskComment={setTaskComment}
                  sendCreateTaskData={sendCreateTaskData}
                  sendUpdatedTaskData={sendUpdatedTaskData}
                  setHideModal={setHideModal}
                  setProduct={setProduct}
                  product={product}
                  setDeleteProductID={setDeleteProductID}
                  DeletedProducts={DeletedProducts}
                  openDelete={openDelete}
                  // selectedItem={selectedItem?.item}
                  setOpenDelete={setOpenDelete}
                  setAllSelectedItem={setAllSelectedItem}
                  setMarkIds={setMarkIds}
                  setMarkTxt={setMarkTxt}
                  setSelectedArrayTasks={setSelectedArrayTasks}
                  // taskStatus={taskStatus}
                  // taskCategory={taskCategory}
                  // taskDueDate={taskDueDate}
                  // priority={priority}
                  // TaskMember={TaskMember}
                  // taskDescription={taskDescription}
                  taskComment={taskComment}
                  hideModal={hideModal}
                  item={notStarted}
                  filterName="Not Started"
                />
              </div>
            ))

            // :

            // <div className="NoEventsTxt text-center">
            //   No Task Found
            // </div>
          }
        </div>
      </div>
    </div>
  );
};

export default GoalTask;
