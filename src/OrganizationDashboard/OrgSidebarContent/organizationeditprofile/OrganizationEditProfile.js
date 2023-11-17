import React, { useEffect,useRef } from "react";
import "../../../Auth/auth.css";

//----------components------------------//
import Header from "../../../layout/Header.js";
import Button from "../../../components/reuseable/Button";
import InputField from "../../../components/reuseable/InputField";

//-----------images-------------------------//
import left from "../../../asserts/images/auth left.png";
import right from "../../../asserts/images/auth right.png";
import rectangle from "../../../asserts/images/Rectangle3.png";
import plusicon from "../../../asserts/images/PlusIconAdmin.jpeg"
import person from "../../../asserts/images/person.png"


import img1 from "../../../asserts/images/Avatar.png";
import img2 from "../../../asserts/images/Avatar (1).png";
import img3 from "../../../asserts/images/Avatar (2).png";

//----------library-------------------------//
import { ReactSVG } from "react-svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BiPencil } from "react-icons/bi";
import secureLocalStorage from "react-secure-storage";
import { useState } from "react";
import API_Routes from "../../../Routes/API_Routes";
import { showMessage } from "../../../components/reuseable/Tostify";
import defaultProfile from "../../../asserts/images/deafultProfile.svg";
import { Loader } from "../../../components/reuseable/Loader";
import DashboardNavbar from "../../../Dashboard/DashboardCmp/DashboardNavbar";

const OrganizationEditProfile = () => {
  const role = secureLocalStorage.getItem("role");

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  document.body.dir = i18n.dir();
  const [isOpenEditing, setIsOpenEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const [orgName, setOrgName] = useState("");
  const [orgAddress, setOrgAddress] = useState("");
  const [orgwebsite, setOrgWebsite] = useState("");
  const [orgIntro, setOrgIntro] = useState("");
  const [apiImageURL, setApiImageURL] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loader, setLoader] = useState(false);
  const [img, setImg] = useState("");
  const [passName, setPassName] = useState("");

  const [firstNameBoardMember , setFirstNameBoardMember] = useState("")
  const [lastNameBoardMember , setlastNameBoardMember] = useState("")
  const [roleBoardMember , setRoleBoardMember] = useState("")
  const [eamilBoardMember , setEmailBoardMember] = useState("")
  const [seletedFileforAdmin , setseletedFileforAdmin] = useState(null);
  
  const [organizationMember , setOrganizationMember] = useState([])

  const token = secureLocalStorage.getItem("token");
  const getUserEMail = secureLocalStorage.getItem("email");

  const toggleNavbar = () => {
    setIsOpenEditing(!isOpenEditing);
    if (isOpenEditing) {
      editProfile();
      GetProfileData()
    }
  };
  const toggleNavbar2 = () => {
    setIsOpenEditing(!isOpenEditing);
  };

  const showInput = () => {
    setIsOpen(true);
    setIsOpenEditing(true);
  };

  useEffect(() => {
    if (role != "organization") {
      navigate("/");
    }
    GetProfileData();
  }, []);

  const GetProfileData = () => {
    setLoader(true);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(API_Routes.GETORGPROFILE, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200) {
          setOrgName(result?.data?.orgName);
          setOrgWebsite(result?.data?.website);
          setOrgAddress(result?.data?.address);
          setOrgIntro(result?.data?.introduction);
          setApiImageURL(result?.data?.image?.url);
        // console.log(result  )
        // console.log(result?.data?. userId?.member)
          // secureLocalStorage.setItem("name", result?.data?.orgName);
          setOrganizationMember(result?.data?.userId?.member)
          const imgData = result?.data?.image?.url;
          // console.log('imgData', imgData)
          setImg({
            img: imgData,
            name: result?.data?.orgName,
          });
          secureLocalStorage.setItem("image", result?.data?.image?.url);

          setLoader(false);
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

  const editProfile = () => {
    setLoader(true);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("orgName", orgName);
    formdata.append("address", orgAddress);
    formdata.append("introduction", orgIntro);
    formdata.append("website", orgwebsite);
    // formdata.append("id", "650aa4e4faf9324272134f7c");
    // formdata.append("image", fileInput.files[0], "[PROXY]");
    if (selectedFile) {
      formdata.append("image", selectedFile);
    }

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(API_Routes.ORGEDIT_PTOFILE, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result?.status == 200 || result.status == 201) {
          // secureLocalStorage.setItem("name", result?.data?.orgName);

          const imgData = result?.data?.image?.url;
          setImg({
            img: imgData,
            name: result?.data?.orgName,
          });
          secureLocalStorage.setItem("image", result?.data?.image?.url);

          // setPassName(result?.data?.orgName)

          setLoader(false);
          showMessage(result.message);
        } else {
          setLoader(false);
          showMessage(result.message, "error");
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("error", error);
      });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    // console.log(selectedFile)

    setApiImageURL(null);
  };
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
          style={{ width: 150, height: 150, borderRadius: 150 }}
          src={apiImageURL}
          alt="API Image"
        />
      );
    } else if (selectedFile) {
      return (
        <img
          style={{ width: 150, height: 150, borderRadius: 150 }}
          src={URL.createObjectURL(selectedFile)}
          alt="Selected File"
        />
      );
    }
    return (
      <img
        style={{ width: 150, height: 150, borderRadius: 150 }}
        src={defaultProfile}
        alt="Default Profile"
      />
    );
  };
  if (role != "organization") {
    navigate("/");
  }


  const openFileUploadDialog2 = () => {
    const fileInput = document.getElementById("file-input2");
    if (fileInput) {
      fileInput.click();
    }
  };

  const renderSelectedFile2 = () => {

   if (seletedFileforAdmin) {
      return (
        <img
          style={{ width: 90, height: 90, borderRadius: 150 }}
          src={URL.createObjectURL(seletedFileforAdmin)}
          alt="Selected File"
        />
      );
    }
    return (
      <img
      style={{ maxWidth: "90px", maxHeight: "90px", borderRadius: 150 }}
      className="img-fluid"
        src={person}
        alt="Default Profile"
      />
    );
  };

  const handleFileSelectAdmin = (e) => {
    const file = e.target.files[0];
    setseletedFileforAdmin(file);

  };
  



