import React, { useState, useEffect, useRef } from "react";
import { BiChevronDown, BiChevronRight, BiPlusCircle } from "react-icons/bi";
import '../Vacancy&Volunteer/vocancy.css'
import { BsSearch, BsSortDown } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { CreateEventModal } from "../OrgMyEvents/CreateEventModal";
import { FiFilter } from "react-icons/fi";
import Button from "../../../components/reuseable/Button";
import { SeleclInput } from "../OrgMyEvents/Reuseable/SeleclInput";
import { AiOutlineRight } from "react-icons/ai";
import { FaRegMap } from "react-icons/fa";
import { vacancy } from './DummyArrayVacancy'
import { CreateVacancyModal } from "./CreateVacancyModal";
import { VacancySelectInpt } from "./VacancyReuseable/VacancySelectInpt";
import { bindActionCreators } from "redux";
import { actionCreaters } from "../../../Store/Index";
import { useDispatch, useSelector } from "react-redux";
import './createnew.css'
import { Loader } from "../../../components/reuseable/Loader";
import secureLocalStorage from "react-secure-storage";
import { showMessage } from "../../../components/reuseable/Tostify";
import API_Routes from "../../../Routes/API_Routes";
import { NewVacancySelectInput } from "./VacancyReuseable/NewVacancySelectInput";
function CreateNewVacancy() {
  const dispatch = useDispatch();
  const { orgDashboardIndex } = bindActionCreators(actionCreaters, dispatch);
  let emptyProduct = {
    id: null,
    name: "",
    description: "",
    price: 0,
    // quantity: 0,
    // rating: 0,
    // inventoryStatus: "INSTOCK",
  };

  const [products, setProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [modalStatus, setModalStatus] = useState(false);
  const [modalStatus2, setModalStatus2] = useState(false);
  const [step, setStep] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [showMonth, setShowMonth] = useState(false);
  const [showDay, setShowDay] = useState(false);
  const [day, setDay] = useState([]);
  const [loader, setLoader] = useState(false);

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [aboutRole, setAboutRole] = useState('');
  const [skills, setSkills] = useState('');
  const [applicationProcess, setApplicationProcess] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [contacts, setContacts] = useState({ email: '', phone: '' });
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const selectedItem = useSelector((state) => state?.selectedIndex);
  const navigate = useNavigate();

  const token = secureLocalStorage.getItem('token')
  const role = [
    "Revision ",
    "Memorization",
  ];
  const location = [
    "Revision ",
    "Memorization",
  ];
  const ref = useRef(null);

  const handleModal = () => {
    setShowModal(!showModal);
  };

  const handleEmailChange = (e) => {
    setContacts({ ...contacts, email: e.target.value });
  };

  const handlePhoneChange = (e) => {
    setContacts({ ...contacts, phone: e.target.value });
  };


  const handleCityChange = (city) => {

    setSelectedCity(city);
  };
  // Callback function to update the selected country
  const handleCountryChange = (country) => {

    setSelectedCountry(country);
  };
  const createNewVacancy = () => {
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
    formdata.append("date", new Date());
    formdata.append("contactInfo", JSON.stringify(contacts));

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(API_Routes.CREATEVACANCY, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status == 200 || result.status == 201) {
          navigate(`/organization-dashboard/${4}`)

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
  return (
    <div style={{ paddingLeft: 100, paddingRight: 50, paddingTop: 10, background: 'none', boxShadow: 'none' }} className="VolanteerMain">
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
                <div className="steps mt-2">
                  <a onClick={() => {
                    navigate(`/organization-dashboard/${4}`)


                  }} className=" vacancy-breadcrum">
                    All Vacancies
                  </a>
                  <AiOutlineRight className="mx-1" fontSize={"15px"} />{" "}
                  <a className="vacancy-breadcrum" onClick={() => setStep(false)}>Create New Vacancy</a>
                </div>
                <div className="row ">
                  <div className="col-md-6 d-flex align-items-center mt-4">
                    <h5 className="">New Vacancy</h5>

                  </div>

                </div>
              </div>
            </div>

            <div className="outer-border-vacancy">
              <div className="mt-4 new-vacancy">
                <div className="create-vc-spacing">
                  <p className="textheading mb-1">Title (required)</p>
                  <input
                    type="text"
                    className="inputFields w-100"
                    placeholder="Vacancy title "
                    value={name}
                    onChange={(e) => setName((e.target.value))}
                  />
                </div>
                <div className="mt-4">
                  <NewVacancySelectInput edit={true} name="Location" onCityChange={handleCityChange} onCountryChange={handleCountryChange} />
                </div>
                <div className="create-vc-spacing">
                  <p className="textheading mb-1 mt-24px">About The Role</p>

                  <input
                    type="text"
                    className="inputFields w-100"
                    placeholder="Description, responsibility, and other important information about the role"
                    value={aboutRole}
                    onChange={(e) => setAboutRole((e.target.value))}

                  />
                </div>
                <div className="create-vc-spacing">
                  <p className="textheading mb-1 mt-24px">Desired Skills</p>

                  <textarea
                    type="text"
                    className="inputFields input-textarea-vc w-100 vacancyTextArea"
                    placeholder="Required Skills, such as Proficiency in written and spoken English Strong interpersonal and communication skills Knowledge or interest in Islamic culture "
                    value={skills}
                    onChange={(e) => setSkills((e.target.value))}
                  />
                </div>

                <div className="create-vc-spacing">
                  <p className="textheading mb-1 mt-24px">Application process</p>

                  <input
                    type="text"
                    className="inputFields w-100"
                    placeholder="Explain how the application works"
                    value={applicationProcess}
                    onChange={(e) => setApplicationProcess((e.target.value))}

                  />
                  <h6 className="textheading mb-1 mt-24px">Contact information</h6>

                </div>

                <div className="create-vc-spacing">
                  <p className="textheading mb-1 mt-3  font-bold">Email</p>
                  <input
                    type="text"
                    className="inputFields w-100"
                    placeholder="Email"
                    value={contacts.email}
                    onChange={handleEmailChange}
                  />
                </div>

                <div className="create-vc-spacing">
                  <p className="textheading mb-1 mt-3 ">Phone Number</p>
                  <input
                    type="number"
                    className="inputFields w-100"
                    placeholder="Phone number"
                    value={contacts.phone}
                    onChange={handlePhoneChange}
                  />
                </div>


              </div>
              <div className="text-center">
                <Button
                  data="Create new vacancy"
                  class="newv-btn mt-5"
                  // onClick={handleStep2}
                  onClick={() => createNewVacancy()}
                />
              </div>
              {/* <div className="text-center mt-2 orange point">
                <p onClick={() => {
                  orgDashboardIndex({ orgIndex: 4 });

                }} className="cancelBtn CancelButtonVacancy">Cancel </p>
              </div> */}
            </div>




          </div>

        </div>

      </div>



    </div>
  )
}

export default CreateNewVacancy;
