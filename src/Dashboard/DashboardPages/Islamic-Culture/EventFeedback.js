import React, { useState } from "react";
import img from "../../../asserts/images/g8.svg";
import { AiOutlineStar } from "react-icons/ai";
import Button from "../../../components/reuseable/Button";
import { Loader } from "../../../components/reuseable/Loader";
import API_Routes from "../../../Routes/API_Routes";
import secureLocalStorage from "react-secure-storage";
import StarRating from "./StarRating";
import { showMessage } from "../../../components/reuseable/Tostify";

const EventFeedback = (props) => {
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const token = secureLocalStorage.getItem("token");

  const eventdetailData = props?.EventData
  const leaveFeedback = () => {
    setLoader(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    var formdata = new FormData();
    formdata.append("feedback", comment);
    formdata.append("eventId", eventdetailData._id);
    formdata.append("rating", rating);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(API_Routes.LEAVEFEEDBACK, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result?.status === 200 || result?.status === 201) {
          setComment('')
          setRating(0)
          setLoader(false);
          showMessage(result?.message)
        } else {
          setLoader(false);
          showMessage(result?.message, 'error')

        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });
  }


  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };
  return (
    <div className={`eventFeedback  mb-3 pt-4 ${props.class1 ? "" : "mt-5"}`}>
      {loader && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <h5>Leave feedback</h5>
      <div className={`shadow py-3 border islamicCultureBox `}>
        <div className={`eventRating ps-3 pe-4  my-2 ${props.class2}`}>
          <p className={props.class3}>Rate the service:</p>

          <div className="d-flex justify-content-between">

            <StarRating
              className="star-rating"
              rating={rating}
              isEdit={true}
              onRatingChange={handleRatingChange}
            />
            <p className={`${props.class3} pt-2 ps-sm-2 p-0  font-size`}  >{rating}/5</p>
          </div>
        </div>
        <hr />
        <div className="eventComment ps-3 pe-4 mt-4 pt-1">
          <p className="">Any Comments?</p>
          <div className="d-flex justify-content-between  align-items-center">
            <div>
              <textarea
                placeholder="Tell us about your experience during the event."
                className=" px-2"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>
            <img className="d-block" src={img} alt="" style={{ width: "155px", height: "128px" }} />
          </div>
          <div className="text-center mt-4">
            <Button onClick={() => leaveFeedback()} style={{ width: 105, borderRadius: 14 }} class={"profile-btn feed-btn"} data={"Submit"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventFeedback;
