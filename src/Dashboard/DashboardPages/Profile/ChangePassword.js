import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { ReactSVG } from 'react-svg'
import { useTranslation } from 'react-i18next'
import passwordIcon from '../../../asserts/images/password.svg'
import hidepasswordIcon from '../../../asserts/images/hidepassword.svg'
import Button from '../../../components/reuseable/Button'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from "formik";
import { ChangePasswordSchema } from "../../../Schemas/ChangePasswordScheme";
import secureLocalStorage from "react-secure-storage";
import { showMessage } from "../../../components/reuseable/Tostify";
import { Loader } from "../../../components/reuseable/Loader";


export const ChangePassword = ({ showModal, handleModal, setLoader, setShowModal }) => {
    const [data, setData] = useState({});
    const [step, setStep] = useState(true);
    const handleStep2 = () => {
        setStep(false);
    };
    const navigate = useNavigate()
    const token = secureLocalStorage.getItem("token");

    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isRepeatePasswordVisible, setIsRepeatePasswordVisible] = useState(false);

    const { t, i18n } = useTranslation();
    document.body.dir = i18n.dir();
    const InputField = ({ placeholder, type }) => (
        <input className="input-field" type={type} placeholder={placeholder} />
    );
    const toggleCurrentPasswordVisibility = () => {
        setIsCurrentPasswordVisible(!isCurrentPasswordVisible);
    };
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };
    const toggleRepeatePasswordVisibility = () => {
        setIsRepeatePasswordVisible(!isRepeatePasswordVisible);
    };

    const initialValues = {
        current_password: "",
        new_password: "",
        repeat_new_password: ""
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
            validationSchema: ChangePasswordSchema,
            validateOnChange: true,
            validateOnBlur: false,
            onSubmit: (values, action) => {
                setLoader(true)

                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer " + token);

                var formdata = new FormData();
                formdata.append("password", values.current_password);
                formdata.append("newPassword", values.new_password);

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: formdata,
                    redirect: 'follow'
                };

                fetch("https://ilmcircle.com/backend/api/student/profile/change/password", requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        // console.log('Password chanegd successfully', result)

                        if (result?.status == 200 || result.status == 201) {
                            // navigate('/dashboard')
                            setLoader(false)
                            setShowModal(false)
                            showMessage(result.message)
                            handleLogout()
                        } else {
                            // navigate('/dashboard')
                            setLoader(false)
                            showMessage(result.message, 'error')

                        }

                    })

                    .catch(error => {
                        setLoader(false)
                        console.log('error', error)
                    });
            },
        });
    return (
        <div>

            <Dialog
                visible={showModal}
                dismissableMask={true}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                modal
                draggable={false}
                className=" createEventOrganizationModal "
                onHide={handleModal}
            >
                <div className=" mt-2 p-4 pt-4">

                    <div className='login-form resetPasswordInput'>
                        <form onSubmit={handleSubmit} className=" " noValidate>
                            <div className="form-main w-100 mt-4">
                                <label htmlFor="fname">{'Current password'}</label>
                                <div className="formInputMain">
                                    <input
                                        placeholder={'Input current password'}
                                        type={isCurrentPasswordVisible ? 'text' : 'password'}
                                        className="input-field"
                                        name='current_password'
                                        value={values.current_password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />

                                    <img src={passwordIcon} alt="passwordIcon" className="icon" />
                                    <div onClick={toggleCurrentPasswordVisibility}>
                                        {isCurrentPasswordVisible ? <img src={passwordIcon} alt="passwordIcon" className="icon" /> : <img src={hidepasswordIcon} alt="passwordIcon" className="icon" />}

                                    </div>

                                </div>

                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="form-error mb-0">
                                    {errors.current_password && touched.current_password ? (
                                        <p className="mb-0">{errors.current_password}</p>
                                    ) : null}
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1" />
                                    <span><Link className='text-blue loginForgetStyle' to="/forget-password">{'Forgot password?'}</Link></span>
                                </div>
                            </div>




                            <div style={{ marginTop: 30 }} className="form-main w-100 ">
                                <label htmlFor="fname">{'New password'}</label>
                                <div className="formInputMain">
                                    <input

                                        placeholder={'Input new password'}
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        className="input-field"
                                        name='new_password'
                                        value={values.new_password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />

                                    <img src={passwordIcon} alt="passwordIcon" className="icon" />
                                    <div onClick={togglePasswordVisibility}>
                                        {isPasswordVisible ? <img src={passwordIcon} alt="passwordIcon" className="icon" /> : <img src={hidepasswordIcon} alt="passwordIcon" className="icon" />}

                                    </div>

                                </div>
                                {errors.new_password && touched.new_password ? (
                                    <p className="form-error mt-2">{errors.new_password}</p>
                                ) : null}
                            </div>



                            {errors.new_password != 'At least 8 characters, including a mix of letters, numbers, and special characters.' ?
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
                                        placeholder={'Input new password'}
                                        type={isRepeatePasswordVisible ? 'text' : 'password'}
                                        className="input-field"
                                        name='repeat_new_password'
                                        value={values.repeat_new_password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />

                                    <img src={passwordIcon} alt="passwordIcon" className="icon" />
                                    <div onClick={toggleRepeatePasswordVisibility}>
                                        {isRepeatePasswordVisible ? <img src={passwordIcon} alt="passwordIcon" className="icon" /> : <img src={hidepasswordIcon} alt="passwordIcon" className="icon" />}

                                    </div>

                                </div>
                                {errors.repeat_new_password && touched.repeat_new_password ? (
                                    <p className="form-error mt-2">{errors.repeat_new_password}</p>
                                ) : null}
                            </div>

                        </form>
                        <div>
                            <div onClick={() => handleSubmit()}>
                                <Button class={'bottom-btn profile-btn w-100'} data={'Reset password'}></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};
