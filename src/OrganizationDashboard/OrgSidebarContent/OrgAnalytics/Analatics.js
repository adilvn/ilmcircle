import React, { useState } from "react";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import "./analytics.css";
import { AnalyticSectionGraph } from "./AnalyticSectionGraph";
import secureLocalStorage from "react-secure-storage";
import { Loader } from "../../../components/reuseable/Loader";
import { showMessage } from "../../../components/reuseable/Tostify";
import { useEffect } from "react";
import API_Routes from "../../../Routes/API_Routes";
function Anylatics() {
  const [product, setProduct] = useState({});
  const [modalCategory, setModalCategory] = useState(false);
  const [data, setData] = useState('');

  const [loader, setLoader] = useState(false);
  const token = secureLocalStorage.getItem('token')
  const dataDrop = [
    "last 30 days",
    "Yesterday",
    "Today",
    "This month",
    "Custom",
  ];


  useEffect(() => {
    GetAnalyticsData()
  }, [])

  const GetAnalyticsData = () => {
    setLoader(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(API_Routes.GETANALYTICS, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status == 200 || result.status == 201) {
          setLoader(false);
          // setProjects(result?.data)
          setData(result?.data)
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
  return (
    <div className="analyticsMainSection">
      {loader && <div className="loaderScreen">
        <Loader />
      </div>}
      <div className="pAll-24px ">
        <div className="row header d-flex justify-content-between">
          <h3 className="col-sm-6">Analytics</h3>
          <div className="col-sm-6  d-flex align-items-center justify-content-end">
            {data ?
              <div className="w-50  position-relative  me-3">
                <div
                  className="statusField py-2 px-2  d-flex justify-content-between shadowBorder"
                  onClick={() => setModalCategory(!modalCategory)}
                >
                  <span className="me-0">
                    {product.category ? product.category : "Select"}
                  </span>
                  <span className="">
                    {modalCategory ? (
                      <BiChevronDown fontSize={"20px"} />
                    ) : (
                      <BiChevronRight fontSize={"20px"} />
                    )}
                  </span>
                </div>
                {modalCategory ? (
                  <div
                    className="categroyDropDown  mt-2 position-absolute w-100"
                    style={{ backgroundColor: "#fcfcfc" }}
                  >
                    {dataDrop.map((item) => (
                      <div
                        className="categoryGoal my-2 point"
                        onClick={() => {
                          setProduct({ category: item });
                          setModalCategory(false);
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div> : ""
            }
          </div>
        </div>
        {data ?
          <div>

            <div className="row analyticSectionMain mt-5">
              <div className="col-sm-3 analyticItem text-center p-0 py-2 ">
                <h5 className="text my-1">Events</h5>
                <h6 className="number my-1">{data?.totalEvents}</h6>
                <p style={{ color: "#B73838" }} className="percent my-1">
                  -50%
                </p>
              </div>
              <div className="col-sm-3 analyticItem2 text-center p-0 py-2  ">
                <h5 className="text my-1">Visits</h5>
                <h6 className="number my-1">{data?.totalVisits}</h6>
                <p className="percent my-1">+100%</p>
              </div>
              <div className="col-sm-3 analyticItem3 text-center p-0 py-2 ">
                <h5 className="text my-1">People interested</h5>
                <h6 className="number my-1">{data?.totalIntrested}</h6>
                <p className="percent my-1">+23%</p>
              </div>
              <div className="col-sm-3 analyticItem4 text-center p-0 py-2 ">
                <h5 className="text my-1">People attended</h5>
                <h6 className="number my-1">200</h6>
                <p style={{ color: "#B73838" }} className="percent my-1">
                  -0.1%
                </p>
              </div>
            </div>

            <AnalyticSectionGraph />
          </div>
          :
          <div className='MediaEdit mt-5 d-flex align-items-center justify-content-center '>
            <h4>No Analytics Found</h4>
          </div>
        }
      </div>
    </div>
  );
}

export default Anylatics;
