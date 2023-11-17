import React, { useState, useRef } from "react";

import colorArrowRight from "../../../asserts/images/colorArrowRight.png";

import empty from "../../../asserts/images/empty.png";
import flag from "../../../asserts/images/flag.png";

import { BsSearch, BsSortDown } from "react-icons/bs";

import { VscEye } from "react-icons/vsc";
import Toggle from "react-styled-toggle";
import { reviews } from "../OrgMyEvents/dummyArrayReviews";

export const FeedBack = () => {
  const [show, setShow] = useState(false);

  const ref = useRef(null);

  return (
    <div>
      <div id="feedback" className="cardsMain pt-5">
        <div id="aboutEvent" className="orgEventMain">
          <div className="AboutEvent">
            <div
              style={{ marginBottom: 15 }}
              className="row goalTaskHeader align-items-center "
            >
              <h2 className="col-md-2 mb-0 pe-0 ">Feedback</h2>
              <div className="navSide  col-md-10 ps-0 d-flex justify-content-start ">
                <div className="position-relative mt-2" ref={ref}>
                  <input
                    type="text"
                    className={`${show ? "searchFilterInputOpen" : "searchFilterInput"
                      } searchFilterInput py-2`}
                    placeholder={show ? "Search" : ""}
                  />
                  <span className="">
                    <BsSearch
                      className="searchSvg point"
                      onClick={() => setShow(!show)}
                      fontSize={" 22px"}
                    />
                  </span>
                </div>

                <span className="goalSectionIcons mt-1 ps-3">
                  <BsSortDown className=" point" fontSize={" 22px"} />
                </span>
              </div>
            </div>

            <div className=" createEventOrganizationModal">
              <div className="myEventsCard">
                <div className="row goalTaskHeader  align-items-center ">
                  <div className="navSide  d-flex justify-content-end">
                    <ul className="d-flex align-items-center eye-style">
                      <li>
                        <VscEye className="fs-4" />{" "}
                      </li>
                      <li className="mx-2">View by public</li>
                      <li>
                        <Toggle className="mb5" />{" "}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-12 ">
                  {reviews.map((item, index) => {
                    return (
                      <div key={index} className="myEventsCard reviewsMap mt-4">
                        <div className="py-2">
                          <h3>{item.feedback}</h3>
                        </div>

                        <div className="pt-2">
                          <p>{item.name}</p>
                        </div>

                        <div className="">
                          <h4>{item.dateTime}</h4>
                        </div>
                        <div className="replayViews mt-3">
                          <div className="replayViewText">
                            Reply to this review
                          </div>
                          <div className="d-flex align-items-center gap-4">
                            <img
                              style={{
                                width: 14,
                                height: 14,
                                position: "relative",
                                top: 2,
                              }}
                              src={flag}
                              alt="full"
                            />
                            <img
                              style={{ width: 17, height: 17 }}
                              src={empty}
                              alt="full"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="text-center mt-4 py-4">
                    <div
                      style={{ cursor: "pointer" }}
                      className="MediaEdit d-flex align-items-center justify-content-center gap-3"
                    >
                      <h4>Load more feedback</h4>
                      <img
                        style={{ width: 16.667, height: 16.66 }}
                        src={colorArrowRight}
                        alt="edit"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
