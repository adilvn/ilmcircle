import React, { useState } from "react";
import DashboardNavbar from "../../DashboardCmp/DashboardNavbar";
import "./Subscription.css";
import { SubscriptionDetails } from "./SubscriptionDetails";
import { Invoice } from "./Invoice";
import secureLocalStorage from "react-secure-storage";
import API_Routes from "../../../Routes/API_Routes";
import { showMessage } from "../../../components/reuseable/Tostify";
import { Loader } from "../../../components/reuseable/Loader";
import { useEffect } from "react";
export const Subscription = () => {
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [data, getData] = useState(false);
  return (
    <div>
      <DashboardNavbar />
      <div className="container my-5">
        <div className="row">
          <div className="col"></div>
          <div className="col-md-8">
            <div className="SubscriptionHeading">
              <h1>My Subscription</h1>
            </div>
            <div className="subNavTab mt-5">
              <ul
                class="row nav nav-pills mb-3 w-100 gx-4"
                id="pills-tab"
                role="tablist"
              >
                <li
                  class="nav-item col-6"
                  role="presentation"
                  style={{ borderRight: !show ? "1px solid #00000030" : "" }}
                >
                  <button
                    onClick={() => setShow(true)}
                    class="nav-link active me-4 w-100"
                    id="pills-home-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-home"
                    type="button"
                    role="tab"
                    aria-controls="pills-home"
                    aria-selected="true"
                  >
                    Subscription detail
                  </button>
                </li>
                <li
                  class="nav-item col-6"
                  role="presentation"
                  style={{ borderLeft: show ? "1px solid #00000030" : "" }}
                >
                  <button
                    onClick={() => setShow(false)}
                    class="nav-link  ms-1  w-100"
                    id="pills-profile-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-profile"
                    type="button"
                    role="tab"
                    aria-controls="pills-profile"
                    aria-selected="false"
                  >
                    Invoice
                  </button>
                </li>
              </ul>
              <div class="tab-content" id="pills-tabContent">
                <div
                  class="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                  tabindex="0"
                >
                  <SubscriptionDetails />
                </div>
                <div
                  class="tab-pane fade"
                  id="pills-profile"
                  role="tabpanel"
                  aria-labelledby="pills-profile-tab"
                  tabindex="0"
                >
                  <Invoice />
                </div>
              </div>
            </div>
          </div>
          <div className="col"></div>
        </div>
      </div>
    </div>
  );
};