const PostDataToServer =()=>{
  setLoader(true);
  var myHeaders = new Headers();
myHeaders.append("Authorization",  "Bearer " + token);

var formdata = new FormData();
formdata.append("role", roleBoardMember);
formdata.append("firstName", firstNameBoardMember);
formdata.append("lastName", lastNameBoardMember);
formdata.append("email", eamilBoardMember);
if (seletedFileforAdmin) {
  formdata.append("image", seletedFileforAdmin);
}
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: formdata,
  redirect: 'follow'
};

fetch(API_Routes.ADDMEMBERORGANIZATION,  requestOptions)
  .then(response => response.json())
  .then(result =>{ 
    if (result?.status == 200 || result.status == 201) {
      setRoleBoardMember("")   
      setEmailBoardMember("")
      setseletedFileforAdmin("")
      setlastNameBoardMember("")
      setFirstNameBoardMember("")
      setseletedFileforAdmin(null)
      setLoader(false);
      showMessage(result.message);
    }else {
    setLoader(false);
    showMessage(result.message, "error");
  }

  })
  .catch(error => {
    setLoader(false);
    console.log('error', error)
  });
}



const adjustColumnHeights = () => {
  const container = containerRef.current;
  const columns = container?.querySelectorAll('.column');
  let maxHeight = 0;

  columns?.forEach((column) => {
    column.style.height = 'auto';
    const columnHeight = column.offsetHeight;
    maxHeight = Math.max(maxHeight, columnHeight);
  });

  columns?.forEach((column) => {
    column.style.height = maxHeight + 'px';
  });
};
const containerRef = useRef(null);

