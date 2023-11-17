/* Changed */
import React, { useState } from "react";
import { InputField } from "./InputField";
import { AiOutlineMail } from "react-icons/ai";
import './ContentMain.css'
import { BiPhone } from "react-icons/bi";
import Buttons from "../../../../components/reuseable/Button";
import { useEffect } from "react";
import { Loader } from "../../../../components/reuseable/Loader";
import { showMessage } from "../../../../components/reuseable/Tostify";
import secureLocalStorage from "react-secure-storage";
import deleteIcon from '../../../../asserts/images/deleteIcon.png'
import orgEditIcon from '../../../../asserts/images/orgEditIcon.png'
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { bindActionCreators } from "redux";
import { actionCreaters } from "../../../../Store/Index";
import { useDispatch } from "react-redux";
import API_Routes from "../../../../Routes/API_Routes";
import { VacancySelectInpt } from "../VacancyReuseable/VacancySelectInpt";
import { useNavigate } from "react-router-dom";
import { NewVacancySelectInput } from "../VacancyReuseable/NewVacancySelectInput";

export const JobDescription = ({ ReverseEdit, selectedItem }) => {


  const [edit, setEdit] = useState(false);

  const [loader, setLoader] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [aboutRole, setAboutRole] = useState('');
  const [skills, setSkills] = useState('');
  const [applicationProcess, setApplicationProcess] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const dispatch = useDispatch()
  const { orgDashboardIndex } = bindActionCreators(actionCreaters, dispatch);

  const navigate = useNavigate()

  const token = secureLocalStorage.getItem('token')
  // useEffect(() => {
  //   setEdit(true)
  // }, [edit])

  useEffect(() => {
    GetSingleVacancyData()
  }, [])
  const HandleEdit = () => {
    setEdit(false)
    ReverseEdit(edit)
  }

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
    // setOpenDelete(false)
  };


  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const GetSingleVacancyData = () => {
    setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(API_Routes.VACANCYDETAILS + selectedItem?.item?._id, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status == 200 || result.status == 201) {
          const mycity = result?.data?.city;
          const myCountry = result?.data?.country
          setLoader(false);
          setName(result?.data?.title);
          setSelectedCity(result?.data?.city)
          setSelectedCountry(result?.data?.country)



          const setTime = (city, country) => {
            setTimeout(() => {
              setSelectedCity(result?.data?.city);
              setSelectedCountry(result?.data?.country);
            }, 1000);
          };
          setTime(mycity, myCountry);



          setAboutRole(result?.data?.vacancyRole);
          setSkills(result?.data?.skillDescription);
          setApplicationProcess(result?.data?.applicationProcess);
          const contactInfo = JSON.parse(result?.data?.contactInfo);
          setEmail(contactInfo.email || "");
          setPhone(contactInfo.phone || "");
        } else {
          setLoader(false);
          showMessage(result?.message, 'error');
        }
      })
      .catch(error => {
        setLoader(false);
        console.log('error', error);
      });
  };

  const UpdateVacancy = () => {
    setLoader(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("title", name);
    formdata.append("country", selectedCountry);
    formdata.append("city", selectedCity);
    formdata.append("vacancyRole", aboutRole);
    formdata.append("skillDescription", skills);
    formdata.append("applicationProcess", applicationProcess);
    // formdata.append("contactInfo", email);
    const contactInfoObj = {
      email: email,
      phone: phone
    };
    formdata.append("contactInfo", JSON.stringify(contactInfoObj));
    formdata.append("id", selectedItem?.item?._id);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(API_Routes.UPDATEVACANCY, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status == 200 || result.status == 201) {
          setEdit(false)
          ReverseEdit(edit)
          GetSingleVacancyData()
          setLoader(false)
          showMessage(result?.message)


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

  const DeleteVacancy = () => {
    setEdit(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("id", selectedItem?.item?._id);

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(API_Routes.DELETEVACANCY, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status == 200 || result.status == 201) {
          setDeleteProductsDialog(false)
          navigate(`/organization-dashboard/${4}`)

          // GetSingleVacancyData()
          setLoader(false)
          showMessage(result?.message)
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


  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={() => DeleteVacancy()}
      />
    </React.Fragment>
  );



  const handleCityChange = (city) => {
    setSelectedCity(city);
  };
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div className="jobDescription mb-5">
      {loader && <div className="loaderScreen">
        <Loader />
      </div>}
      <div className="subHeading mt-5">
        <div className="row align-items-center">
          <h4 className="main-heading-vc col-8 mt-3">Content Contributor</h4>
          <div className="col-4 pt-3 text-end">
            {!edit && (
              <img className="me-3 pointer" onClick={() => setEdit(true)} style={{ width: 28, height: 28 }} src={orgEditIcon} alt="orgEditIcon" />

            )}
            <img onClick={confirmDeleteSelected} className="pointer" style={{ width: 30, height: 30 }} src={deleteIcon} alt="deleteIcon" />

          </div>
        </div>
      </div>
      <div className="section mt-3">
        <InputField
          name={"Name"}
          disabled={!edit}
          mainClass={"mt-24px"}
          type="text"
          className={`w-100 mt-2 ${!edit ? "fw-bold inputFieldDis" : ""}`}
          placeholder={"Input text"}
          value={name}
          onChange={(e) => setName((e.target.value))}

        />

        <div className="mt-4 new-vacancy">
          {/* <VacancySelectInpt
            city={selectedCity}
            country={selectedCountry}
            name="Location " status={1}
            onCityChange={handleCityChange}
            // edit={edit}
          
            onCountryChange={handleCountryChange} /> */}

          {(selectedCity && selectedCountry) &&
            <NewVacancySelectInput
              city={selectedCity}
              country={selectedCountry}
              name="Location"
              status={1}
              onCityChange={handleCityChange}


              disabled={!edit}
              onCountryChange={handleCountryChange} />

          }
        </div>

        {/* <InputField
          name={"Location"}
          mainClass={"mt-24px"}
          disabled={!edit}
          type="text"
          className={`w-100 mt-2 ${!edit ? "fw-bold inputFieldDis" : ""}`}
          placeholder={"Input text"}
          value={location}

          onChange={(e) => setLocation((e.target.value))}
        /> */}
        <InputField
          name={"About the Role"}
          mainClass={"mt-24px"}
          type="text"
          className={"w-100 mt-2"}
          placeholder={"Input text"}
          value={aboutRole}
          disabled={!edit}

          onChange={(e) => setAboutRole((e.target.value))}

        />

        <div className="fieldName mt-24px">
          <div className=" mt-2">
            <div style={{ background: '#fcfcfc' }} className='mb form-main'>
              <label
                for="fname"
              >
                Desired Skills
              </label>
              <textarea disabled={!edit}
                style={{ minHeight: '140px' }}
                value={skills}
                onChange={(e) => setSkills((e.target.value))}
                placeholder='Input text' required id="w3review" name="w3review" rows="4" cols="50"></textarea>
            </div>
          </div>
        </div>


        <div className="fieldName mt-24px">
          <div className=" mt-2">
            <div style={{ background: '#fcfcfc' }} className='mb form-main'>
              <label
                for="fname"
              >
                Application Process
              </label>
              <textarea
                style={{ minHeight: '100px' }}
                disabled={!edit}
                value={applicationProcess}
                onChange={(e) => setApplicationProcess((e.target.value))}

                placeholder='Input text' required id="w3review" name="w3review" rows="4" cols="50"></textarea>
            </div>
          </div>
        </div>
        <div className="fieldName mt-24px">
          Contact Information
          <div className={`inputField mt-2 `}>
            If you have any question, please contact us!
            <div className={!edit ? "orangeColor" : ""}>
              <div className="d-flex align-items-center gap-2 mt-2">
                <AiOutlineMail fontSize={"20px"} />
                <div className="w-100">
                  <InputField
                    name={""}
                    // mainClass={"mt-24px"}
                    disabled={!edit}
                    type="email"
                    className={`w-100 ${!edit ? "fw-bold inputFieldDis" : ""}`}
                    placeholder={"Input text "}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex align-items-center gap-2 mt-2">
                <BiPhone fontSize={"20px"} />
                <div className="w-100">
                  <InputField
                    name={""}
                    // mainClass={"mt-24px"}
                    disabled={!edit}
                    type="number"
                    className={`w-100 ${!edit ? "fw-bold inputFieldDis" : ""}`}
                    placeholder={"Input text "}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {edit && (
          <div className="text-center mt-4 ">
            <Buttons
              style={{ borderRadius: 14 }}
              data={"Save changes"}
              class={"profile-btn mt-2"}
              onClick={UpdateVacancy}
            />
            <br />

            <div className="text-center mt-2 orange point mt-3">
              <p onClick={HandleEdit} className="cancelBtn CancelButtonVacancy">Cancel </p>
            </div>
          </div>


        )}
      </div>

      {deleteProductsDialog &&
        <Dialog
          visible={deleteProductsDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          // header="Confirm"
          draggable={false}
          modal
          footer={deleteProductsDialogFooter}
          onHide={hideDeleteProductsDialog}
        >
          <div className="confirmation-content">
            <div className="d-flex algn-items-center gap-3">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              <p className="ConfirmAlert">Confirm</p>

            </div>
            {/* {console.log('myProduct===>', product)} */}


            {/* {product && ( */}
            <div>
              <span>Are you sure you want to delete this vacancy?</span>
            </div>
            {/* // )} */}
          </div>
        </Dialog>

      }
    </div>
  );
};
