import React, { useState } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { bindActionCreators } from "redux";
import { actionCreaters } from "../../../Store/Index";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/reuseable/Button";
import { CurruncyDropDown } from "./CurruncyDropDown";
import upArrow from "../../../asserts/images/upArrow.svg";
import phones from "../../../asserts/images/chatPhone.png";
import mailIcon from "../../../asserts/images/mailIcons.png";
import { BiArrowToTop } from "react-icons/bi";
import { SeleclInput } from "../OrgMyEvents/Reuseable/SeleclInput";
import { useDropzone } from "react-dropzone";
import secureLocalStorage from "react-secure-storage";
import API_Routes from "../../../Routes/API_Routes";
import { Loader } from "../../../components/reuseable/Loader";
import { showMessage } from "../../../components/reuseable/Tostify";
import { useNavigate } from "react-router-dom";
export const CreateNewProject = () => {
  const dispatch = useDispatch();
  const { orgDashboardIndex } = bindActionCreators(actionCreaters, dispatch);

  const [projectTitle, setProjectTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [aboutProject, setAboutProject] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState({});
  const [start, setStart] = useState("");
  const [loader, setLoader] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const token = secureLocalStorage.getItem('token')
  const selectedItem = useSelector((state) => state?.selectedIndex);

  const navigate = useNavigate();

  const handleStartChange = (date) => {
    setStart(date);
  };

  const onDrop = (acceptedFiles) => {
    // You can perform any necessary file handling here
    setSelectedFiles(acceptedFiles);
    setUploadedImages(acceptedFiles.map(file => URL.createObjectURL(file)));
  };

  const deleteImage = (index) => {
    const updatedImages = [...uploadedImages];
    updatedImages.splice(index, 1);
    setUploadedImages(updatedImages);

    const updatedSelectedFiles = [...selectedFiles];
    updatedSelectedFiles.splice(index, 1);
    setSelectedFiles(updatedSelectedFiles);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.jpg, .png, .svg',
    multiple: false,
  });


  const CreateProject = () => {
    if (selectedStartDate?.day <= 0) {
      return showMessage('Please select the day', 'error')
    }
    if (!selectedStartDate?.month) {
      return showMessage('Please select month ', 'error')

    }

    if (!selectedStartDate?.year) {
      return showMessage('Please select year', 'error')

    }
    setLoader(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    var formdata = new FormData();
    formdata.append("title", projectTitle);
    formdata.append("about", aboutProject);
    formdata.append("totalAmount", amount);
    formdata.append("currency", currency);
    formdata.append("deadline", `${selectedStartDate?.month + 1}/${selectedStartDate?.day}/${selectedStartDate?.year}`);
    formdata.append("phone", phone);
    formdata.append("createDate", new Date());
    formdata.append("email", email);
    formdata.append("image", selectedFiles[0]);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(API_Routes.CREATEPROJECT, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status == 200 || result.status == 201) {
          setLoader(false);
          navigate(`/organization-dashboard/${6}`)

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
        <div className="row">
          <div className="col-md-10 col-lg-8 col-xl-6">
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
                  <a className="vacancy-breadcrum">Create new project</a>
                </div>
                <div className="row ">
                  <div className="col-md-6 d-flex align-items-center mt-4">
                    <h5 className="">New Project</h5>
                  </div>
                </div>
              </div>
            </div>

            <div className="outer-border-vacancy">
              <div className="mt-4 new-vacancy">
                <div className="create-vc-spacing">
                  <p className="textheading mb-1">Title (required)</p>
                  <input
                    type="text"
                    className="inputFields w-100 "
                    placeholder="Input text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                  />
                </div>
                <p className="textheading mb-1 mt-24px ">Cover picture</p>
                {/* <div
                  {...getRootProps()}
                  className={`eventUploadFile w-100 text-center point ${isDragActive ? 'drag-active' : ''
                    }`}
                >
                  <input {...getInputProps()} />
                  <BiArrowToTop color="black" fontSize={"25px"} />
                  <h3 className="mt-3">
                    {isDragActive ? 'Drop your files here' : 'Drag or upload your files* here'}
                  </h3>
                  <h4 className="">*Available formats: Jpg, Png, Svg</h4>
                </div> */}


                <div
                  {...getRootProps()}
                  className="shadowBg bottomContext py-4 ">
                  <label
                    htmlFor="upload-button"
                    className={`eventUploadFile w-100 text-center pointer ${isDragActive ? 'drag-active' : ''
                      }`}
                  >
                    <input {...getInputProps()} />

                    <img src={upArrow} alt="" width={"30px"} />
                    <p>{isDragActive ? 'Drop your files here' : 'Drag or upload your files* here'}</p>


                  </label>
                </div>
                {uploadedImages.length > 0 && (
                  <div className="mt-3 d-flex flex-wrap">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="image-preview-container">
                        <img style={{ width: 80, height: 80 }} src={image} alt={`Uploaded Thumbnail ${index + 1}`} />
                        <button className="delete-button" onClick={() => deleteImage(index)}>
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="create-vc-spacing">
                  <p className="textheading mb-1 mt-24px">About the project</p>

                  <input
                    type="text"
                    className="inputFields w-100 allEditInput projectDetailsInput"
                    placeholder="Input text"
                    value={aboutProject}
                    onChange={(e) => setAboutProject(e.target.value)}
                  />
                </div>
                <div className="row mt-24px">
                  <div className="col-md-7 create-vc-spacing">
                    <p className="textheading mb-1 ">Total amount</p>

                    <input
                      type="number"
                      className="inputFields w-100"
                      value={amount}
                      placeholder="Number"
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="col-md-5 create-vc-spacing">
                    <p className="textheading mb-1 ">Currency</p>
                    <CurruncyDropDown currency={currency} setCurrency={setCurrency} />
                  </div>
                </div>
                <div className="row mt-24px">
                  <div className="col-md-12  createEventOrganizationModal mt-24px">
                    <p className="textheading mb-1">Deadline</p>
                    <SeleclInput
                      // name="noData"
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
                  </div>
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
                    placeholder="Input text"

                    onChange={(e) => setPhone(e.target.value)}

                  />
                </div>

                <div className="contactPhoneBox d-flex align-items-center inputFields mt-3">
                  <img src={mailIcon} alt="" width={"20px"} className="me-2" />
                  <input
                    type="email"
                    value={email}
                    placeholder="Input text "
                    onChange={(e) => setEmail(e.target.value)}

                  />
                </div>
              </div>

              <div className="text-center">
                <Button
                  data="Create new project"
                  class="newv-btn mt-5 "
                  onClick={() => CreateProject()}
                />
              </div>
              {/* <div className="text-center mt-2 orange point">
                <p
                  onClick={() => {
                    orgDashboardIndex({ orgIndex: 6 });

                  }}
                  className="cancelBtn CancelButtonVacancy"
                >
                  Cancel
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div >

  );
};


