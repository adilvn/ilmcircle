import React, { useEffect, useRef, useState } from 'react'
import './auth.css'

//----------components------------------//
import Header from '../layout/Header'
import Button from '../components/reuseable/Button'

//-----------images-------------------------//
import left from '../asserts/images/auth left.png'
import right from '../asserts/images/auth right.png'
import google from '../asserts/images/google.svg'
import backIcon from '../asserts/images/backIcon.png'
//----------library-------------------------//
import { ReactSVG } from 'react-svg'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import passwordIcon from '../asserts/images/password.svg'
import hidepasswordIcon from '../asserts/images/hidepassword.svg'
import { useFormik } from 'formik'
import { CreatePasswordScheme } from "../Schemas/CreatePasswordScheme";
import API_ENDPOINTS from '../Routes/API_Routes';
import { showMessage } from '../components/reuseable/Tostify'
import secureLocalStorage from 'react-secure-storage'
import { Loader } from '../components/reuseable/Loader'

const ResetPassword = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isRepeatePasswordVisible, setIsRepeatePasswordVisible] = useState(false);
    const [loader, setLoader] = useState(false);
    const [resetEmail, setResetEmail] = useState('');

    const navigate = useNavigate()

    const { t, i18n } = useTranslation();
    document.body.dir = i18n.dir();
    const InputField = ({ placeholder, type }) => (
        <input className="input-field" type={type} placeholder={placeholder} />
    );
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };
    const toggleRepeatePasswordVisibility = () => {
        setIsRepeatePasswordVisible(!isRepeatePasswordVisible);
    };

    const isVerifiedRef = useRef(true);

    const location = useLocation();
    // const resetEmail = secureLocalStorage.getItem('resetUserEmail')

    useEffect(() => {
        if (isVerifiedRef.current) {
            const urlParams = new URLSearchParams(window.location.search);
            const urlToken = urlParams.get('id');
            urlToken && verifyEmail(urlToken);
        }
    }, []);
    const verifyEmail = (urlToken) => {
        setLoader(true)
        isVerifiedRef.current = false;

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`https://ilmcircle.com/backend/api/user/auth/verify?id=${urlToken}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status == 200) {
                    setResetEmail(result?.data?.email)
                    const urlParams = new URLSearchParams(window.location.search);
                    urlParams.delete('id');
                    window.history.replaceState(null, null, window.location.pathname);
                    setLoader(false)
                    showMessage(result?.message)


                } else {
                    setLoader(false)
                    showMessage(result?.message, 'error')

                }

                if (result.message == "Verification link has expired. Please request a new verification link.") {
                    setLoader(false)
                    showMessage(result?.message)
                    navigate('/forget-password')
                } else if (result.message == "Your account has already been verified. You can now log in.") {
                    setLoader(false)
                    showMessage(result?.message)
                    navigate('/login')
                }


            })
            .catch(error => {
                console.log('error', error)
                setLoader(false)

            });
    }

    const initialValues = {
        password: "",
        confirm_password: "",
    };

    const handleLogout = () => {
        secureLocalStorage.removeItem("token");
        secureLocalStorage.removeItem("id");
        secureLocalStorage.removeItem("image");
        navigate("/login");
    };
    const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
        useFormik({
            initialValues,
            validationSchema: CreatePasswordScheme,
            validateOnChange: true,
            validateOnBlur: false,
            onSubmit: (values, action) => {
                const { email } = location.state || {};
                setLoader(true)

                var formdata = new FormData();
                formdata.append("email", resetEmail);
                formdata.append("password", values.password);

                var requestOptions = {
                    method: 'POST',
                    body: formdata,
                    redirect: 'follow'
                };

                fetch(API_ENDPOINTS.NEWPASSWORD, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        if (result.status == 200) {
                            handleLogout()
                            setLoader(false)
                            showMessage(result.message, 'success');
                        } else {
                            showMessage(result.message, 'error');
                            setLoader(false)


                        }
                    })
                    .catch(error => {
                        console.log('error', error)
                        setLoader(false)

                    });
            },
        });
    return (
        <>
            <section>
                {loader && <div className="loaderScreen">
                    <Loader />
                </div>}
                {/* <Header /> */}
                <div className="px-zero light-images">
                    {/* <div className='img-left-side'><img className='img-fluid' src={left} alt="" /></div>
                    <div className='img-right-side'><img className='img-fluid' src={right} alt="" /></div> */}
                    <div className='signInBackgroundImage'>
                        {/* <div className="login-rowMain"> */}
                        <div className="d-lflex">
                            <div className="login-row ">
                                <div className='login-box px-4 login-rowMain'>
                                    <div className='login-body'>

                                        <div className='forgetTextMain' style={{ marginTop: 15 }}>
                                            <h1>Reset password</h1>
                                            <p>Your new password must be different from the<br />previous one.</p>
                                        </div>

                                        <div className='login-form resetPasswordInput'>
                                            <form onSubmit={handleSubmit} className=" " noValidate>
                                                <div className="form-main w-100 mt-4">
                                                    <label htmlFor="fname">{'New password'}</label>
                                                    <div className="formInputMain">
                                                        <input
                                                            placeholder={'Input password'}
                                                            type={isPasswordVisible ? 'text' : 'password'}
                                                            className="input-field"
                                                            name="password"
                                                            value={values.password}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                        <div>
                                                            <img src={passwordIcon} alt="passwordIcon" className="icon" />

                                                        </div>
                                                        <div onClick={togglePasswordVisibility}>
                                                            {isPasswordVisible ? <img src={passwordIcon} alt="passwordIcon" className="icon" /> : <img src={hidepasswordIcon} alt="passwordIcon" className="icon" />}

                                                        </div>

                                                    </div>
                                                    {errors.password && touched.password ? (
                                                        <p className="form-error mt-2">{errors.password}</p>
                                                    ) : null}
                                                </div>



                                                {errors.password != 'At least 8 characters, including a mix of letters, numbers, and special characters.' ?
                                                    <div className='mb mt-2 resetPasswordIntruction'>
                                                        <p>
                                                            At least 8 characters, including a mix of letters, numbers, and special characters.
                                                        </p>
                                                    </div>
                                                    :
                                                    null
                                                }

                                                <div className="form-main w-100 mt-4">
                                                    <label htmlFor="fname">{'Repeat new password'}</label>
                                                    <div className="formInputMain">
                                                        <input
                                                            placeholder={'Input password'}
                                                            type={isRepeatePasswordVisible ? 'text' : 'password'}
                                                            className="input-field"
                                                            required
                                                            name="confirm_password"
                                                            value={values.confirm_password}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}

                                                        />
                                                        <div>
                                                            <img src={passwordIcon} alt="passwordIcon" className="icon" />
                                                        </div>
                                                        <div onClick={toggleRepeatePasswordVisibility}>
                                                            {isRepeatePasswordVisible ? <img src={passwordIcon} alt="passwordIcon" className="icon" /> : <img src={hidepasswordIcon} alt="passwordIcon" className="icon" />}

                                                        </div>

                                                    </div>
                                                    {errors.confirm_password && touched.confirm_password ? (
                                                        <p className="form-error mt-2">{errors.confirm_password}</p>
                                                    ) : null}
                                                </div>

                                            </form>
                                            <div>
                                                <div onClick={() => handleSubmit()}>
                                                    <Button class={'bottom-btn profile-btn w-100 mb-2'} data={'Reset password'}></Button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>





                                </div>
                            </div>
                        </div>
                        {/* </div> */}

                    </div>
                </div>
            </section>
        </>
    )
}

export default ResetPassword
