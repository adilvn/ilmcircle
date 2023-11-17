import React from "react";
import { BiPlusCircle } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import EditIcon from "../../../asserts/images/orgEditIcon.png";
import "./Projects.css";
import { actionCreaters } from "../../../Store/Index";
import Button from "../../../components/reuseable/Button";
import { Loader } from "../../../components/reuseable/Loader";
import { useState } from "react";
import secureLocalStorage from "react-secure-storage";
import API_Routes from "../../../Routes/API_Routes";
import { showMessage } from "../../../components/reuseable/Tostify";
import { useEffect } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export const AllProjects = () => {
  const dispatch = useDispatch();
  const { orgDashboardIndex } = bindActionCreators(actionCreaters, dispatch);
  const [loader, setLoader] = useState(false);
  const [projects, setProjects] = useState([]);

  const token = secureLocalStorage.getItem('token')
  const navigate = useNavigate();

  const DaysLeftMethod = (item) => {
    // Parse the deadline using the correct format ('MM/DD/YYYY')
    const deadlineDate = moment(item?.deadline, 'MM/DD/YYYY');

    // Calculate the number of days left until the deadline
    const currentDate = moment();
    return deadlineDate.diff(currentDate, 'days');
  }

  useEffect(() => {
    GetAllProject()
  }, [])

  const GetAllProject = () => {
    setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(API_Routes.ORGALLPROJECTS, requestOptions)
      .then(response => response.json())
      .then(result => {
        // console.log('ALLPROJECTS--===>', result)
        if (result.status == 200 || result.status == 201) {
          setLoader(false);
          setProjects(result?.data)
        } else {
          setLoader(false);
          showMessage(result?.message, 'error');
        }
      })
      .catch(error => {
        setLoader(false);
        console.log('error', error)
      });
  }

  const formattedDate = (item) => {
    return moment(item?.createDate).format('h:mm A • MMM D YYYY');
  }
  return (
    <div
      style={{ background: "none", boxShadow: "none" }}
      className="VolanteerMain"
    >
      {loader && <div className="loaderScreen">
        <Loader />
      </div>}
      <div className="container-fluid  ">
        <div className="row">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <div
              className="goalTask"
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              <div className="goalTaskHeader ">
                <div className="row ">
                  <div className="col-sm-6 col d-md-flex align-items-center">
                    <h5 className="main-heading-vc">All Projects</h5>
                  </div>
                  <div className="navSide col col-sm-6 pt-sm-0 pt-2 d-flex justify-content-end pe-4">
                    {/* <Link to={'/createnew'}> */}
                    <Button
                      data="Create new project"
                      icon={<BiPlusCircle className="me-2 mb-1" />}
                      class="vacancy-btn ms-3 "
                      onClick={() => {
                        navigate(`/organization-dashboard/${13}`)
                      }}
                    />
                    {/* </Link> */}
                  </div>
                </div>
              </div>
            </div>
            {projects?.length ?
              <div className="allProjectsMain">
                <div className="subMain">
                  <div className="d-flex align-items-center justify-content-between">
                    <h6 className="mainText">
                      Summary of the project and fundraising section on Event page
                    </h6>
                    <img
                      src={EditIcon}
                      alt=""
                      style={{ width: "29px", height: "29px" }}
                    />
                  </div>
                  <div className="shadowBg mainContent">
                    To better transmit the islamic culture, we need your generous
                    help! Here are some ongoing projects waiting for you to
                    explore!
                  </div>
                </div>
                <div className="bottomSection">
                  <h3>{projects.length} Projects</h3>

                  {projects?.map((item, index) => {
                    const donateAmount = item?.donateAmount;
                    const totalAmount = item?.totalAmount;
                    const percentage = Math.min((donateAmount / totalAmount) * 100, 100);

                    return <div key={index}>
                      <div
                        className="shadowBg bottomContext pointer mb-3"
                        onClick={() => {
                          navigate(`/organization-dashboard/${14}`, {
                            state: { item: item }
                          });
                        }}
                      >
                        <h4 className="projectHeading">
                          {item?.title}
                        </h4>
                        {item?.createDate &&
                          <p className="mb-0 projectTime">
                            Posted time: {" "}
                            <span className="fw-bold">{formattedDate(item)}</span>
                          </p>

                        }

                        <div className="mt-3 mb-3 projectCultureDown">
                          <div className="d-flex justify-content-between my-1">
                            <p className="mb-0 ">
                              Raised <span>{item?.currency == "Euro" ? "€" : "$"} {item?.donateAmount}</span>/{item?.totalAmount}
                            </p>
                            <span>{percentage.toFixed(0)}%</span>
                          </div>
                          <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
                            <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <p className=" text-end my-1" style={{ fontSize: "14px" }}>
                            <span style={{ fontSize: "14px" }}>{item?.pattrons}</span> pattrons,{" "}
                            <span style={{ fontSize: "14px" }}>{item.deadline ? DaysLeftMethod(item) : 0}</span> days left
                          </p>
                        </div>
                      </div>
                    </div>
                  })


                  }


                  {/* <div className="shadowBg bottomContext mt-4">
                  <h4 className="projectHeading">
                    Empowering Our Community: Building a Stronger Future
                    Together
                  </h4>

                  <p className="mb-0 projectTime">
                    Posted time:
                    <span className="fw-bold">20:00 PM • May 27 2023</span>
                  </p>

                  <div className="mt-3 mb-3 projectCultureDown">
                    <div className="d-flex justify-content-between my-1">
                      <p className="mb-0 ">
                        Raised <span>$450</span>/500
                      </p>
                      <span>90%</span>
                    </div>
                    <div
                      class="progress "
                      role="progressbar"
                      aria-label="Basic example"
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div class="progress-bar" style={{ width: "90%" }}></div>
                    </div>
                    <p className=" text-end my-1" style={{ fontSize: "14px" }}>
                      <span style={{ fontSize: "14px" }}>120</span> pattrons,{" "}
                      <span style={{ fontSize: "14px" }}> 3 </span>days left{" "}
                    </p>
                  </div>
                </div> */}
                </div>
              </div>

              :

              <div className='MediaEdit d-flex align-items-center justify-content-center '>
                <h4>No Project Found</h4>
              </div>}
          </div>
        </div>
      </div>
    </div>
  );
};
