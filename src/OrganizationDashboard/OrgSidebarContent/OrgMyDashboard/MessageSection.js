import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { messageArray } from "./Dummy";
import { AiOutlineRight } from "react-icons/ai";
import rightArrow from '../../../asserts/images/rightarro.png'
import { useNavigate } from "react-router-dom";

export const MessageSection = ({ orgDashboardIndex }) => {
  const navigate = useNavigate()

  return (
    <div className="pAll-24px sectionBg">
      <div className="header d-flex justify-content-between">
        <h3>Messages</h3>
        <img src={rightArrow} width={24} height={24} alt="" className="pointer"
          onClick={() => {
            navigate(`/organization-dashboard/${8}`)


          }}
        />
      </div>

      <div className="allItemMain">
        {messageArray.length ? messageArray.map((item) => (
          <div className="itemMessage d-flex align-items-center justify-content-between">
            <div className="d-flex ">

              <div class="position-relative">
                <img src={item.img} alt="" />
                <span class="smallCardDot"></span>
              </div>

              <div className="ps-3">
                <h4 className="name mb-0">{item.name}</h4>
                <p className="mb-0 content">{item.text}</p>
              </div>
            </div>
            <div className="text-center">
              <h4 className="mb-0 content">
                {item.time}
                <br />
                <span className="innerText mb-0">3</span>
              </h4>
            </div>
            <AiOutlineRight />
          </div>
        ))
          :
          <div className='MediaEdit mt-3 d-flex align-items-center justify-content-center '>
            <h4>No Data Found</h4>
          </div>
        }
      </div>
    </div>
  );
};


