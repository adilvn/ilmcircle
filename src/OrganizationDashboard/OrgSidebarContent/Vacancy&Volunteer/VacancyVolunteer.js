import React, { useState, useEffect, useRef } from "react";
import { BiChevronDown, BiChevronRight, BiPlusCircle } from "react-icons/bi";
import { RxCrossCircled } from "react-icons/rx";

import '../Vacancy&Volunteer/vocancy.css'
import { useNavigate } from "react-router-dom";
import Button from "../../../components/reuseable/Button";
import './vocancy.css'
import secureLocalStorage from "react-secure-storage";
import { showMessage } from "../../../components/reuseable/Tostify";
import { Loader } from "../../../components/reuseable/Loader";
import moment from "moment";
import API_Routes from "../../../Routes/API_Routes";
import { LoadScript, GoogleMap, Autocomplete } from '@react-google-maps/api';
const apiKey = "AIzaSyCByyO3JtJCxeA23nnf-GZUzLR4DikY-0o";

function VacancyVolunteer() {
  const [modalStatus, setModalStatus] = useState(false);
  const token = secureLocalStorage.getItem('token')
  const [allVacancy, setAllVacancy] = useState([]);
  const [loader, setLoader] = useState(false);
  const [searchRole, setSearchRole] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [crossState, setCrossState] = useState(false)
  const [lengthOfVacancy, setLengthOfVacancy] = useState(0)
  const navigate = useNavigate();
  const inputMainRef = useRef(null);

  const [autocomplete, setAutocomplete] = useState(null);
  useEffect(() => {
    GetAllVacancy()
  }, [])
  useEffect(() => {
    filterEvents()
  }, [searchRole, city, country])

  useEffect(() => {
    setFilteredData(allVacancy);
  }, [allVacancy]);

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete?.getPlace();
      const addressComponents = place?.address_components || [];
      for (const component of addressComponents) {
        if (component?.types?.includes("locality")) {
          setCity(component?.long_name);

        } else if (component?.types?.includes("country")) {
          setCountry(component?.long_name);
        }
      }
      setCrossState(true)
    }
  };

  const onLoad = (autocomplete) => {
    setAutocomplete(autocomplete);
    handlePlaceSelect()
  };
  const GetAllVacancy = () => {
    setLoader(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(API_Routes.GETVACANCY, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status == 200 || result.status == 201) {
          setLoader(false)
          const reverseData = result?.data?.slice()?.reverse()
          setAllVacancy(reverseData)
          let myLength = reverseData?.length
          setLengthOfVacancy(myLength)
        } else {
          setLoader(false)
          showMessage(result?.message, 'error')
        }
      })
      .catch(error => {
        setLoader(false)
        console.log('error', error)
      });
  }
  const formattedDate = (item) => {
    return moment(item.date).format('h:mm A • MMM D YYYY');
  }
  const VacancyDropDrown = [...new Set(allVacancy.map((vacancy) => vacancy.vacancyRole))];
  let lengthData;
  const filterEvents = () => {
    let dataFilter = allVacancy;
    lengthData = dataFilter.length
    if (searchRole != '') {
      dataFilter = allVacancy.filter((item) => {
        return item.vacancyRole === searchRole
      })
    }
    if (city && country) {
      dataFilter = dataFilter.filter((item) => {
        return item.city === city && item.country === country;
      });
    }
    let myLength = dataFilter?.length
    setLengthOfVacancy(myLength)
    setFilteredData(dataFilter);
  }
  const handleClearCity = () => {
    setCity('')
    setCountry('')
    setCrossState(false)
    if (inputMainRef.current) {
      inputMainRef.current.value = '';
    }
  }
  const handleFilterChangeRole = (e) => {
    setSearchRole(e)
    setModalStatus(false)

  };
  const handleRoleDropDown = () => {
    setSearchRole('')
  }
  return (
    <div style={{ background: 'none', boxShadow: 'none' }} className="VolanteerMain">
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
                  <div className="col-md-6 col d-flex align-items-center">
                    <h5 className="main-heading-vc">All Vacancies </h5>
                  </div>
                  <div className="navSide col col-md-6 pt-sm-0 pt-2 d-flex justify-content-end pe-4">
                    <Button
                      data="Create New Vacancy"
                      icon={<BiPlusCircle className="me-2 mb-1" />}
                      class="vacancy-btn ms-3 "
                      onClick={() => {
                        navigate(`/organization-dashboard/${12}`)

                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="field mt-3 col-md-6 goalTaskDoneSection">
                <label htmlFor="name" className="font-bold pt-2 pb-3 col-3">
                  Role
                </label>
                <div>
                  <div
                    className="statusField py-2 ps-1 pe-4 point"
                    onClick={() => setModalStatus(!modalStatus)}
                  >
                    <span className="ms-2">
                      {searchRole === "" ? "Select" : searchRole}
                    </span>
                    <span className="text-end ms-5">
                      {modalStatus ? (
                        <RxCrossCircled fontSize={"20px"} onClick={handleRoleDropDown} />
                      ) : (
                        <BiChevronRight fontSize={"20px"} />
                      )}
                    </span>
                  </div>
                  <div className="volenteerDropdown">
                    {modalStatus && (
                      <div className="monthDropdown monthDropdown">
                        {VacancyDropDrown.map((item, index) => (
                          <div
                            onClick={() => handleFilterChangeRole(item)}
                            className="item"
                            key={index}
                          >
                            <div>{item} </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="field mt-3 col-md-6 goalTaskDoneSection">
                <label htmlFor="name" className="font-bold pt-2 pb-3 col-3">
                  Location
                </label>
                <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
                  <div className="position-relative"> <span className={`cross-in-city ${crossState ? 'visible' : 'hidden'}`} onClick={handleClearCity}><RxCrossCircled fontSize={"20px"} /></span>
                    <Autocomplete
                      onLoad={onLoad}
                      onPlaceChanged={handlePlaceSelect} options={{
                        types: ["(cities)"],
                      }} >
                      <input ref={inputMainRef}
                        className="inputFields w-100 form-control"
                        type="text" placeholder='Search for city' />
                    </Autocomplete>
                  </div>
                </LoadScript>
              </div>
              <div id="dateLocation" className="cardsMain py-5">
                <div id="aboutEvent" className="orgEventMain">
                  <div className="VocancySection">
                    <div className="VacancyFlex">
                      <h2>{lengthOfVacancy} Vacancies</h2>
                    </div>
                    {/* {console.log("filteredData", filteredData)} */}
                    {filteredData?.map((item, index) => (
                      <div key={index} className="col-md-12 createEventOrganizationModal mt-4">
                        <div style={{ cursor: "pointer" }} onClick={() => navigate(`/organization-dashboard/${11}`, { state: { item: item } })} className="vacancyCard">
                          <h1>{item?.title}</h1>
                          <hr className="" style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}></hr>
                          <div className="exhibitionStaffContent py-1">
                            Posted time:<span>{" "}{formattedDate(item)}</span>
                          </div>
                          <div className="exhibitionStaffContent py-1">
                            Location:<span> {item?.city},{item?.country}</span>
                          </div>
                          {item?.status && (
                            <div className="exhibitionStaffContent py-1">
                              Status:<span className={item?.status == true ? "vacancyStatus" : "vacancyStatusClose"}> {item?.status ? "Open to application" : "Closed"}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VacancyVolunteer
