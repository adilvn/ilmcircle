import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsFillPinAngleFill } from "react-icons/bs";
import eventclasspin from '../../../asserts/images/eventclasspin.png'
import eventclassWhitepin from '../../../asserts/images/pinwhite.svg'

export const EventCard = ({ item, index }) => {
  const { cardImg, content, student, category } = item;
  return (
    <>
      <div class={`card eventCard `}>
        <img src={cardImg} class={`card-img-top `} alt="..." />
        <div class="card-body">
          <h3 class="card-title">{content}</h3>
          <p class="card-text my-2">
            <span>Category</span> :
            <span
              className={`categoryName ${category == "Quran" ? "categoryName2" : ""
                } px-2 pt-1 ms-2 pb-2`}
            >
              <img src={item?.categoryImg} alt="" /> {category}
            </span>
          </p>
          <p className="my-2 mt-2">
            Student :
            <span className="ms-3">
              {student?.map((item, index) => (
                <div key={index}>
                  <img src={item} className="" alt="" />
                </div>
              ))}
            </span>
          </p>
        </div>
        {index != 2 ? (
          <div className="text-end pe-2 position-absolute top-0 end-0 mt-2">

            <img style={{ width: 20, height: 20 }} src={eventclasspin} alt="eventclasspin" />

            <AiOutlineClose
              className="mx-3 point"
              fontSize={"24px"}
              color="#252727C7"
            />
          </div>
        ) : (
          ""
        )}
        <div
          className={`div  ${index == 2 ? "overlayclassFinished pt-1" : ""}`}
        >
          {index == 2 ? (
            <>
              <div className="text-end pe-2 position-absolute top-0 end-0 mt-2">

                <img src={eventclassWhitepin} alt="eventclassWhitepin" />

                <AiOutlineClose
                  className="mx-2 point"
                  fontSize={"24px"}
                  color="white"
                />
              </div>
              <p className="classFinished text-white">Class finished</p>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
