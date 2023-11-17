import React, { useState, useEffect } from "react";
import "./feedback.css";
import OrgReview from "../OrgMyEvents/OrgReview";
import OrgFeedBack from "../OrgMyEvents/OrgFeedBack";
import OrgFeedbackMain from "./OrgFeedbackMain";
import OrgReviewsMain from "./OrgReviewsMain";
import secureLocalStorage from "react-secure-storage";
import { useLocation, useNavigate } from "react-router-dom";
export const OrgReviewsFeedback = () => {
  const [show, setShow] = useState(false);
  const role = secureLocalStorage.getItem("role");
  const token = secureLocalStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (role != "organization") {
      navigate("/")
    }

  }, [])
  const location = useLocation()
  const showFeedbackOption = location.state

  useEffect(() => {
    showFeedbackOption && setShow(false)
  }, [])

  return (
    <>
      {role == "organization" ?
        <div className="py-5">
          <div className="padding-Start-135">
            <div className="ro">
              <div className="col-lg-6">
                <div className="SubscriptionHeading ">
                  <h5>Review and Feedback</h5>
                </div>
                <div className="ReviwsandFeedbackTabs mt-5">
                  <ul
                    class="row nav nav-pills mb-3 w-100 gx-4"
                    id="pills-tab"
                    role="tablist"
                  >
                    <li class="nav-item col-6" role="presentation" style={{ borderRight: !show ? "1px solid #00000030" : "" }}
                    >
                      <button
                        onClick={() => setShow(true)}
                        class={`nav-link ${!showFeedbackOption?.goto && "active"} me-4 w-100`}
                        id="pills-home-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-home"
                        type="button"
                        role="tab"
                        aria-controls="pills-home"
                        aria-selected={!showFeedbackOption}

                      >
                        Review
                      </button>
                    </li>
                    <li
                      class="nav-item col-6"
                      role="presentation"
                      style={{ borderLeft: show ? "1px solid #00000030" : "" }}
                    >
                      <button
                        onClick={() => setShow(false)}
                        class={`nav-link ${showFeedbackOption?.goto && "active"}  ms-1  w-100`}
                        id="pills-profile-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-profile"
                        type="button"
                        role="tab"
                        aria-controls="pills-profile"
                        aria-selected={showFeedbackOption}


                      >
                        Feedback
                      </button>
                    </li>
                  </ul>
                  <div class="tab-content" id="pills-tabContent">
                    <div
                      class={`tab-pane fade  ${!showFeedbackOption?.goto && " show active"}`}
                      id="pills-home"
                      role="tabpanel"
                      aria-labelledby="pills-home-tab"
                      tabindex="0"
                    >
                      {/* <SubscriptionDetails /> */}
                      <OrgReviewsMain />

                    </div>
                    <div
                      class={`tab-pane fade ${showFeedbackOption?.goto && "show active"}`}
                      id="pills-profile"
                      role="tabpanel"
                      aria-labelledby="pills-profile-tab"
                      tabindex="0"
                    >
                      {/* <Invoice /> */}
                      <OrgFeedbackMain />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        : ""
      }
    </>
  );
};
