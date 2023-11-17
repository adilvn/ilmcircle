import React, { useEffect } from "react";
import img from "../../../../asserts/images/profile.png";
import { FiMail } from "react-icons/fi";
import { BsArrowRight, BsTelephone } from "react-icons/bs";
import Button from "../../../../components/reuseable/Button";
import { useState } from "react";
import { DonateModel } from "./DonateModel";
import secureLocalStorage from 'react-secure-storage';
import API_Routes from "../../../../Routes/API_Routes";
import moment from "moment";

export const Project = ({ id }) => {
  const [showModal, setShowModal] = useState(false);
  const [funding, setFunding] = useState(1);
  const [displayedProjects, setDisplayedProjects] = useState(1);
  const [projectsID, setProjectsID] = useState('');

  const [data, setData] = useState([]);

  const [sedingTitle, setSendingTitle] = useState("")

  const handleModal = (item) => {
    setProjectsID(item?._id)
    setShowModal(!showModal);
    setSendingTitle(item?.title)
  }

  const token = secureLocalStorage.getItem('token')
  useEffect(() => {
    GetProjects(id)
  }, [])

  const GetProjects = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(API_Routes.GETADMINPROJECTS + id, requestOptions)
      .then(response => response.json())
      .then(result => {
        // console.log('result===>', result)
        setData(result?.data)
      })
      .catch(error => console.log('error', error));
  }


  const handleLoadMoreProjects = () => {
    setDisplayedProjects(data?.length);
  };

  const DaysLeftMethod = (item) => {

    const deadlineDate = moment(item?.deadline, 'MM/DD/YYYY');


    const currentDate = moment();
    return deadlineDate.diff(currentDate, 'days');
  }

  return (
    <div className="mt-5">
      <div className="">
        <h5 className="vavncyHeading">Project & Fundraising</h5>
        {funding == 0 ? (
          <div className="d-lg-flex justify-content-center align-items-center py-lg-5 ">
            <div className="fundingBgImage d-lg-flex justify-content-center align-items-center">
              <h4>There is no project or fundraising yet.</h4>
            </div>
          </div>
        ) : (
          <div className="cultreBgAll mt-4 pb-4">
            <p className="topText p-4">
              To better transmit the islamic culture, we need your generous
              help! Here are some ongoing projects waiting for you to explore!
            </p>
            {data?.length ? data.slice(0, displayedProjects).map((item, index) => {
              // { console.log('getPAtronsData', item) }
              const donateAmount = item?.donateAmount;
              const totalAmount = item?.totalAmount;
              const percentage = Math.min((donateAmount / totalAmount) * 100, 100);

              return <div className="cultureProject" key={index}>

                <div className="subCultureProject">
                  <div className="innerCultureProject d-flex flex-wrap flex-md-wrap flex-xl-nowrap">
                    <img className="pe-lg-3" src={img} alt="" />
                    <div className="ps-3 mt-3 mt-xl-0">
                      <h3>{item?.title}</h3>
                      <p className="subText mb-0">
                        {item?.about}
                      </p>
                      <span>
                        <p className="vovancyIcon mb-0">
                          <FiMail />
                          <span className="ms-3">{item?.email}</span>
                        </p>
                        <p className="vovancyIcon mb-0">
                          <BsTelephone />
                          <span className="ms-3">{item?.phone}</span>
                        </p>
                      </span>
                    </div>
                  </div>
                  <div className="mt-5 mb-3 px-4 projectCultureDown">
                    <div className="d-flex justify-content-between my-1">
                      {" "}
                      <p className="mb-0 ">
                        Raised <span>{item?.currency == "Euro" ? "€" : "$"} {item?.donateAmount.toFixed(2)}</span>/{item?.totalAmount}
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
                    <div className="text-center mt-5 mb-3">
                      <Button
                        class={"profile-btn w-50 h-25 py-2"}
                        data={"Donate"}
                        onClick={() => handleModal(item)}
                      />
                    </div>
                  </div>
                </div>

              </div>
            }) :
              <div className='MediaEdit d-flex align-items-center justify-content-center '
              >
                <h4>No Projects Found</h4>
              </div>

            }
            {displayedProjects < data?.length && (

              <p onClick={handleLoadMoreProjects}
                className="seeallMember point my-4 text-center fs-6">
                Show all projects <BsArrowRight />
              </p>
            )}
          </div>
        )}
      </div>

      <DonateModel id={id} GetProjects={GetProjects} projectsID={projectsID} setShowModal={setShowModal} showModal={showModal} handleModal={handleModal} sedingTitle={sedingTitle} />

    </div>
  );
};
