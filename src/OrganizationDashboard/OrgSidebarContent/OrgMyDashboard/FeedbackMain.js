import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { FeedbackArray } from "./Dummy";
import { FaStar, FaStarHalf } from "react-icons/fa";
import rightArrow from "../../../asserts/images/rightarro.png";
import { useState } from "react";
import { useEffect } from "react";
import { Loader } from "../../../components/reuseable/Loader";
import { showMessage } from "../../../components/reuseable/Tostify";
import secureLocalStorage from "react-secure-storage";
import Rating from "../../../components/reuseable/Rating";
import API_Routes from "../../../Routes/API_Routes";
import { useNavigate } from "react-router-dom";

export const FeedbackMain = ({ orgDashboardIndex }) => {
  const [feedback, setFeedback] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    GetFeedback()
  }, [])

  const token = secureLocalStorage.getItem('token')
  const navigate = useNavigate()
  const GetFeedback = () => {
    setLoader(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(API_Routes.GETFEEDBACK, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status == 200 || result.status == 201) {
          setFeedback(result?.data)
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

  return (
    <div className="pAll-24px sectionBg">
      {loader && <div className="loaderScreen">
        <Loader />
      </div>}
      <div className="header d-flex justify-content-between">
        <h3>Feedback</h3>
        <img
          src={rightArrow}
          width={24}
          height={24}
          alt=""
          className="pointer"
          onClick={() => {
            navigate(`/organization-dashboard/${5}`, {
              state: {
                goto: true
              }
            })


          }}
        />
      </div>

      <div className="row allItemMain feedbackRow gx-3">
        {feedback.length ? feedback?.map((item, index) => (
          <div key={index} className="col-lg-6 ">
            <div className="itemFeedback">
              {item?.rating &&
                <div className="mainRating d-flex align-items-center gap-2">
                  <div>
                    <div className='ratingstarNumber'>
                      <Rating rating={item?.rating} />
                      <div className='ratingNumber'>
                        {item?.rating}/5
                      </div>
                    </div>
                  </div>
                  {/* <p className="mb-0 totalRating pt-2">
                {item.rating == 4 ? "4.8" : item.rating}/5
              </p> */}
                </div>}

              <p className="mb-0 content justy-words-class">{item?.feedback}</p>
              <div className="d-flex align-items-center ">
                <img style={{ borderRadius: 24 }} src={item?.userId?.userDetailId?.image?.url} alt="url1" />
                <h3 className="name pt-2 ms-2">{item?.userId?.userDetailId?.firstName} {item?.userId?.userDetailId?.lastName}</h3>
              </div>
            </div>
          </div>

        ))
          :
          <div className='MediaEdit d-flex align-items-center justify-content-center '>
            <h4>No Feedback Found</h4>
          </div>
        }
      </div>
    </div>
  );
};


