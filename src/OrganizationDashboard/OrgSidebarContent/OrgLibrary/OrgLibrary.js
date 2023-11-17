import React, { useEffect, useRef, useState } from "react";
import { BsSearch, BsSortDown } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import { BiPlusCircle } from "react-icons/bi";
import Button from "../../../components/reuseable/Button";
import img from "../../../asserts/images/download.svg";
// import home from "../../../asserts/images/home.png";
import home from "../../../asserts/images/home2.svg";
import defaultProfile from "../../../asserts/images/deafultProfile.svg";
import pako from 'pako';
import axios from "axios";
import "./library.css";
import OrgAudio from "./OrgAudio";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { actionCreaters } from "../../../Store/Index";
import { bindActionCreators } from "redux";
import { sortArrayLibrary, sortArrayLibrary2, sortArrayLibrary3 } from "../OrgMyEvents/filterArray";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import secureLocalStorage from "react-secure-storage";
import API_Routes from "../../../Routes/API_Routes";
import { showMessage } from "../../../components/reuseable/Tostify";
import { Loader } from "../../../components/reuseable/Loader";
import InputField from "../../../components/reuseable/InputField";
import { useMemo } from "react";


// Changing is done in this compoonent    <<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Changing is done in this component multiple changes
export const OrgLibrary = () => {

  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [apiImageURL, setApiImageURL] = useState(null);
  const [filename, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const [speaker, setSpeaker] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [userInput, setUserInput] = useState("")
  const [filteredEvents, setFilteredEvents] = useState([])
  const [filterOnSize, setFilterOnSize] = useState("")
  const [filterOnSize2, setFilterOnSize2] = useState("")


  const ref = useRef(null);
  useEffect(() => {
    // setDeleteProductsDialog(false); 
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
  const handleModal = () => {
    setShowModal(!showModal);
  };
  const handleInputChange = (e) => {
    const input = e.target.value;
    setUserInput(input);
    setFilterOnSize("")
    // const filtered = filterEvents(input);
    // setFilteredEvents(filtered);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const token = secureLocalStorage.getItem("token");
  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFileName(file?.name)
    setApiImageURL(null);
    setIsOpen1(false)
    setIsOpen2(false)
  };
  const handleFilterOnSize = (index) => {
    setUserInput("")
    setFilterOnSize2("")
    const input = index

    setFilterOnSize(input)
    setIsOpen2(!isOpen2)
    setIsOpen1(false)

  }
  const handleFilterOnSize2 = (index) => {
    setUserInput("")
    setFilterOnSize("")
    const input = index
    setFilterOnSize2(input)
    setIsOpen1(!isOpen1)
    setIsOpen2(false)

  }


  const openFileUploadDialog = () => {
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.click();
    }
  };

  const renderSelectedFile = () => {
    if (apiImageURL) {
      return (
        <img
          style={{ width: 50, height: 50, }}
          src={apiImageURL}
          alt="API Image"
        />
      );
    } else if (selectedFile) {
      return (
        <img
          style={{ width: 50, height: 50, }}
          src={URL.createObjectURL(selectedFile)}
          alt="Selected File"
        />
      );
    }
    // return (
    //   <img
    //     style={{ width: 150, height: 150, borderRadius: 150 }}
    //     src={defaultProfile}
    //     alt="Default Profile"
    //   />
    // );
  };

  const deleteImage = () => {
    setSelectedFile(null)
  };

  const openModal = () => {
    setDeleteProductsDialog(true);
  };


  const sendFileData = async (e) => {
    e.preventDefault();
    setLoader(true);
    setUploadProgress(0);
    if (!description.trim()) {

      setLoader(false);
      showMessage('Description  field is required.', 'error');
      return;
    } if (!speaker.trim()) {
      setLoader(false);
      showMessage('Speaker field is required.', 'error');
      return
    }
    if (!selectedFile) {
      setLoader(false);
      showMessage('Please select a file. ', 'error');
      return
    }

    try {
      setUploadInProgress(true);
      const myHeaders = {
        Authorization: `Bearer ${token}`,
      };

      const formData = new FormData();
      formData.append('description', description);
      formData.append('speaker', speaker);

      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const response = await axios.post(API_Routes.SENDLIBDATA, formData, {
        headers: {
          ...myHeaders,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {

          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      if (response.status === 200 || response.status === 201) {
        setUploadInProgress(false);
        setDeleteProductsDialog(false);
        GetFIleData();
        setLoader(false);
        showMessage(response?.data?.message);
        setDescription('');
        setSelectedFile(null);
        setFileName('');
        setUploadProgress(0)
        setDeleteProductsDialog(true)
        setSpeaker("")
        setDeleteProductsDialog(false)
      } else {
        setLoader(false);
        showMessage(response?.data?.message, 'error');
        setDeleteProductsDialog(true)
        setUploadInProgress(false);
      }
    } catch (error) {
      setLoader(false);
      console.log('error', error);
      setDeleteProductsDialog(true)
      setUploadInProgress(false);
    }
  };




  const GetFIleData = () => {
    setDeleteProductsDialog(false);
    setLoader(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(API_Routes.GETLIBDATA, requestOptions)
      .then(response => response.json())
      .then(result => {


        if (result.status == 200 || result.status == 201) {
          const reversedData = result?.data?.slice().reverse();
          setData(reversedData);


          setLoader(false)

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
  useEffect(() => {
    if (uploadInProgress) {
      setDeleteProductsDialog(true);
    } else {
      setDeleteProductsDialog(false);

    }
  }, [uploadInProgress]);

  const handleCloseBox = () => {
    setDeleteProductsDialog(false);

  }
  const filterEvents = () => {
    let dataToFilter = data
    let dataFilter = data
    if (userInput === "" && (filterOnSize === "1" || filterOnSize === "" || filterOnSize === 1) && (filterOnSize2 === 1 || filterOnSize2 === "1" || filterOnSize2 == "")) {
      return data;
    }

    if (filterOnSize == "2" || filterOnSize === 2) {
      // console.log("filterOnSize",filterOnSize)
      dataToFilter = data?.slice()?.sort((a, b) => a.file.size - b.file.size);

    }
    if (filterOnSize === "3" || filterOnSize === 3) {

      dataToFilter = data?.slice()?.sort((a, b) => b.file.size - a.file.size);

    }

    if (filterOnSize === "4" || filterOnSize === 4) {
      dataToFilter = data?.slice()?.sort((a, b) => new Date(a.date) - new Date(b.date));


    }
    if (filterOnSize === "5" || filterOnSize === 5) {
      dataToFilter = data?.slice()?.sort((a, b) => new Date(b.date) - new Date(a.date));
    }


    if (filterOnSize === 6 || filterOnSize === "6") {
      dataToFilter = dataFilter;

    }



    if (filterOnSize2 === "2" || filterOnSize2 === 2) {
      dataToFilter = dataToFilter.sort((item1, item2) => {
        return item1?.file?.name.localeCompare(item2?.file?.name, undefined, { sensitivity: 'base' });
      });

    }

    if (filterOnSize2 === "3" || filterOnSize2 === 3) {
      dataToFilter = dataToFilter.sort((item1, item2) => {
        return item2?.file?.name.localeCompare(item1?.file?.name, undefined, { sensitivity: 'base' });
      });
    }

    if (userInput !== "") {

      dataToFilter = data?.filter((item) => {
        return (
          item?.description?.toLowerCase()?.includes(userInput?.toLowerCase()) ||
          item?.file?.name?.toLowerCase()?.includes(userInput?.toLowerCase())
        );
      });
    }
    setFilteredEvents(dataToFilter);
    return dataToFilter


  }


  const MemoizedFilterEvents = useMemo(filterEvents, [userInput, filterOnSize, filterOnSize2]);
  useEffect(() => {
    const filtered = MemoizedFilterEvents


    setFilteredEvents(filtered);
  }, [userInput, filterOnSize, filterOnSize2]);

  useEffect(() => {
    GetFIleData();

    const filtered = filterEvents();
    setFilteredEvents(filtered);
  }, [])



  return (
    <div
      // style={{ paddingLeft: 100, paddingRight: 100 }}
      className="eventOrganization screenPadding"
    >
      {loader && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      {/* <DashboardNavbar /> */}
      <div className="container-fluid ">
        <div
          className="goalTask"
          style={{ backgroundColor: "transparent", border: "none" }}
        >
          <div className="goalTaskHeader ">
            <div className="row ">
              <div className="col-lg-6 d-flex justify-content-sm-start justify-content-between align-items-center">
                <h5 className="">Library</h5>
                <Button
                  type="file"
                  data="Upload File"
                  icon={<BiPlusCircle className="me-2 mb-1" />}
                  class="profile-btn2 ms-3  "
                  onClick={openModal}
                />
              </div>
              {data.length ?
                <div
                  style={{ gap: 12 }}
                  className="navSide  col-lg-6 d-flex justify-content-end pe-4"
                >
                  <div className="position-relative" ref={ref} style={{ height: "45px" }}>
                    <input
                      type="text"
                      className={`${show ? "searchFilterInputOpen me-0" : "searchFilterInput me-0"
                        } searchFilterInput`}
                      placeholder={show ? "Search" : ""}
                      value={userInput}
                      onChange={handleInputChange}
                    />
                    <span className="">
                      <BsSearch
                        className={show ? `searchSvg2` : "searchSvg point"}
                        onClick={() => {
                          setShow(!show);
                          setIsOpen1(false);
                          setIsOpen2(false);
                        }}
                        fontSize={" 22px"}
                      />
                    </span>
                  </div>
                  <div className="mt-1 position-relative">
                    <span className="homeIconlib">

                      <img
                        style={{ width: 30, height: 30 }}
                        src={home}
                        alt="home"
                        onClick={() => {
                          setIsOpen1(!isOpen1);
                          setIsOpen2(false);
                        }}
                      />

                      {isOpen1 && (
                        <div
                          className="categroyDropDown z-3  mt-2 position-absolute end-0 width-dropDown"

                        >
                          {sortArrayLibrary3.map((item, index) => (
                            <div key={index}
                              className="categoryGoal my-2 point px-3"
                              style={{ fontFamily: "Open Sans" }}
                              onClick={() => handleFilterOnSize2(item.id)}

                            ><div>{item.name}<b>{item.details}</b></div>

                            </div>
                          ))}
                        </div>
                      )}
                    </span>

                  </div>


                  <div className="mt-1 position-relative mt-1">
                    <span className="goalSectionIcons mt-1">
                      <BsSortDown
                        className="  point"
                        onClick={() => {
                          setIsOpen2(!isOpen2);
                          setIsOpen1(false);
                        }}
                        fontSize={" 26px"}
                      />
                    </span>
                    {isOpen2 && (
                      <div
                        className="categroyDropDown z-3  mt-2 position-absolute end-0 width-dropDown"

                      >
                        {sortArrayLibrary2.map((item, index) => (
                          <div key={index}
                            className="categoryGoal my-2 point px-3"
                            style={{ fontFamily: "Open Sans" }}
                            onClick={() => handleFilterOnSize(item.id)}

                          ><div>{item.name}<b>{item.details}</b></div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="goalSectionIcons">
                    <img style={{ width: 25, height: 25 }} src={img} alt="" />
                  </span>
                </div>
                : ""
              }
            </div>
            {data.length ? <OrgAudio data={userInput || filterOnSize ? filteredEvents : data} /> :
              <div className='MediaEdit mt-5 d-flex align-items-center justify-content-center '>
                <h4>No Data Found</h4>
              </div>}

          </div>
        </div>

        {deleteProductsDialog &&


          <Dialog
            visible={deleteProductsDialog}
            dismissableMask={!uploadInProgress}
            style={{ width: "32rem", }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            // header="Upload File"

            draggable={false}
            modal
            // footer={deleteProductsDialogFooter}
            onHide={hideDeleteProductsDialog}
          >
            <form onSubmit={sendFileData}>

              <div className="confirmation-content">

                <div iv className="field mt-3 negativePadding">
                  <div className="fileHeaderTxt">Upload</div>

                  <label htmlFor="name" className="font-bold py-2 pe-4 ">
                    Description
                  </label>
                  <InputTextarea
                    id="descriptionGoalTask"
                    placeholder="Input text"

                    rows={3}
                    cols={20}
                    value={description}
                    className="p-0 ps-1 w-100"
                    onChange={(e) => setDescription(e.target.value)}
                  />


                  <label htmlFor="name" className="font-bold py-2 pe-4 ">
                    Speaker
                  </label>
                  <InputField
                    name={"speaker"}
                    mainClass={"mt-24px "}
                    type="text"
                    className={"w-100 libInput"}
                    placeholder={"Input text "}
                    value={speaker}
                    onChange={(e) => setSpeaker((e.target.value))}
                  />
                </div>
                <div className="">

                  {/* {!selectedFile && */}
                  <label htmlFor="fileInput" className="profile-btn mt-4 ms-0 me-0 custom-upload-btn ">
                    <div className="ms-2 me-1" onClick={openFileUploadDialog} disabled={uploadInProgress} >
                      <BiPlusCircle className=" mb-1" />
                      <span className="ms-2">Upload File</span>
                      <input type="file"
                        className="me-2"
                        id="fileInput"
                        accept=".png, .jpg, .bmp, .pptx, .docx, .zip, .jpeg, .jpeg .mp3, .mp4"
                        style={{ display: "none" }}
                        onChange={handleFileSelect}
                        disabled={uploadInProgress}

                      />

                    </div>
                  </label>

                  <div className="image-containerLib mt-2">
                    {/* {renderSelectedFile()} */}
                    {filename}

                  </div>
                  {/* } */}
                  {/* Progress bar */}
                  <div className=""></div>
                  {uploadProgress > 0 && (
                    <div className="progress mt-3">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${uploadProgress}%` }}
                        aria-valuenow={uploadProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {uploadProgress}%
                      </div>
                    </div>
                  )}
                </div>


                <div className="d-flex align-items-center justify-content-center mt-5">

                  <Button
                    type="file"
                    data="Submit"
                    class="profile-btn w-50 text-center mt-2"
                    disabled={uploadInProgress}
                    onClick={(e) => sendFileData(e)}
                  />
                </div>

              </div>
            </form>
          </Dialog>

        }

      </div>
    </div>
  );
};



