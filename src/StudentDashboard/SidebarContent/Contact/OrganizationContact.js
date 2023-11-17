

import React from "react";
import "./Contact.css";
import img from "../../../asserts/images/Rectangle.png";
import { BsPerson } from "react-icons/bs";
import { HiOutlineUsers } from "react-icons/hi";
import secureLocalStorage from "react-secure-storage";
import { useState } from "react";
import { useEffect } from "react";
import Buttons from "../../../components/reuseable/Button";
import { EventOrganizer } from "../../../Dashboard/DashboardPages/Islamic-Culture/EventOrganizer";
import About2 from "../../../Dashboard/DashboardPages/Islamic-Culture/TabsSection/About2";
import chatDropdown from "../../../asserts/images/chatDropdown.png";
import { Link } from "react-router-dom";
import { Loader } from "../../../components/reuseable/Loader";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import { showMessage } from "../../../components/reuseable/Tostify";
import API_Routes from "../../../Routes/API_Routes";



export const OrganizationContact = ({ data, dismiss, data2, fetchConversations }) => {
  const [mydata, setMydata] = useState({});

  const [memberOfOrganization, setMemberOfOrganization] = useState([])
  const [nonMemberOfOrganization, setNonMemberOfOrganization] = useState([])

  useEffect(() => {
    const membersArray = data?.userId?.member?.filter(item => item?.role && item?.role?.toLowerCase()?.includes('member'));
    const nonMembersArray = data?.userId?.member?.filter(item => !item?.role || !item?.role?.toLowerCase()?.includes('member'));
    setMemberOfOrganization(membersArray)
    setNonMemberOfOrganization(nonMembersArray)

    setMydata(data)
    setIsLiked(data?.isFavorite)
  }, [data])
  const token = secureLocalStorage.getItem("token");
  const role = secureLocalStorage.getItem("role");
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isLiked, setIsLiked] = useState(false)

  const handleIndex = (index) => {
    if (index === 2) {
      confirmDeleteSelected()
      setIsOpen2(false)
    }
    if (role == "student" && index === 0) {
      handleAddToFavoutite()
      setIsOpen2(false)
    }


  }
  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };
  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
    // setOpenDelete(false)
  };
  const DeleteContact = () => {
    var myHeaders = new Headers();

    setLoader(true);
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("contactId", data2);

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch("https://ilmcircle.com/backend/api/student/contact/remove", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        if (result.status == 200) {
          fetchConversations()
          setDeleteProductsDialog(false)
          setLoader(false);
          setMydata({})

          showMessage(result?.message)
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
        onClick={() => DeleteContact()}
      />
    </React.Fragment>
  );


  const handleAddToFavoutite = () => {


    setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    if (data2) {
      formdata.append("favoriteName", 'Organization');
      formdata.append("usersId", data2);
    } else {
      return showMessage("Cannot add to favorite!", 'error')
    }

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(API_Routes.ADDTOFAVORITE, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status == 200 || result.status == 201) {
          setLoader(false);
          fetchConversations()
          showMessage(result.message)
          setIsLiked(!isLiked)
        } else {
          setLoader(false);
          showMessage(result.message, 'error')
        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });

  };
  return (
    <>
      {Object.keys(mydata).length !== 0 ? (

        <>

          {loader && <div className="loaderScreen">
            <Loader />
          </div>}
          <div className="islamicCultureEvent mb-5">

            <div className="p-4">
              <div className="row align-items-start g-4">
                <div className=" col-xl-4 col-lg-5 col-md-5 d-flex justify-content-center  " >
                  <div>
                    <img className="w-100"
                      src={img}

                      alt="Image here"
                    />


                  </div>
                </div>

                <div className="col-lg-6 col-md-6 pt-3 ">
                  <div className="d-flex align-items-center islamic-culture justify-content-between">
                    <h2>{mydata?.orgName}</h2>

                  </div>

                  <div className="cultureLi">
                    <p>
                      <span>
                        <BsPerson />
                      </span>
                      <span className="ms-3">

                        Organized by {" "}
                        {nonMemberOfOrganization[0]?.firstName ? nonMemberOfOrganization[0]?.firstName : " Admin"}
                        {nonMemberOfOrganization?.length && (nonMemberOfOrganization?.length > 2) ? " and " + (nonMemberOfOrganization?.length - 1) + " others" : ""}
                        {nonMemberOfOrganization?.length && (nonMemberOfOrganization?.length === 2) ? " and " + nonMemberOfOrganization?.length + " others" : ""}
                      </span>
                    </p>
                    <p>
                      <span>
                        <HiOutlineUsers />
                      </span>
                      <span className="ms-3">{memberOfOrganization?.length ? memberOfOrganization?.length : 0} members</span>
                    </p>
                    <p>


                    </p>

                    <div className="d-sm-flex  ">
                      <Buttons
                        class={"tech-btn tech-btn-2 me-3 "}
                        data={"Contact us"}
                        onClick={() => {

                        }}
                      ></Buttons>

                      {role == "student" ?
                        <span data-bs-dismiss={dismiss}>
                          <Link to={`/islamic-culture/${data2}`}>

                            <Buttons
                              class={"tech-btnBlock2 mt-sm-0 mt-3"}
                              data={"View Organization Page"}
                              onClick={() => {

                              }}
                            ></Buttons>

                          </Link>
                        </span> : ""
                      }

                    </div>


                  </div>
                </div>
                <div className="col-md-1         " >
                  <div className="mt-1 position-relative ">
                    <img
                      onClick={() => setIsOpen2(!isOpen2)}
                      src={chatDropdown}
                      className={`  three-dot point  ${isOpen2 ? "onHover" : ""} onHover`}
                      alt="..." />

                    {isOpen2 && (
                      <div
                        className="categroyDropDown2 z-3 border px-2 py-2 rounded mt-2 position-absolute    organization-category-dropdown"
                        style={{ backgroundColor: "#fcfcfc" }}
                      >


                        {role === "student" && <div className="categoryGoal2 my-2 point px-3" style={{ fontFamily: "Open Sans" }} onClick={() => handleIndex(0)}  >
                          {isLiked

                            ?
                            "Remove from favourite"

                            :
                            "Add to favourite"

                          }
                        </div>}
                        <div className="categoryGoal2 my-2 point px-3" style={{ fontFamily: "Open Sans" }} onClick={() => handleIndex(1)}  >
                          Share it to friends

                        </div>
                        <div className="categoryGoal2 my-2 point px-3" style={{ fontFamily: "Open Sans" }} onClick={() => handleIndex(2)}  >
                          Delete from contact
                        </div>


                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
            <About2 aboutData={mydata} />

            <div >
              <EventOrganizer aboutData={mydata} />
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


                  <div>
                    <span>Are you sure you want to delete this Contact?</span>

                  </div>
                  {/* // )} */}
                </div>
              </Dialog>

            }
          </div>
        </>
      ) : ""
      }

    </>

  );
};

