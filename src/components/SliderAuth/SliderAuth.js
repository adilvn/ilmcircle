import React, { useEffect, useRef, useState } from "react";
import "../SliderAuth/sliderauth.css";

//---------------components---------//
import Button from "../reuseable/Button";
import InputField from "../reuseable/InputField";
import { useAuth0 } from "@auth0/auth0-react";
//----------images-----------------------//
import cap from "../../asserts/images/cap.svg";
import hint from "../../asserts/images/hint.svg";
import ramdan from "../../asserts/images/ramadan 2.svg";
import one from "../../asserts/images/one.svg";
import two from "../../asserts/images/two.svg";
import google from "../../asserts/images/google.svg";
import hijab3 from "../../asserts/images/hijab3.svg";
import { auth, provider } from '../../config'
import { signInWithPopup } from "firebase/auth";
//------------library--------------------//
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ReactSVG } from "react-svg";
import Slider from "react-slick";
import {
  completedRegistration,
  paymentText,
  thankusignUp,
} from "../../Auth/ThankuAllText";
import CheckBox from "../../OrganizationDashboard/OrgSidebarContent/Notification/CheckBox";
import Card from "../reuseable/Card";
import CheckOut from "./CheckOut";
import { PaymentsScreens } from "./PaymentsScreens";
import { useFormik } from "formik";
import { SignupScheme } from "../../Schemas/SignupScheme";
import OrganizationDetail from "../../OrganizationDashboard/OrgSidebarContent/Organization-Details/OrganizationDetail";
import API_Routes from "../../Routes/API_Routes";
import axios from "axios";
import { showMessage } from "../reuseable/Tostify";
import secureLocalStorage from "react-secure-storage";
import { PaypalPaymentScreen } from "./PaypalPaymentScreen";
import { Loader } from "../reuseable/Loader";
import { useCallback } from "react";

import { LoginSocialFacebook } from 'reactjs-social-login';
import { LoginSocialGoogle } from 'reactjs-social-login';
import { GoogleLoginButton } from "react-social-login-buttons";


const useEffectOnce = (effect) => {
  const [didRun, setDidRun] = useState(false);

  useEffect(() => {
    if (!didRun) {
      effect();
      setDidRun(true);
    }
  }, []);

  return didRun;
};

