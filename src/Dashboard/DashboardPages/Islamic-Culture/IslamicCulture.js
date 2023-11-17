import React from "react";
import "./IslamicCulture.css";
import img from "../../../asserts/images/Rectangle.png";
import download from "../../../asserts/images/download.svg";
import heart from "../../../asserts/images/downhert.svg";
import { BsPerson } from "react-icons/bs";
import { FiLink2 } from "react-icons/fi";
import { HiOutlineUsers, HiOutlineLocationMarker } from "react-icons/hi";
import { ReactSVG } from "react-svg";
import DashboardNavbar from "../../DashboardCmp/DashboardNavbar";
import { NavsTabs } from "./NavsTabs";
import Button from "../../../components/reuseable/Button";
import { useParams } from "react-router-dom";
import { Loader } from "../../../components/reuseable/Loader";
import secureLocalStorage from "react-secure-storage";
import API_Routes from "../../../Routes/API_Routes";
import { useState } from "react";
import { useEffect } from "react";
import { showMessage } from "../../../components/reuseable/Tostify";
import LikeButton from "../../DashboardCmp/Likebutton";

export const IslamicCulture = () => {
  const { id } = useParams();

  const token = secureLocalStorage.getItem("token");
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState("");
  const [memberOfOrganization, setMemberOfOrganization] = useState([])
  const [nonMemberOfOrganization, setNonMemberOfOrganization] = useState([])




  const [items, setItems] = useState([]);


  useEffect(() => {
    GetEventsData()
  }, [])
  const GetEventsData = () => {
    setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(API_Routes.GETISLAMICULTUREPROFILEDATA + id, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result?.status === 200) {
          setData(result?.data)
          const membersArray = result?.data?.userId?.member?.filter(item => item?.role && item?.role?.toLowerCase()?.includes('member'));
          const nonMembersArray = result?.data?.userId?.member?.filter(item => !item?.role || !item?.role?.toLowerCase()?.includes('member'));
          setMemberOfOrganization(membersArray)
          setNonMemberOfOrganization(nonMembersArray)
          setLoader(false);
        } else {
          setLoader(false);
          showMessage(result?.message)

        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });
  }


  return (
    <div className="islamicCultureEvent mb-5">
      {loader && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <DashboardNavbar />
      <div className="mainHeader p-4">
        <div className="row align-items-start g-4">
          <div className="col col-xl-4 col-lg-5 col-md-6 d-flex justify-content-center">
            <div>
              <img className="w-100"
                // src={ data?.image?.url}
                src={img}

                alt="" />
            </div>
          </div>
          <div className="col-lg-6 col-md-6 pt-3 ">
            <div className="d-flex align-items-center islamic-culture justify-content-between">
              <h2>{data?.orgName}</h2>
              <div className="cultureIcons">
                {/* <ReactSVG src={heart} className="point p10" /> */}
                <LikeButton
                  userId={id}
                  initialLiked={data?.isFavorite}
                  // handleLike={(item) => handleLike(item)}
                  runData={true}
                  name="Organization"
                  GetEventsData={GetEventsData}
                  showlarge={false}

                />
                <ReactSVG src={download} className="point p10" />
              </div>
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
                  {nonMemberOfOrganization?.length && (nonMemberOfOrganization?.length === 2) ? " and " + (nonMemberOfOrganization?.length - 1) + " other" : ""}
                </span>
              </p>
              <p>
                <span>
                  <HiOutlineUsers />
                </span>
                <span className="ms-3">{memberOfOrganization?.length ? memberOfOrganization?.length : 0} members</span>
              </p>
              <p>
                <span>
                  <HiOutlineLocationMarker />
                </span>
                <span className="ms-3">
                  {data?.address}
                </span>
              </p>
              <p>
                <span>
                  <FiLink2 />
                </span>
                <span className="ms-3">{data?.website}</span>
              </p>

              <Button class={"profile-btn"} data={"Contact us"} />


            </div>
          </div>
        </div>
      </div>
      <div className="navTabEventSection ">
        <NavsTabs data={data} id={id} />
      </div>
    </div>
  );
};

