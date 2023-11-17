import React from "react";
import { EventOrganizer } from "./EventOrganizer";
import Event from "./TabsSection/Event";
import "./TabsSection/TabSection.css";
import About from "./TabsSection/About";
import { Library } from "./TabsSection/Library";
import { Vovancy } from "./TabsSection/Vovancy";
import { Project } from "./TabsSection/Project";
export const NavsTabs = ({ data, id }) => {

  return (
    <div>
      <div className="container-fluid">
        <div className="subNavTab  mt-5">
          <div className="eventNavTab sticky-top pt-3">
            <div className="container">
              <ul
                class="row align-items-center justify-content-center nav nav-pills mb-3 w-100 mx-0 "
                id="pills-tab"
                role="tablist"
              >
                <li class="nav-item col-lg-2 col col-12 col-sm-4" role="presentation">
                  <button
                    class="nav-link active w-100"
                    id="pills-home-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-home"
                    type="button"
                    role="tab"
                    aria-controls="pills-home"
                    aria-selected="true"
                  >
                    About Us
                  </button>
                </li>
                <li class="nav-item col-lg-2 col col-12 col-sm-4 " role="presentation">
                  <button
                    class="nav-link w-100"
                    id="pills-Library-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-Library"
                    type="button"
                    role="tab"
                    aria-controls="pills-Library"
                    aria-selected="false"
                  >
                    Library
                  </button>
                </li>
                <li class="nav-item col-lg-2 col col-12 col-sm-4 " role="presentation">
                  <button
                    class="nav-link w-100"
                    id="pills-Event-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-Event"
                    type="button"
                    role="tab"
                    aria-controls="pills-Event"
                    aria-selected="false"
                  >
                    Event
                  </button>
                </li>
                <li class="nav-item col-lg-3 col col-12  mt-0 mt-sm-3 mt-lg-0 col-sm-5 col-md-4" role="presentation">
                  <button
                    class="nav-link w-100"
                    id="pills-Project-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-Project"
                    type="button"
                    role="tab"
                    aria-controls="pills-Project"
                    aria-selected="false"
                  >
                    Project & Fundraising
                  </button>
                </li>
                <li class="nav-item col-lg-3 col col-12 mt-0 mt-sm-3 mt-lg-0 col-sm-5 col-md-4" role="presentation">
                  <button
                    class="nav-link w-100"
                    id="pills-Vavancy-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-Vavancy"
                    type="button"
                    role="tab"
                    aria-controls="pills-Vavancy"
                    aria-selected="false"
                  >
                    Vacancies & Volunteers
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="row gy-5 mx-lg-5 align-items-start justify-content-between">
            <div className="col-md-6 px-3 ">
              <div class="tab-content" id="pills-tabContent">
                <div
                  class="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                  tabindex="0"
                >
                  <About aboutData={data} id={id} />
                </div>
                <div
                  class="tab-pane fade"
                  id="pills-Library"
                  role="tabpanel"
                  aria-labelledby="pills-Library-tab"
                  tabindex="0"
                >
                  {" "}
                  <Library id={id} />
                </div>
                <div
                  class="tab-pane fade"
                  id="pills-Event"
                  role="tabpanel"
                  aria-labelledby="pills-Event-tab"
                  tabindex="0"
                >
                  <Event id={id} />
                </div>
                <div
                  class="tab-pane fade"
                  id="pills-Project"
                  role="tabpanel"
                  aria-labelledby="pills-Project-tab"
                  tabindex="0"
                >
                  <Project id={id} />
                </div>
                <div
                  class="tab-pane fade"
                  id="pills-Vavancy"
                  role="tabpanel"
                  aria-labelledby="pills-Vavancy-tab"
                  tabindex="0"
                >
                  <Vovancy id={id} />
                </div>
              </div>
            </div>
            <div className="col-md-6 p-md-0 px-3">
     
              <EventOrganizer aboutData={data} id={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
