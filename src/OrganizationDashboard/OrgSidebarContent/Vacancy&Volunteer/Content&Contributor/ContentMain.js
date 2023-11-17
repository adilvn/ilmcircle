import React, { useState } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import "./ContentMain.css";
import { JobDescription } from "./JobDescription";
import { MdOutlineModeEdit } from "react-icons/md";
import { VacancyManagement } from "./VacancyManagement";
import { Applicant } from "./Applicant";
import { bindActionCreators } from "redux";
import { actionCreaters } from "../../../../Store/Index";
import { useDispatch, useSelector } from "react-redux";
import deleteIcon from '../../../../asserts/images/deleteIcon.png'
import orgEditIcon from '../../../../asserts/images/orgEditIcon.png'
import secureLocalStorage from "react-secure-storage";
import { Loader } from "../../../../components/reuseable/Loader";
import { useLocation, useNavigate } from "react-router-dom";


export const ContentMain = () => {
  const dispatch = useDispatch();
  // const selectedItem = useSelector((state) => state?.selectedIndex);
  const location = useLocation()
  // console.log('locationData', location?.state?.item)
  const selectedItem = location?.state
  const { orgDashboardIndex } = bindActionCreators(actionCreaters, dispatch);
  const [edit, setEdit] = useState(false);
  const [showModal, setModal] = useState();
  const [loader, setLoader] = useState(false);
  const token = secureLocalStorage.getItem('token')

  // ValentierPage2(showModal)
  const EditReverse = () => {
    setEdit(false)
  }
  const navigate = useNavigate();



  return (
    <div className="container-fluid pt-5">
      {loader && <div className="loaderScreen">
        <Loader />
      </div>}
      <div className="contentContributorMain" >
        <div className="row">
          <div className="col-lg-7">
            <div className="headerSection">
              <a onClick={() => {
                navigate(`/organization-dashboard/${4}`)


              }} className="vc-allvc vc-cursor me-3">
                All Vacancies
              </a>
              <AiOutlineRight className="vc-allvc" fontSize={"22px"} />
              <a className="ms-3 vc-allvc">Vacancy Detail</a>

              <div className="subNavTab">
                <JobDescription selectedItem={selectedItem} edit={edit} ReverseEdit={EditReverse} />

                {/* <VacancyManagement />
                
                    <Applicant /> */}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default ContentMain