import React, { useState } from "react";
import "../sliders/testimonel.css";

//------------Dummay Array------------//
import { Data } from "../../constant/Dummay";

//-----------------libaray-------------//
import { ReactSVG } from "react-svg";
import { CgQuote } from "react-icons/cg";
import Slider from "react-slick";

//-----------------components-----------//
import Rating from "../reuseable/Rating";

const Testimonel = ({ data, heading }) => {
  const [rate, setRate] = useState([]);
  var settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    className: "center",
    swipeToSlide: true,
    centerMode: true,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          // dots: true
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div>
      <Slider {...settings}>
        {data[0]?.customerData?.data?.map((item, i) => {
          return (
            <div key={i} className="slide-dev mt-5">
              <div className="card-design">
                <div className="card-body">
                  <div>
                    <p>
                      <CgQuote />
                      {item?.content}
                      <CgQuote />
                    </p>
                  </div>
                  <div className="rating">
                    <Rating rating={item.rating} onClick={(i) => setRate(i)} />
                  </div>

                  <div className="d-sm-flex d-block align-items-center bottom-card">
                    <div >
                      {item?.image?.url && <img style={{ width: 40, height: 40 }} src={item?.image?.url} />}
                    </div>
                    <div className="pading">
                      <small className="text-bold">{item?.name}</small>
                      <br />
                      <small>{item?.role}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default Testimonel;



