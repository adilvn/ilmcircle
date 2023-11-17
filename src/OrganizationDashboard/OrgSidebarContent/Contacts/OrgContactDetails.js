import React, { useEffect, useState } from "react";
import "../../../Dashboard/DashboardPages/FindBuddydetails/buddydetails.css";

//------------library-------------------------//

//---------------dummay-data--------------------//
import { buddyData } from "../../../constant/DummayBuddy";

//---------------------components---------------------//
import Buttons from "../../../components/reuseable/Button";

//-------------images-------------------------//
import Availbility from "../../../Dashboard/DashboardCmp/Availbility/Availbility";
import studyBuddyProfile from "../../../asserts/images/buddy1.jpg";
import RangeSliderMui from "../../../Dashboard/DashboardPages/FindBuddydetails/RangeSliderMui";
import deleteIcon from "../../../asserts/images/deleteIcon.png";
import lectureImg1 from "../../../asserts/images/lectureImg1.png";
import lectureImg2 from "../../../asserts/images/lectureImg2.png";
import secureLocalStorage from "react-secure-storage";
import { showMessage } from "../../../components/reuseable/Tostify";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const OrgContactDetails = ({ data, fetchConversations, buddy, blockUser, sendMessage }) => {
    const [mem, setMem] = useState(0);
    const [items, setItems] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [contact, setContact] = useState([]);
    const [goals, setGoals] = useState([]);
    const [riwayas, setRiwayas] = useState([]);
    const user = secureLocalStorage.getItem("id");
    const token = secureLocalStorage.getItem("token");
    const [loader, setLoader] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);

    //-----useparams------//

    ///like unlike condition maping ////////
    const handleLike = (itemId, liked) => {
        const updatedItems = buddyData.map((item) => {
            if (item.id === itemId) {
                return { ...item, liked };
            }
            return item;
        });
        setItems(updatedItems);
    };



    const DeleteContact = () => {
        var myHeaders = new Headers();
        // myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + token);

        var formdata = new FormData();
        formdata.append("contactId", data?._id);

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://ilmcircle.com/backend/api/organization/contact/remove", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status == 200 || result.status == 201) {
                    setDeleteProductsDialog(false)
                    setLoader(false);
                    fetchConversations()
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
    ///like unlike condition maping ////////
    const matchingItem =
        buddy?.contact?.find(
            (item) =>
                (item?.userId === user && item?.contactId === buddy?._id) ||
                (item?.userId === buddy?._id && item?.contactId === user)
        ) ||
        buddy?.contacts?.find(
            (item) =>
                (item?.userId === user && item?.contactId === buddy?._id) ||
                (item?.userId === buddy?._id && item?.contactId === user)
        );

    const isBlockValue = matchingItem ? matchingItem.isBlock : null;
    const isMyIdMatch = matchingItem ? matchingItem.sendRequest : null;
    useEffect(() => {
        if (buddy) {
            try {
                const languageDataArray = JSON.parse(data?.userDetailId?.language);
                const contactArray = JSON.parse(
                    buddy?.availibility[0]?.contactPreferance
                );
                const goal = JSON.parse(buddy?.goals[0]?.goal);
                const riwaya = JSON.parse(buddy?.goals[0]?.riwaya);
                setRiwayas(riwaya);
                setGoals(goal);
                setLanguages(languageDataArray);
                setContact(contactArray);
            } catch (error) {
                console.log(error);
            }
        }
    }, [buddy]);
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
                onClick={() => DeleteContact()}
            />
        </React.Fragment>
    );
    return (

        <>
            {loader && <div className="loaderScreen">
                <loader />
            </div>}
            <section>
                <div className="container-fluid">
                    <div className="container">
                        <div className="row tech-details-header">
                            <div className="col-xl-3 col-lg-4 d-sm-block d-flex justify-content-center  ">
                                <img
                                    className="img-fluid rounded"
                                    src={
                                        data?.userDetailId?.image?.url
                                            ? data?.userDetailId?.image?.url
                                            : studyBuddyProfile
                                    }
                                    alt=""
                                />
                            </div>

                            <div className="col-xl-9 col-lg-8 buddy-details-text p-0 mt-sm-3 mt-md-3 mt-lg-0">
                                <div className="row  justify-content-between align-items-center">
                                    <div className="col-md-6">
                                        <h6 className="pt-sm-0 pt-2">
                                            {data?.userDetailId?.firstName
                                                ? data?.userDetailId?.firstName +
                                                " " +
                                                data?.userDetailId?.lastName
                                                : "Unknown"}
                                        </h6>
                                    </div>
                                    <div className="col-md-6 ms-auto d-flex justify-content-lg-end justify-content-end">
                                        <img
                                            // style={{ width: 20, height: 40 }}
                                            src={deleteIcon}
                                            className="delete-icon-size pointer delete-box-class"
                                            alt="deleteIcon"
                                            onClick={() => confirmDeleteSelected()}

                                        />
                                    </div>
                                </div>
                                <div className="my-3">
                                    <div className="row justify-content-between align-items-center ">
                                        <div className="col-lg-6">
                                            <p>
                                                {" "}
                                                Location:{" "}
                                                <span>
                                                    {data?.userDetailId?.city},{" "}
                                                    {data?.userDetailId?.country}{" "}
                                                </span>{" "}
                                            </p>
                                        </div>
                                        <div className="col-lg-6">
                                            <p>
                                                {" "}
                                                Language:{" "}
                                                <span style={{ textTransform: "capitalize" }}>
                                                    {languages?.map((item) => (
                                                        <>{item?.level + ", "} </>
                                                    ))}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row justify-content-between align-items-center ">
                                        <div className="col-lg-6">
                                            <p>
                                                {" "}
                                                Age: <span>30 years old</span>{" "}
                                            </p>
                                        </div>
                                        <div className="col-lg-6">
                                            <p>
                                                {" "}
                                                Contact preference:{" "}
                                                <span style={{ textTransform: "capitalize" }}>
                                                    {contact?.map((item) => (
                                                        <>{item + ", "} </>
                                                    ))}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        {!isMyIdMatch && (
                                            <Buttons
                                                class={"tech-btn tech-btn-2 me-3"}
                                                data={"Send message"}
                                                onClick={() => {
                                                    sendMessage();
                                                }}
                                            ></Buttons>
                                        )}
                                        <Buttons
                                            class={"tech-btnBlock"}
                                            data={isBlockValue == true ? "Unblock" : "Block"}
                                            onClick={() => {
                                                blockUser();
                                            }}
                                        ></Buttons>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* ///////////////section-two///////////// */}
            <div className="container mb50" id="About-section">
                <h5>About me</h5>
                <div className="box-section-one col-lg-12 col-sm-12">
                    <small>{data?.userDetailId?.aboutMe}</small>
                </div>
            </div>

            {/* ///////////////section-three///////////// */}
            <div className="container mb50">
                <h5 id="study-goal-section">Study goal and memorization level</h5>
                <div className="col-lg-12 box-section-one ">
                    <p>
                        Study goal:{" "}
                        <span className="memoLevel">
                            {goals?.map((item) => (
                                <>{item + ", "} </>
                            ))}
                        </span>
                    </p>
                    <p>
                        Riwaya:{" "}
                        <span className="memoLevel">
                            {" "}
                            {riwayas?.map((item) => (
                                <>{item + ", "} </>
                            ))}
                        </span>
                    </p>
                    <p>Memorization level:</p>
                    <div className="row contactDetailSliderStyle justify-content-start">
                        <div className="col-lg-8 d-sm-flex d-block mt-3 align-items-center">
                            <p className="mb-1 mx-3 fw-500"> 1 juzz</p>
                            <RangeSliderMui
                                disabled={true}
                                className="mx-1"
                                setMem={setMem}
                                level={buddy?.goals[0]?.memorizationLevel}
                            />
                            <p className="mb-1 mx-3 fw-500">30 juzz</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ///////////////section-four///////////// */}
            <div className="container mb50" id="lectures">
                <h5>Events and lectures</h5>
                <div className="col-lg-12  box-section-one Eventslectures">
                    <ul
                        class="nav nav-tabs gap-3"
                        id="myTab"
                        role="tablist"
                        style={{ marginBottom: 32 }}
                    >
                        <li class="nav-item" role="presentation">
                            <button
                                class="nav-link active"
                                id="pills-home-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-home"
                                type="button"
                                role="tab"
                                aria-controls="pills-home"
                                aria-selected="true"
                            >
                                <div className="d-flex align-items-center justify-content-center gap-2">
                                    <img
                                        style={{ width: 22 }}
                                        src={lectureImg1}
                                        className="mb-1 me-1"
                                        alt=""
                                    />
                                    <div style={{ marginTop: 4 }}> Event</div>
                                </div>
                            </button>
                        </li>

                        <li class="nav-item" role="presentation">
                            <button
                                class="nav-link"
                                id="pills-profile-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-profile"
                                type="button"
                                role="tab"
                                aria-controls="pills-profile"
                                aria-selected="false"
                            >
                                <img src={lectureImg2} className="me-1" alt="" /> Lecture
                            </button>
                        </li>
                    </ul>

                    <div class="tab-content mt-2" id="pills-tabContent">
                        <div
                            class="tab-pane fade show active"
                            id="pills-home"
                            role="tabpanel"
                            aria-labelledby="pills-home-tab"
                            tabindex="0"
                        >
                            {buddy?.events?.length ? (
                                buddy?.events?.map((item, index) => {
                                    return (
                                        <p className={`border-bottom mb-0 mt-3 pb-0 `} key={index}>
                                            Revive your connection:{" "}
                                            {item?.favoriteId?.eventName
                                                ? item?.favoriteId?.eventName
                                                : "Data not found"}{" "}
                                            <br></br>
                                            <p className="mb-0 ps-0" style={{ marginTop: 8 }}>
                                                Orgnaization :{" "}
                                                <span>
                                                    {" "}
                                                    {item?.favoriteId?.userId?.email == "admin@gmail.com"
                                                        ? "Administrator"
                                                        : "Not found"}
                                                </span>
                                            </p>
                                        </p>
                                    );
                                })
                            ) : (
                                <div className="text-center">No event</div>
                            )}
                        </div>

                        <div
                            class="tab-pane fade"
                            id="pills-profile"
                            role="tabpanel"
                            aria-labelledby="pills-profile-tab"
                            tabindex="0"
                        >
                            {["1"].map(() => {
                                return (
                                    <p className="border-bottom">
                                        {/* Revive your connection: Quran Memorization of Spiritual
                    Growth <br /> Orgnaization : */}

                                        <span>
                                            Coming Soon
                                            {/* Islamic culture center */}
                                        </span>
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* ///////////////section-four///////////// */}
            <div className="container mb50" id="Availability">
                <h5>Availability</h5>
                <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12  box-section-one removing-padding ">
                    <Availbility buddy={buddy} />
                </div>
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
        </>
    );
};

export default OrgContactDetails;
