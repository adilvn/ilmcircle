import React, { useEffect, useRef, useState } from "react";
import "./auth.css";

//----------components------------------//
import Header from "../layout/Header";
import Button from "../components/reuseable/Button";
import InputField from "../components/reuseable/InputField";

//-----------images-------------------------//
import left from "../asserts/images/auth left.png";
import right from "../asserts/images/auth right.png";
import google from "../asserts/images/google.svg";

//----------library-------------------------//
import { ReactSVG } from "react-svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LoginSchema } from "../Schemas/LoginScheme";
import { useFormik } from "formik";
import secureLocalStorage from "react-secure-storage";
import API_ENDPOINTS from "../Routes/API_Routes";
import { showMessage } from "../components/reuseable/Tostify";
import axios from "axios";
import { Loader } from "../components/reuseable/Loader";
import { Dialog } from "primereact/dialog";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config";
import { getFirebaseToken } from "../Cloud";

const Login = () => {
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();
  const isVerifiedRef = useRef(true);
  const [productDialog, setProductDialog] = useState(false);
  const token = secureLocalStorage.getItem("token");

  useEffect(() => {
    if (isVerifiedRef.current) {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("id");
      urlToken && verifyEmail(urlToken);
    }


  }, []);

  // useEffect(() => {
  //   if (token) {
  //     console.log(token)
  //     navigate("/dashboard");
  //   }
  // }, [token])

  const [isChecked, setIsChecked] = useState(false);
  const [loader, setLoader] = useState(false);
  const [saveToken, setSaveToken] = useState("");
  const [checkGender, setCheckGender] = useState(false);
  const [sendGender, setGetGender] = useState("");
  const [loginData, setloginData] = useState();
  const [value, setValue] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [googlePassword, setGooglePassword] = useState("");

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
  const openNew = (result) => {
    setLoader(false);
    setProductDialog(true);
    setloginData(result);
  };

  const verifyEmail = (urlToken) => {
    setLoader(true);
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
        if ((result.status = 200)) {
          const urlParams = new URLSearchParams(window.location.search);
          urlParams.delete("id");
          window.history.replaceState(null, null, window.location.pathname);
          showMessage(result?.message);
          setLoader(false);
        } else {
          showMessage(result?.message, "error");
          setLoader(false);
        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });
  };
  const initialValues = {
    email: "",
    password: "",
  };
  const navigate = useNavigate();

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: LoginSchema,
      validateOnChange: true,
      validateOnBlur: false,
      onSubmit: (values, action) => {
        setLoader(true);

        var formdata = new FormData();
        formdata.append("email", values.email);
        formdata.append("password", values.password);
        formdata.append("rememberMe", isChecked);

        var requestOptions = {
          method: "POST",
          body: formdata,
          redirect: "follow",
        };

        fetch(API_ENDPOINTS.LOGIN, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if (result.status == 200) {
              secureLocalStorage.setItem("token", result?.data?.accessToken);
              secureLocalStorage.setItem("id", result?.data?.data?._id);
              secureLocalStorage.setItem("email", result?.data?.data?.email);
              secureLocalStorage.setItem("role", result?.data?.data?.role);

              verifyNotificationToken(result?.data?.accessToken);

              secureLocalStorage.setItem(
                "name",
                result?.data?.data?.userDetailId?.firstName
              );
              secureLocalStorage.setItem(
                "image",
                result?.data?.data?.userDetailId?.image?.url
              );
              setSaveToken(result?.data?.accessToken);
              const checking = result?.data?.data?.userDetailId.gender;
              setLoader(false);
              if (
                result?.data?.data?.userDetailId.gender == "" &&
                result?.data?.data?.role == "student"
              ) {
                return openNew(result?.data);
              } else {
                if (result?.data?.data?.role == "student") {
                  if (result?.data?.data?.loginFirst) {
                    navigate("/dashboard", {
                      state: { loginData: result?.data?.data },
                    });
                  } else {
                    navigate(`/student-dashboard/${0}`, {
                      state: { loginData: result?.data?.data },
                    });
                  }
                } else {
                  if (result?.data?.data?.loginFirst) {
                    navigate("/EditProfile", {
                      state: { loginData: result?.data?.data },
                    });
                  } else {
                    navigate(`/organization-dashboard/${0}`, {
                      state: { loginData: result?.data?.data },
                    });
                  }
                }

                showMessage(result.message, "success");
              }
            } else {
              showMessage(result.message, "error");
              setLoader(false);
            }
          })
          .catch((error) => {
            console.log("error", error);
            setLoader(false);
          });
      },
    });

  const verifyNotificationToken = async (token) => {
    const generateToken = await getFirebaseToken();
    var myHeaders = new Headers();

    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://ilmcircle.com/backend/api/user/token/" +
      generateToken,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200 || result.status == 201) {
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
  };

  const modalHeader = () => {
    return (
      <div class="container loginGenderHeader">
        <h1>Please select a gender to login</h1>
      </div>
    );
  };

  const SendGender = async (e) => {
    setLoader(true);
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("gender", sendGender);

      const response = await axios.post(
        "https://ilmcircle.com/backend/api/student/gender",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${saveToken}`,
          },
        }
      );

      if (response.status == 200 || response.status == 201) {
        setLoader(false);
        setProductDialog(false);
        secureLocalStorage.setItem("role", loginData?.data?.role);
        secureLocalStorage.setItem("gender", loginData?.userDetailId?.gender);

        // navigate("/login");
        // setCheckGender(true)
        // loginData?.userDetailId?.gender = getGender
        // showMessage(response?.data.message);

        // setGender(result?.data?.data?.userDetailId?.gender)
        if (loginData?.data?.role == "student") {
          if (loginData?.data?.loginFirst) {
            navigate("/dashboard");
          } else {
            navigate(`/student-dashboard/${0}`);
          }
        } else {
          navigate("/organization-dashboard");
        }

        showMessage("Login successfully", "success");
      } else {
        setLoader(false);
        showMessage(response?.data.message);
      }
    } catch (error) {
      console.error("error", error);
      setLoader(false);
    }
  };

  const GoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider).then((data) => {
        setLoader(true);

        var formdata = new FormData();
        formdata.append("email", data?.user?.email);
        formdata.append("password", data?.user?.uid);
        formdata.append("loginGoogle", "true");

        var requestOptions = {
          method: "POST",
          body: formdata,
          redirect: "follow",
        };

        fetch(API_ENDPOINTS.LOGIN, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            // alert(result?.data?.data?.role)

            if (result.status == 200) {
              secureLocalStorage.setItem("token", result?.data?.accessToken);
              secureLocalStorage.setItem("id", result?.data?.data?._id);
              secureLocalStorage.setItem("email", result?.data?.data?.email);
              secureLocalStorage.setItem("role", result?.data?.data?.role);

              secureLocalStorage.setItem(
                "name",
                result?.data?.data?.userDetailId?.firstName
              );
              secureLocalStorage.setItem(
                "image",
                result?.data?.data?.userDetailId?.image?.url
              );
              setSaveToken(result?.data?.accessToken);
              const checking = result?.data?.data?.userDetailId.gender;
              setLoader(false);
              if (
                result?.data?.data?.userDetailId.gender == "" &&
                result?.data?.data?.role == "student"
              ) {
                return openNew(result?.data);
              } else {
                if (result?.data?.data?.role == "student") {
                  if (result?.data?.data?.loginFirst) {
                    navigate("/dashboard", {
                      state: { loginData: result?.data?.data },
                    });
                  } else {
                    navigate(`/student-dashboard/${0}`, {
                      state: { loginData: result?.data?.data },
                    });
                  }
                } else {
                  if (result?.data?.data?.loginFirst) {
                    navigate("/EditProfile", {
                      state: { loginData: result?.data?.data },
                    });
                  } else {
                    navigate(`/organization-dashboard/${0}`, {
                      state: { loginData: result?.data?.data },
                    });
                  }
                }

                showMessage(result.message, "success");
              }
            } else {
              showMessage(result.message, "error");
              setLoader(false);
            }
          })
          .catch((error) => {
            console.log("error", error);
            setLoader(false);
          });
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section>
        {loader && (
          <div className="loaderScreen">
            <Loader />
          </div>
        )}
        {/* <Header /> */}
        <div className="px-zero light-images">
          {/* <div className='img-left-side'><img className='img-fluid' src={left} alt="" /></div>
                    <div className='img-right-side'><img className='img-fluid' src={right} alt="" /></div> */}
          <div className="signInBackgroundImage">
            {/* <div className="login-rowMain"> */}
            <div className="d-lflex">
              <div className="login-row ">
                <div
                  style={{ padding: "3rem" }}
                  className="login-box login-rowMain"
                >
                  <div className="login-body">
                    <h6 className="text-center">{"Welcome back!"}</h6>
                    <Button
                      onClick={GoogleLogin}
                      class={"google-btn"}
                      icon={<ReactSVG src={google} className="mb-1" />}
                      data={"Sign in with Google"}
                    ></Button>
                    <div className=" LoginTime">
                      <hr
                        style={{
                          marginTop: "0.5rem",
                          marginBottom: "0.5rem",
                        }}
                      ></hr>
                      <div>
                        {" "}
                        <pre className="SignInEMail px-2">
                          Or Sign in with your email
                        </pre>
                      </div>
                      <hr
                        style={{
                          marginTop: "0.5rem",
                          marginBottom: "0.5rem",
                        }}
                      ></hr>
                    </div>
                    <div className="login-form">
                      <form onSubmit={handleSubmit} className=" " noValidate>
                        <div className="mb form-main w-100 mt-3">
                          <label htmlFor="fname">{"E-mail"}</label>
                          <InputField
                            placeholder={"Input e-mail address"}
                            type="email"
                            required
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
                          <label htmlFor="fname">{"Password"}</label>
                          <InputField
                            placeholder={"Input password"}
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.password && touched.password ? (
                            <p className="form-error mt-2">{errors.password}</p>
                          ) : null}
                        </div>

                        <div className="login-bottom">
                          <span>
                            {" "}
                            <label>
                              <input
                                type="checkbox"
                                className="checkbox-round"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                              />
                            </label>{" "}
                            {"Keep me signed in"}
                          </span>{" "}
                          <span>
                            <Link
                              className="text-blue loginForgetStyle"
                              to="/forget-password"
                            >
                              {"Forgot password?"}
                            </Link>
                          </span>
                        </div>
                        <div>
                          <div onClick={() => handleSubmit()}>
                            <Button
                              type={"submit"}
                              class={"bottom-btn profile-btn w-100"}
                              data={"Sign in"}
                            ></Button>
                          </div>
                          <p className="text-center loginSinupText">
                            {" "}
                            <small> {"Don’t have an account?"}</small>{" "}
                            <span>
                              <Link className="text-blue" to="/signup">
                                {" "}
                                {"Sign up here"}
                              </Link>
                            </span>
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}
            <Dialog
              visible={productDialog}
              // style={{ width: "32rem" }}
              breakpoints={{ "960px": "75vw", "641px": "90vw" }}
              // header={modalHeader}
              dismissableMask={true}
              draggable={false}
              modal
              className="p-fluid addNewTaskModal2"
            // footer={productDialogFooter}
            // onHide={hideDialog}
            >
              <div>
                <div class="">
                  <div class="custom-modal2">
                    <form>
                      <div class="container loginGenderHeader">
                        <h1>Please select a gender to login</h1>
                      </div>
                      <div class="mb-3 genderModalMain">
                        <label for="genderSelect" class="form-label">
                          Select Gender:
                        </label>
                        <select
                          class="form-select"
                          id="genderSelect"
                          name="gender"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          {/* <option value="other">Other</option> */}
                        </select>
                      </div>
                      <button type="submit" class="btn btn-primary">
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </Dialog>

            <Dialog
              visible={productDialog}
              // style={{ width: "32rem" }}
              breakpoints={{ "960px": "75vw", "641px": "90vw" }}
              // header={modalHeader}
              dismissableMask={false}
              draggable={false}
              modal
              className="p-fluid addNewTaskModal2"
            // footer={productDialogFooter}
            // onHide={hideDialog}
            >
              <div>
                <div class="">
                  <div class="custom-modal2">
                    <form>
                      <div class="container loginGenderHeader">
                        <h1>Please select a gender first to continue</h1>
                      </div>
                      <div class="mb-3 genderModalMain">
                        <label for="genderSelect" class="form-label">
                          Select Gender:
                        </label>
                        <select
                          onChange={(e) => setGetGender(e.target.value)}
                          class="form-select"
                          id="genderSelect"
                          name="gender"
                        >
                          <option selected disabled>
                            Select
                          </option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      {/* <button type="submit" class="btn btn-primary">Submit</button> */}

                      <Button
                        onClick={(e) => SendGender(e)}
                        type="submit"
                        class={"bottom-btn profile-btn w-100 mb-2"}
                        data={"Submit"}
                      />
                    </form>
                  </div>
                </div>
              </div>
            </Dialog>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
