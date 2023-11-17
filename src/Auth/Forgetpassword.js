import React from 'react'
import './auth.css'

//----------components------------------//
import Header from '../layout/Header'
import Button from '../components/reuseable/Button'
import InputField from '../components/reuseable/InputField'

//-----------images-------------------------//
import left from '../asserts/images/auth left.png'
import right from '../asserts/images/auth right.png'
import google from '../asserts/images/google.svg'
import backIcon from '../asserts/images/backIcon.png'
//----------library-------------------------//
import { ReactSVG } from 'react-svg'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { forgetScheme } from '../Schemas/ForgetPasswordScheme';
import API_ENDPOINTS from '../Routes/API_Routes';
import secureLocalStorage from 'react-secure-storage'
import { showMessage } from '../components/reuseable/Tostify'
import { Loader } from '../components/reuseable/Loader'
import { useState } from 'react'


const Forgetpassword = () => {
    const { t, i18n } = useTranslation();
    document.body.dir = i18n.dir();
    const navigate = useNavigate()
    const [loader, setLoader] = useState(false);

    const initialValues = {
        email: "",
    };

    const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
        useFormik({
            initialValues,
            validationSchema: forgetScheme,
            validateOnChange: true,
            validateOnBlur: false,
            //// By disabling validation onChange and onBlur formik will validate on submit.
            onSubmit: (values, action) => {

                setLoader(true)
                var formdata = new FormData();
                formdata.append("email", values.email);

                var requestOptions = {
                    method: 'POST',
                    body: formdata,
                    redirect: 'follow'
                };

                fetch(API_ENDPOINTS.FORGETPASSWORD, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        if (result.status == 200) {
                            const passEmail = values?.email
                            secureLocalStorage.setItem('resetUserEmail', passEmail)
                            navigate('/confirm-email', { state: { email: passEmail } });
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
                                        <Link to={'/login'} className='d-flex align-items-center '>
                                            <img style={{ width: 24, height: 24 }} src={backIcon} alt='backIcon' />
                                            <p className='backBtn'>Back</p>
                                        </Link>
                                        <div className='forgetTextMain' style={{ marginTop: 40 }}>
                                            <h1>Forgot password?</h1>
                                            <p>Enter the e-mail address that you used to create the account. Then follow instructions in the e-mail that we will send you to reset your password.</p>
                                        </div>

                                        <div className='d-flex justify-content-center align-items-center'>
                                            <div style={{ width: '395px' }} className='login-form'>
                                                <form onSubmit={handleSubmit} className=" " noValidate>
                                                    <div className='mb form-main w-100 mt-3'>
                                                        <label htmlFor="fname">{'E-mail'}</label>
                                                        <InputField
                                                            placeholder={'Input e-mail address'}
                                                            type="email"
                                                            name='email'
                                                            value={values.email}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                        {errors.email && touched.email ? (
                                                            <p className="form-error mt-2">{errors.email}</p>
                                                        ) : null}
                                                    </div>

                                                    <div>
                                                        <div>
                                                            <Button class={'bottom-btn profile-btn w-100'} data={'Send instruction e-mail'}></Button>
                                                        </div>
                                                    </div>
                                                </form>
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

export default Forgetpassword