const SliderAuth = () => {

  const { user, loginWithRedirect } = useAuth0();
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOption1, setSelectedOption1] = useState("");

  const [StoreValue, setStoreValue] = useState("");
  const [roleData, setRoleData] = useState("");

  const [StoreValue1, setStoreValue1] = useState("");

  const [thirdcard, setThirdCard] = useState(true);
  const [fourthCard, setFourthCard] = useState(false);
  const [organizatioSection, setOrganizatioSection] = useState(false);
  const [verification, setVerification] = useState(false);
  const [fifthCard, setFifthCard] = useState(false);
  const [sixthCard, setSixthCard] = useState(false);
  const [nineCard, setNinCard] = useState(false);
  const [eightCard, seEightCard] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  const [seventhCard, setSeventhCard] = useState(false);
  const [btnText, setBtnText] = useState("");
  const [show, setShow] = useState(0);
  const [cancelText, setCancelText] = useState("");
  const [pricingData, setPricingData] = useState([]);
  const [stripeData, setStripeData] = useState();
  const [planDetails, setPlanDetails] = useState();
  const [email, setEmail] = useState("");
  const [paypalData, setPaypalData] = useState("");
  const [showOnce, setShowOnce] = useState(false);
  const [loader, setLoader] = useState(false);
  const [sendDetails, setSendDetails] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [isGoogle, setIsGoogle] = useState(false);
  const [uid, setUid] = useState("");

  const navigate = useNavigate();
  const sliderRef = useRef();

  /////////////redio check/////////
  const options = [
    { value: "option1", label: "A student", prompt: "student", img: cap },
    { value: "option3", label: "A teacher", prompt: "teacher", img: hijab3 },
    {
      value: "option2",
      label: "An organization",
      prompt: "organization",
      img: ramdan,
    },
  ];

  const optionstwo = [
    { value: "option1", label: "Quran", img: one },
    { value: "option2", label: "Arabic", img: two },
  ];
  const optionsThree = [
    { value: "option1", label: "€30/year", title: "Student Year Plan" },
    { value: "option2", label: "€2.99/month", title: "Student Month Plan" },
  ];

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleOptionChange1 = (event) => {
    setSelectedOption1(event.target.value);
  };

  const isVerifiedRef = useRef(true);

  useEffect(() => {
    if (isVerifiedRef.current) {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("id");
      urlToken && verifyEmail(urlToken);
    }
    // setShowOnce()
  }, []);

  const verifyEmail = (urlToken) => {
    isVerifiedRef.current = false;

    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `https://ilmcircle.com/backend/api/user/verify?id=${urlToken}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 200) {
          setVerification(true);
          setStoreValue('An organization')
          sliderRef.current.slickNext();

          const urlParams = new URLSearchParams(window.location.search);
          urlParams.delete("id");
          window.history.replaceState(null, null, window.location.pathname);
          showMessage(result?.message);
        } else {
          showMessage(result?.message);
        }
      })
      .catch((error) => console.log("Error:", error));
  };
  // const MoveNextPage = (e) => {
  //   e.preventDefault();
  //   if (StoreValue === "A student") {
  //     setThirdCard(true);
  //     setFourthCard(true);
  //     setFifthCard(true);
  //     setSixthCard(true);
  //     setSeventhCard(true);
  //   }
  //   if (StoreValue === "A student") {
  //     navigate("/organization-details");
  //   }
  //   if (StoreValue === "An Organization") {
  //     // setThirdCard(false)
  //     navigate("/organization-details");
  //   }
  // };
  // const REDIRECT_URI =
  // // 'https://plenty-planets-beam-42-118-51-2.loca.lt/account/login';
  const REDIRECT_URI = 'http://localhost:3000/'

  const handleCheckoutButtonClick = () => {
    gotoNext(5)
  };

  const handleCheckoutButtonClick2 = () => {

    if (uid) {
      navigate('/login')
      showMessage('signup Successfull')
    } else {
      gotoNext(5);
    }

  };
  const handleCompleteRegBtnClick = () => {
    if (uid) {
      navigate('/login')
      showMessage('signup Successfull')
    } else {
      gotoNext(6);
    }
  };
  const handleCompleteRegBtnClick2 = () => {
    gotoNext(7);
  };

  const handlePricingBtnClick = () => {
    setFifthCard(true);
    gotoNext(6);
  };

  /////////////Slider Buttons with useref/////////
  const gotoNext = (id) => {
    if (StoreValue === "A student") {
      setThirdCard(true);
      setFourthCard(true);
      setSixthCard(true);
      seEightCard(true);
      // setSeventhCard(true);
    }
    if (StoreValue === "A teacher") {
      setThirdCard(false);
      navigate("/coming-soon");
    }
    if (StoreValue === "An organization") {
      // setThirdCard(false)
      setOrganizatioSection(true);
      setThirdCard(false);
      // navigate("/organization-details");
    }
    if (selectedOption) {
      sliderRef.current.slickNext();
    }
    if (id == 5) {
      setTimeout(() => {
        setBtnText("Pay now");
      }, 300);
      setCancelText("Cancel");
    }
    if (id == 6) {
      setBtnText(paymentText.btnText);
    }
    if (id == 7) {
      setBtnText(completedRegistration.btnText);
    }
    window.scrollTo(0, 0);
  };

  const gotoPrev = () => {
    setStoreValue("");
    setStoreValue1("");

    sliderRef.current.slickPrev();
  };
  const handleSliderKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const settings = {
    swipeToSlide: false,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: false,
    arrows: false, // Disable the default arrows
    focusOnSelect: false, // Disable focusing on slide selection
    accessibility: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],

    beforeChange: (currentSlide, nextSlide) => {
      // Prevent slide transition when clicking on dots
      if (currentSlide !== nextSlide) {
        return false;
      }
    },
  };
  const handleShow = (index) => {
    setShow(index);
  };

  const initialValues = {
    email: "",
    confirm_email: "",
  };

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: SignupScheme,
      validateOnChange: true,
      validateOnBlur: false,
      //// By disabling validation onChange and onBlur formik will validate on submit.
      onSubmit: (values, action) => {
        setLoader(true);

        var formdata = new FormData();
        formdata.append("role", "student");
        formdata.append("email", values.email);
        formdata.append("userCheck", "true");

        var requestOptions = {
          method: "POST",
          body: formdata,
          redirect: "follow",
        };

        fetch(API_Routes.SIGNUP, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if (result.status == 404) {
              // showMessage(result?.message)
              setEmail(values?.email);
              gotoNext();
              setLoader(false);
            } else {
              showMessage(result?.message, "error");
              setLoader(false);
            }
          })
          .catch((error) => {
            setLoader(false);
            console.log("error", error);
          });
      },
    });

  //API's section
  const onLoginStart = useCallback(() => {
    alert('login start')
  }, [])

  useEffect(() => {
    FetchPricingPlan();
  }, []);

  const FetchPricingPlan = () => {
    setLoader(true);

    // Create a FormData instance
    const formdata = new FormData();

    // Configure the request options
    const requestOptions = {
      method: "get",
      url: "https://ilmcircle.com/backend/api/page/packages",
      params: formdata,
      responseType: "json",
    };

    axios(requestOptions)
      .then((response) => {
        if (response.status == 200) {
          setPricingData(response?.data?.data);
          setLoader(false);
        } else {
          showMessage(response?.message, "error");
          setLoader(false);
        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });
  };

  const handleClick = (option) => {
    setPlanDetails(option);
    // secureLocalStorage.setItem('price', option.price)
  };

  const handleRoleOptions = (option) => {
    setRoleData(option);
    setStoreValue(option.label);
  };



  const GoogleAuthenticate = (data) => {
  }

  const [value, setValue] = useState()
  const handleClick2 = async () => {
    try {
      const data = await signInWithPopup(auth, provider);
      values.email = data.user.email;
      handleChange({
        target: {
          name: "email",
          value: data.user.email
        }
      });

      handleChange({
        target: {
          name: "confirm_email",
          value: data.user.email
        },
      });
      setInputDisabled(true)
      setIsGoogle(true)
      setUid(data.user.uid)
      // handleSubmit()

    } catch (error) {
      console.log('error', error);

    }
  };





  // useEffect(()=>{

  // },[])
  return (
    <>

      <div className="dot-style-slider" onKeyDown={handleSliderKeyDown}>
        {loader && (
          <div className="loaderScreen">
            <Loader />
          </div>
        )}
        <Slider ref={sliderRef} {...settings}>
          <div className="d-flex justify-content-center ">
            <div className="slide-box-one signup-box">
              <h6 className="text-center">{"Join us now!"}</h6>
              <div className="slide-box-body">
                <div className="iam">
                  <strong>{"I am..."}</strong>
                </div>
                {options.map((option) => (
                  <label key={option.value} className="bottom-slide-box ">
                    <div className="svg-style">
                      <span>
                        <ReactSVG src={option.img} />
                      </span>
                      <span> {option.label}</span>
                    </div>
                    <div onClick={() => handleRoleOptions(option)}>
                      <CheckBox
                        value={option.value}
                        checked={selectedOption === option.value}
                        onChange={handleOptionChange}
                        className="rounded-circle"
                      />
                    </div>
                  </label>
                ))}
                <div>
                  <Button
                    data={"Next Step"}
                    onClick={() => gotoNext()}
                    class={"bottom-btn profile-btn two-bottom mt-4 w-100"}
                  ></Button>
                </div>
              </div>
            </div>
          </div>


          {/* ////////card-three////////// */}
          {organizatioSection && (
            <>
              <OrganizationDetail gotoNext={gotoNext} />
            </>
          )}
          {verification && (
            <div className="row thanks-row">
              <h6 className="text-center verificatonTitleText">
                Verification on progress
              </h6>
              <div className="d-flex align-items-center justify-content-center">
                <div
                  className="thank-para text-center"
                  style={{ width: "55%" }}
                >
                  <p className="mb-4 mt-2">Assalaam ‘Alaykum, </p>
                  <p className="mb-4">
                    To ensure a secure and trustworthy environment for all our
                    users, we conduct a thorough verification of the information
                    you provided during registration. Please allow a few days
                    for our team to complete this verification and activate your
                    account.
                  </p>
                  <p className="mb-4">
                    Once your account is approved, you will receive a
                    confirmation email and you can start exploring all the
                    features and resources available on our platform.
                  </p>
                  <p className="">
                    Should you have any questions or concerns, don’t hesitate to
                    reach out to our support team at (support email).
                    <p className="my-4">Sincerely,</p>
                    <p className="mb-4">The IlmCircle team</p>
                  </p>
                </div>
              </div>
            </div>
          )}
          {thirdcard && (
            <div className="d-flex justify-content-center">
              <div className="slide-box-three signup-box">
                <div className="login-body">
                  <h6 className="text-center">{"Join us now!"}</h6>

                  <div className='google'>
                    {/* <LoginSocialGoogle
                      client_id='OLJQoReQ0JUZ8qSGYkc5rjeNGTonjfpg'
                      scope='openid profile email'
                      discoveryDocs='claims_supported'
                      access_type='offline'
                      onResolve={({ provider, data }) => {
                        GoogleAuthenticate(data)
                      }}
                      onReject={(error) => {
                      }}
                    >
                      <Link to={'./'} style={{ textDecoration: 'none' }}>
                        <div className='googleText'>
                          <img style={{ width: '25px' }} className='me-2 mb-0' src={google} />
                          <span >Continue with Google</span>
                        </div>
                      </Link>
                    </LoginSocialGoogle> */}

                    <Button
                      onClick={handleClick2}
                      class={"google-btn"}
                      icon={<ReactSVG src={google} className="mb-1" />}
                      data={"Sign up with Google"}
                    ></Button>
                  </div>
                  <div className=" LoginTime">
                    <hr
                      className="loginhr"
                      style={{
                        marginTop: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    ></hr>
                    <div>
                      {" "}
                      <p className="SignInEMail px-2">
                        Sign up with your Email
                      </p>
                    </div>
                    <hr
                      className="loginhr"
                      style={{
                        marginTop: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    ></hr>
                  </div>
                  <div className="login-form">
                    <form onSubmit={handleSubmit} className=" " noValidate>
                      <div className="mb form-main w-100">
                        <label htmlFor="fname">{"E-mail"}</label>
                        <InputField
                          placeholder="Input e-mail address"
                          type="email"
                          required
                          disabled={inputDisabled}
                          PerminentDisablled={inputDisabled}
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.email && touched.email ? (
                          <p className="form-error mt-2">{errors.email}</p>
                        ) : null}
                      </div>
                      <div className="mb form-main w-100">
                        <label htmlFor="fname">Confirm e-mail</label>
                        <InputField
                          placeholder="Input e-mail address"
                          type="email"
                          required
                          disabled={inputDisabled}
                          PerminentDisablled={inputDisabled}
                          name="confirm_email" // This should be 'confirm_email'
                          value={values.confirm_email}
                          onChange={handleChange}
                          onBlur={handleBlur}

                        />
                        {errors.confirm_email && touched.confirm_email ? (
                          <p className="form-error mt-2">
                            {errors.confirm_email}
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <Button
                          onClick={() => handleSubmit()}
                          data={"Next Step"}
                          class={
                            "bottom-sign-btn profile-btn two-bottom w-100 "
                          }
                        ></Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {fourthCard && (
            <div className="slide-box-three">
              <h6 className="text-center">Choose your subscription plan</h6>
              <div className="row justify-content-center">
                <div className="login-body col-xl-5 col-lg-7 col-md-8">
                  <div>
                    {pricingData.map((option, index) => (
                      <label key={option.value} className="signUpPricePage">
                        <div className="svg-style">
                          <div>
                            <div className="d-flex align-items-start gap-2">
                              <span
                                onMouseEnter={() => {
                                  handleShow(index);
                                }}
                                onMouseLeave={() => setShow(null)}
                              >
                                {"Student "}
                                {option.name} {"Plan"}
                              </span>

                              <ReactSVG
                                src={hint}
                                onMouseEnter={() => {
                                  handleShow(index);
                                }}
                                onMouseLeave={() => setShow(null)}
                              />
                            </div>

                            <h4 className="mt-3 priceLabelSignUp text-sm-center text-md-start">
                              € {option.price} {`/${option.name}`}
                            </h4>
                          </div>

                          {show === index && (
                            <div
                              className="position-absolute end-0"
                              style={{ top: 20 }}
                            >
                              <div className="">
                                <Card
                                  top={`${option.price}`}
                                  heading={`Student ${option.name} Plan`}
                                  month={`${option.name}`}
                                  features={option?.features}
                                  class="discount"
                                  btnText="Choose this plan"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div onClick={() => handleClick(option)}>
                          <CheckBox
                            value={option._id}
                            checked={selectedOption1 === option._id}
                            onChange={handleOptionChange1}
                            className="rounded-circle"
                          />
                        </div>
                      </label>
                    ))}
                    <Button
                      onClick={() => handlePricingBtnClick()}
                      data={"Next Step"}
                      class={"profile-btn mt-3 w-100 "}
                    ></Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {fifthCard && (
            <div>
              <CheckOut
                setSendDetails={setSendDetails}
                setStripeData={setStripeData}
                setSixthCard={setSixthCard}
                setSeventhCard={setSeventhCard}
                onButtonClick={handleCheckoutButtonClick}
                onButtonClick2={handleCheckoutButtonClick2}

                planDetails={planDetails}
                roleData={roleData}
                setPaypalData={setPaypalData}
                email={email}
                isGoogle={isGoogle}
                uid={uid}

              />
              {/* <Button
                data={btnText}
                onClick={() => {
                  gotoNext(6);
                }}
                class={"thank-btn  mt-3   w-35"}
              ></Button> */}

              <p
                // onClick={() => navigate("/")}
                className={"orange pointer text-center authcancelBtn mt-3"}
              >
                {" "}
                {cancelText}
              </p>
            </div>
          )}
          {sixthCard && (
            <div>

              <PaymentsScreens
                sendDetails={sendDetails}
                email={email}
                planDetails={planDetails}
                stripeDetails={stripeData}
                selectedOption1={selectedOption1}
                seEightCard={seEightCard}
                onButtonClick={handleCompleteRegBtnClick}
                roleData={roleData}
                allData={paymentText}
                isGoogle={isGoogle}
                uid={uid}
                showBtn={showBtn}
                setShowBtn={setShowBtn}

              />
            </div>
          )}
          {/* {ninCard && (
            <div >
              {console.log('seventCardWorking')
              }
              <PaymentsScreens
                email={email}
                planDetails={planDetails}
                stripeDetails={stripeData}
                selectedOption1={selectedOption1}
                onButtonClick2={handleCompleteRegBtnClick2}
                roleData={roleData}
                showBtn={true}
                allData={completedRegistration}
                addClass={"text-center"}
                isGoogle={isGoogle}
                uid={uid}


              />
            </div>
          )} */}
          {seventhCard && (
            <div>
              <PaypalPaymentScreen
                email={email}
                // planDetails={planDetails}
                // stripeDetails={stripeData}
                // selectedOption1={selectedOption1}
                // onButtonClick={handleCompleteRegBtnClick}
                // roleData={roleData}

                selectedOption1={selectedOption1}
                seEightCard={seEightCard}
                onButtonClick={handleCompleteRegBtnClick}
                roleData={roleData}
                isGoogle={isGoogle}
                uid={uid}


                planDetails={paypalData}
                showBtn={showBtn}
                setShowBtn={setShowBtn}
                allData={paymentText}
                addClass={"text-center"}
              />
            </div>
          )}
        </Slider >
      </div >
    </>
  );
};

export default SliderAuth;
