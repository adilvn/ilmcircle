import React, { useState } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { bindActionCreators } from "redux";
import { actionCreaters } from "../../../Store/Index";
import { useDispatch, useSelector } from "react-redux";
import Buttons from "../../../components/reuseable/Button";
import { CurruncyDropDown } from "./CurruncyDropDown";
import upArrow from "../../../asserts/images/upArrow.svg";
import phones from "../../../asserts/images/chatPhone.png";
import mailIcon from "../../../asserts/images/mailIcons.png";
import EditIcon from "../../../asserts/images/orgEditIcon.png";
import deleteIcon from "../../../asserts/images/deleteIcon.png";
import profile from "../../../asserts/images/profile.png";
import menu from "../../../asserts/images/chatDropdown.png";
import chatDropdown from "../../../asserts/images/chatDropdown.png";
import dropdownProfile from "../../../asserts/images/dropdownProfile.png";
import online from "../../../asserts/images/online.png";
import { t } from "i18next";
import defaultProfile from "../../../asserts/images/deafultProfile.svg";

import { BiArrowToTop } from "react-icons/bi";
import { SeleclInput } from "../OrgMyEvents/Reuseable/SeleclInput";
import { Loader } from "../../../components/reuseable/Loader";
import secureLocalStorage from "react-secure-storage";
import API_Routes from "../../../Routes/API_Routes";
import { showMessage } from "../../../components/reuseable/Tostify";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
export const ExistProjects = () => {
  const dispatch = useDispatch();
  const { orgDashboardIndex } = bindActionCreators(actionCreaters, dispatch);
  // const selectedItem = useSelector((state) => state?.selectedIndex);
  const [projectTitle, setProjectTitle] = useState('');
  const [headingTitle, setHeadingTitle] = useState('');

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState({});
  const [start, setStart] = useState("");
  const [deadLine, setDeadLine] = useState("");
  const [startingTime, setStartingTime] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [apiImageURL, setApiImageURL] = useState(null);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');

  const [aboutProject, setAboutProject] = useState('');
  const [dateEdit, setDateEdit] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);



  const [edit, setEdit] = useState(false);
  const [loader, setLoader] = useState(false);
  const token = secureLocalStorage.getItem('token')
  const fileInputRef = useRef(null);

  useEffect(() => {
    GetProjectDetails()
  }, [])
  const navigate = useNavigate()

  const location = useLocation()
  const selectedItem = location?.state
  const GetProjectDetails = () => {
    setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(API_Routes?.ORGPROJECTDETAILS + selectedItem?.item?._id, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status == 200 || result.status == 201) {
          setLoader(false);
          setProjectTitle(result?.data?.title)
          setHeadingTitle(result?.data?.title)
          setAboutProject(result?.data?.about)
          setAmount(result?.data?.totalAmount)
          setEmail(result?.data?.email)
          setPhone(result?.data?.phone)
          setCurrency(result?.data?.currency)
          setStartingTime(result?.data?.deadline)
          setApiImageURL(result?.data?.image?.url)
          const startingDateParts = result?.data?.deadline.split("/");
          setSelectedStartDate({
            year: startingDateParts[2],
            month: startingDateParts[0] - 1,
            day: startingDateParts[1],
          });

          // setProject(result?.data)
        } else {
          setLoader(false);
          showMessage(result?.message, 'error');
        }
      })
      .catch(error => {
        setLoader(false);

        console.log('error', error)
      });
  }

  const handleStartChange = (date) => {
    setStart(date);
  };
  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };


  const handleImageUpload = (event) => {
    const files = event.target.files;

  };
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Preview the selected file immediately
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setApiImageURL(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      // Handle the case when no file is selected
      setApiImageURL(null);
    }
  };

  // Function to open the file upload dialog
  const openFileUploadDialog = () => {
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.click();
    }
  };


  // console.log('as', selectedStartDate)
  const UpdateProject = () => {

    if (selectedStartDate?.day <= 0) {
      return showMessage('Please select the day', 'error')
    }
    if (!selectedStartDate?.month) {
      return showMessage('Please select month', 'error')
    }
    if (!selectedStartDate?.year) {
      return showMessage('Please select year', 'error')
    }

    setLoader(true);

    var myHeaders = new Headers();
    const date = selectedStartDate.month

    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("title", projectTitle);
    formdata.append("about", aboutProject);
    formdata.append("totalAmount", amount);
    formdata.append("currency", currency);
    formdata.append("deadline", `${selectedStartDate?.month + 1}/${selectedStartDate?.day}/${selectedStartDate?.year}`);
    formdata.append("phone", phone);
    formdata.append("email", email);
    formdata.append("image", selectedFile);
    formdata.append("id", selectedItem?.item?._id,);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(API_Routes.UPDATEPROJECT, requestOptions)
      .then(response => response.json())
      .then(result => {
        setEdit(!edit)
        if (result.status == 200 || result.status == 201) {
          setLoader(false);
          GetProjectDetails()
          showMessage(result?.message);

        } else {
          setLoader(false);
          showMessage(result?.message, 'error');
        }
      })
      .catch(error => {
        setLoader(false);

        console.log('error', error)
      });
  }

  const DeleteProject = () => {
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

    fetch(API_Routes.DELETEPROJECT, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status == 200 || result.status == 201) {
          setLoader(false);
          navigate(`/organization-dashboard/${6}`)

          showMessage(result?.message);

        } else {
          setLoader(false);
          showMessage(result?.message, 'error');
        }
      })
      .catch(error => {
        setLoader(false);

        console.log('error', error)
      });
  }

  // Render the selected file or API image if available
  const renderSelectedFile = () => {
    if (selectedFile) {
      const fileName = selectedFile.name;
      const fileExtension = fileName.split('.').pop().toUpperCase();
      const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
      return (
        <>
          <img
            style={{
              borderRadius: "8px",
              width: "40px",
              height: "40px",
            }}
            src={URL.createObjectURL(selectedFile)}
            alt="Selected File"
          />
          <div className="fw-bold">
            {fileNameWithoutExtension} <br />
            {fileExtension} File
          </div>
        </>
      );
    } else if (apiImageURL) {
      const imageUrlParts = apiImageURL.split('/');
      const imageUrlName = imageUrlParts[imageUrlParts.length - 1];
      const fileName = imageUrlName.split('?')[0]; // Remove any query parameters from the URL
      const fileExtension = fileName.split('.').pop().toUpperCase();
      const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');

      return (
        <>
          <img
            style={{
              borderRadius: "8px",
              width: "40px",
              height: "40px",
            }}
            src={apiImageURL}
            alt="API Image"
          />
          <div className="fw-bold">
            {fileNameWithoutExtension} <br />
            {fileExtension} File
          </div>
        </>
      );
    } else {
      return (
        <img
          style={{
            borderRadius: "8px",
            width: "40px",
            height: "40px",
          }}
          src={defaultProfile}
          alt="Default Profile"
        />
      );
    }
  };




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
        onClick={(e) => DeleteProject(e)}
      />
    </React.Fragment>
  );

  return (
    <div
      style={{
        paddingLeft: 100,
        paddingRight: 50,
        paddingTop: 10,
        background: "none",
        boxShadow: "none",
      }}
      className="VolanteerMain"
    >
      {loader && <div className="loaderScreen">
        <Loader />
      </div>}
      <div className="container-fluid  ">
        <div
          className="goalTask"
          style={{ backgroundColor: "transparent", border: "none" }}
        >
          <div className="goalTaskHeader ">
            <div className="steps mt-2">
              <a
                onClick={() => {
                  navigate(`/organization-dashboard/${6}`)

                }}
                className=" vacancy-breadcrum"
              >
                All Projects
              </a>
              <AiOutlineRight
                className="mx-2 mb-1"
                fontSize={"15px"}
                fontWeight={"700"}
              />
              <a className="vacancy-breadcrum">Project details</a>
            </div>
            <div className="d-sm-flex justify-content-between align-items-center mt-4 me-lg-5 pe-lg-5">
              <h5 className="">{headingTitle}</h5>
              <div className="">
                {!edit && (
                  <img
                    src={EditIcon}
                    alt=""
                    onClick={() => setEdit(!edit)}
                    className="me-5 pointer"
                    style={{ width: "34.375px", height: "34.375px" }}
                  />
                )}
                <img
                  src={deleteIcon}
                  alt="deleteIcon"
                  onClick={() => confirmDeleteSelected()}
                  className="pointer"
                  style={{ width: "34.375px", height: "34.375px" }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <div className="outer-border-vacancy">
              <div className="mt-4 new-vacancy">
                <div className="create-vc-spacing">
                  <p className="textheading mb-1">Title (required)</p>
                  <div className="inputFields w-100 allEditInput">
                    <input
                      type="text"
                      placeholder="Input text"
                      value={projectTitle}
                      disabled={!edit}
                      onChange={(e) => setProjectTitle(e.target.value)}
                    />
                  </div>
                </div>
                <p className="textheading mb-1 mt-24px ">Cover picture</p>
                <div className="inputFields w-100 d-md-flex justify-content-between align-items-center">
                  <div className="d-flex gap-4">
                    {/* <img
                      src={profile}
                      alt=""
                      style={{
                        borderRadius: "8px",
                        width: "40px",
                        height: "40px",
                      }}
                    /> */}
                    {renderSelectedFile()}
                    {/* <div className="fw-bold">
                      Fund raising picture <br />
                      JPG File
                    </div> */}
                  </div>
                  {/* <img src={menu} alt="" style={{ height: "24px" }} /> */}
                  <div
                    onClick={handleDropdownToggle}
                    className="p-2 bd-highlight"
                  >{edit &&
                    <div className="position-relative dropdown">
                      <img
                        className="chatDropdown dropdown-toggle"
                        src={menu}
                        alt=""
                        style={{ height: "24px" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      />
                      <ul style={{ width: 180 }} className="dropdown-menu  dropdown-menu-end">
                        <li className="pointer">
                          <div className=" py-1 text-sm text-gray-700">
                            <div className="profileName text-start">Upload Cover Image</div>
                            <div className="myEventsFileInput mt-3 text-center">
                              <label htmlFor="file-input" className="file-input-label">
                                <input
                                  type="file"
                                  id="file-input"
                                  accept=".png, .jpg, .jpeg .svg"
                                  className="file-input"
                                  onChange={handleFileSelect}
                                />
                                Upload
                              </label>
                            </div>

                          </div>
                        </li>
                      </ul>
                    </div>


                    }


                  </div>
                </div>



                <div className="create-vc-spacing">
                  <p className="textheading mb-1 mt-24px">About the project</p>
                  <textarea
                    className="inputFields w-100 allEditInput projectDetailsInput"
                    placeholder="Input text"
                    value={aboutProject}
                    disabled={!edit}
                    onChange={(e) => setAboutProject(e.target.value)}
                  />
                </div>

                <div className="row mt-24px">
                  <div className="col-md-7 create-vc-spacing">
                    <p className="textheading mb-1 ">Total amount</p>

                    <div className="inputFields w-100 allEditInput">
                      <input
                        type="text"
                        value={amount}
                        disabled={!edit}
                        placeholder="Input text"
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>

                  </div>
                  <div className="col-md-5 create-vc-spacing">
                    <p className="textheading mb-1 ">Currency</p>
                    {!edit ? (
                      <div
                        className="inputFields w-100 allEditInput"
                        contentEditable={edit}
                      >
                        {currency}
                      </div>
                    ) : (
                      <CurruncyDropDown currency={currency} setCurrency={setCurrency} />
                    )}
                  </div>
                </div>
                <div className="col-md-12  createEventOrganizationModal mt-24px">
                  <p className="textheading mb-1">Deadline</p>
                  <SeleclInput
                    // name="noData"
                    onChange={handleStartChange}
                    status={1}
                    dateEdit={edit}
                    defaultValue={{
                      year: selectedStartDate.year,
                      month: selectedStartDate.month,
                      day: selectedStartDate.day,
                    }}
                    selectedStartDate={selectedStartDate}
                    setSelectedStartDate={setSelectedStartDate}
                  />
                </div>

                <div className="create-vc-spacing">
                  <p className="textheading mb-1 mt-24px">
                    Contact information
                  </p>

                  <div
                    className="inputFields w-100 allEditInput"
                  // contentEditable={edit}
                  >
                    If you have any question, please contact us!
                  </div>
                </div>
                <div className="contactPhoneBox d-flex align-items-center inputFields mt-3">
                  <img src={phones} alt="" width={"15px"} className="me-2" />
                  <input
                    type="number"
                    className="w-100"
                    value={phone}
                    disabled={!edit}
                    placeholder="Input text"

                    onChange={(e) => setPhone(e.target.value)}

                  />
                </div>

                <div className="contactPhoneBox d-flex align-items-center inputFields mt-3">
                  <img src={mailIcon} alt="" width={"20px"} className="me-2" />
                  <input
                    type="email"
                    className="w-100"
                    value={email}
                    disabled={!edit}
                    placeholder="Input text"
                    onChange={(e) => setEmail(e.target.value)}

                  />
                </div>

              </div>
              {edit && (
                <>
                  <div className="text-center">
                    <Buttons
                      data="Save changes"
                      class="newv-btn mt-5 "
                      onClick={() => {
                        UpdateProject()
                      }


                      }
                    />
                  </div>
                  <div className="text-center mt-2 orange point">
                    <p
                      className="cancelBtn CancelButtonVacancy"
                      onClick={() => setEdit(!edit)}
                    >
                      Cancel
                    </p>
                  </div>
                </>
              )}
            </div>

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
                    <span>Are you sure you want to delete this project?</span>
                  </div>
                  {/* // )} */}
                </div>
              </Dialog>

            }
          </div>
        </div>
      </div>
    </div >
  );
};