useEffect(() => {
  adjustColumnHeights();
  
}, [organizationMember]);
  return (
    <>
      {role == "organization" ? (
        <section>
          {loader && (
            <div className="loaderScreen">
              <Loader />
            </div>
          )}

          <DashboardNavbar img={img} />
          <div className="container-fluid px-zero light-images">
            <div className="img-left-side">
              <img className="img-fluid" src={left} alt="" />
            </div>
            <div className="img-right-side">
              <img className="img-fluid" src={right} alt="" />
            </div>
            <div className="container">
              <div className="row login-row pt-0">
                <div className="login-box org-box px-3">
                  <div className="login-body">
                    <div className="row align-items-center justify-content-between row-cols-md-2 flex-md-nowrap">
                      <h6 className="ol col-12">{"My Profile"}</h6>

                      <div className="col-lg-6 col-md-6 col-sm-12 pe-0">
                        <div className="both-btn">
                          {isOpenEditing ? (
                            <Button
                              class={"profile-btn profile-btn-white"}
                              data={"Cancel"}
                              onClick={toggleNavbar2}
                            />
                          ) : null}
                          <Button
                            onClick={toggleNavbar}
                            class={"profile-btn"}
                            data={
                              isOpenEditing ? "Save changes" : "Edit profile"
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="org-profile-pic">
                      {/* <img src={rectangle} alt="" /> */}
                      {renderSelectedFile()}

                      <div onClick={openFileUploadDialog}>
                        {isOpenEditing ? (
                          <span>
                            {" "}
                            <BiPencil />
                          </span>
                        ) : null}
                      </div>
                      <input
                        id="file-input"
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        style={{ display: "none" }}
                        onChange={handleFileSelect}
                      />
                    </div>

                    <div className="my-3"></div>
                    <div className="login-form">
                      <form>
                        <div className="row align-items-center row-cols-md-2 flex-md-nowrap">
                          <div className="mb form-main col col-12 ">
                            <label htmlFor="fname">
                              {"Organization name*"}
                            </label>
                            <InputField
                              isOpenEditing={isOpenEditing}
                              placeholder={"input text"}
                              type="text"
                              value={orgName}
                              onChange={(e) => setOrgName(e.target.value)}
                            />
                          </div>
                          <div className="mb form-main col col-12">
                            <label htmlFor="fname">{"Address*"}</label>
                            <InputField
                              isOpenEditing={isOpenEditing}
                              placeholder={"input text"}
                              type="text"
                              value={orgAddress}
                              onChange={(e) => setOrgAddress(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="row align-items-center row-cols-md-2 flex-md-nowrap">
                          <div className="mb form-main col col-12">
                            <label htmlFor="fname">{"Website"}</label>
                            <InputField
                              isOpenEditing={isOpenEditing}
                              placeholder={"input text"}
                              type="text"
                              value={orgwebsite}
                              onChange={(e) => setOrgWebsite(e.target.value)}
                            />
                          </div>
                          <div className="mb form-main col col-12">
                            <label htmlFor="fname">
                              {"Contact e-mail*"}
                            </label>
                            <InputField
                              placeholder={"input text"}
                              type="text"
                              value={getUserEMail}
                              disabled
                              PerminentDisablled={true}
                            />
                          </div>
                        </div>
                        <div className="mb form-main w-100">
                          <label htmlFor="fname">
                            {"Introduction about your mission and service"}
                          </label>
                          <textarea
                            value={orgIntro}
                            disabled={
                              isOpenEditing == undefined
                                ? false
                                : !isOpenEditing
                            }
                            name=""
                            id=""
                            rows={25}
                            placeholder="input text"
                            onChange={(e) => setOrgIntro(e.target.value)}
                          />
                        </div>




                      </form>
                      <div className="text-start pb-2"><p>Board members</p></div>
                      {isOpenEditing ?  
                      
                       <div className="row align-items-center justify-content-between mx-1 " >
                          
                     <div 
                     className="col-md-4 col-sm-5   border  p-3 rounded  mb-sm-0 mb-4"
                      style={{height:"550px" ,background:"fcfcfc "}}> 


                       {/* image */}
                        <div className="org-profile-pic pt-sm-4 pt-2">
                      {/* <img src={rectangle} alt="" /> */}
                      {renderSelectedFile2()}

                      <div onClick={openFileUploadDialog2}  className="position-relative">
                        {isOpenEditing ? (
                          <span  className="position-class">
                            {" "}
                            <BiPencil  />
                            </span>
                          //   <span className="position-class">

                          // </span>
                        ) : null}
                      </div>
                      <input
                        id="file-input2"
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        style={{ display: "none" }}
                        onChange={handleFileSelectAdmin}
                      />
                        </div>
                          {/* First Name */}
                          <div className="mb form-main col col-12 ">
                            <label htmlFor="fname">
                              {"First Name"}
                            </label>
                            <InputField
                              isOpenEditing={isOpenEditing}
                              placeholder={"First Name"}
                              type="text"
                              value={firstNameBoardMember}
                              onChange={(e) => setFirstNameBoardMember(e.target.value)}
                            />
                          </div>
                          {/* Last Name */}
                          <div className="mb form-main col col-12">
                            <label htmlFor="fname">{"Last Name"}</label>
                            <InputField
                              isOpenEditing={isOpenEditing}
                              placeholder={"Last Name"}
                              type="text"
                              value={lastNameBoardMember}
                              onChange={(e) => setlastNameBoardMember(e.target.value)}
                            />
                            
                          </div>
                            {/* Role Name */}
                            <div className="mb form-main col col-12">
                            <label htmlFor="fname">{"Role"}</label>
                            <InputField
                              isOpenEditing={isOpenEditing}
                              placeholder={"Role"}
                              type="text"
                              value={roleBoardMember}
                              onChange={(e) => setRoleBoardMember(e.target.value)}
                            />
                            
                          </div>
                           {/* Email */}
                           <div className="mb form-main col col-12">
                            <label htmlFor="fname">{"Email"}</label>
                            <InputField
                              isOpenEditing={isOpenEditing}
                              placeholder={"Email"}
                              type="text"
                              value={eamilBoardMember}
                              onChange={(e) => setEmailBoardMember(e.target.value)}
                            />
                            
                          </div>
                          </div>
                          <div className="col-md-4 col-sm-5 border  p-lg-5 p-3  rounded border-dotted"  style={{height: "550px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                         <div >

                          <div className="org-profile-pic" >
                            <img
                            className="image-blur"
                          style={{ width: 90, height: 90, borderRadius: 150 }}
                          src={  plusicon}
                          alt="Default Profile"
                        />
                          
                            </div>
                            <div className="align-item-center  d-flex justify-content-center">

                          <Button
                            onClick={PostDataToServer}
                            class={"profile-btn"}
                            data={"Add new member" }
                          />
                            </div>
                         </div>
                        



                          </div>
                        
                          <div className="col-3 p-5   "  style={{height:"550px"}}></div>
                        </div>
                        :
                        
                        
                        
                        
                  
                        <div ref={containerRef} className="row align-items-center justify-content-sm-between justify-content-center   mx-1 ">
      {organizationMember?.map((item, index) => (
        <div key={index}   id="column1" className=" column  admin-list border rounded py-4   mb-3 color" >
         
            <div className="organizerImg d-flex justify-content-center">
              <img   style={{ width: 90, height: 90, borderRadius: 150 ,objectFit:"cover"}}  src={item?.image?.url} alt="" />
            </div>
            <div  className="ps-3 pt-2 pb-4  ">

            <h1 className="mt-2 text-start adminName ">{item?.firstName}{" "}{item?.lastName}</h1>
            <p className="text-start ">{item?.role}</p>
            <p className="text-start text-break">{item?.email}  </p>
            </div>
          
        </div>
      ))}
    </div>
                        
                        }



                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        ""
      )}
    </>
  );
};

export default OrganizationEditProfile;

