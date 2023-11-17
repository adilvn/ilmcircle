import React from 'react'
import '../../../Auth/auth.css'
import './Organizationdetails.css'

//----------components------------------//
import Header from '../../../layout/Header.js'
import Button from '../../../components/reuseable/Button'
import InputField from '../../../components/reuseable/InputField'

//-----------images-------------------------//
import left from '../../../asserts/images/auth left.png'
import right from '../../../asserts/images/auth right.png'

//----------library-------------------------//
import { ReactSVG } from 'react-svg'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { organizationScheme } from '../../../Schemas/OrganizationDetailsScheme'
import { useFormik } from 'formik'
import secureLocalStorage from 'react-secure-storage'
import API_Routes from '../../../Routes/API_Routes'
import { showMessage } from '../../../components/reuseable/Tostify'


const OrganizationDetail = ({ gotoNext }) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [changebar, setChangebar] = useState()
    document.body.dir = i18n.dir();
    const HandleClick = () => {
    }


    const initialValues = {
        orgName: "",
        orgAddress: "",
        orgWebsite: "",
        orgEmail: "",
        orgIntro: "",
    };

    const token = secureLocalStorage.getItem('token')
    // if (token) {
    //     navigate('/dashboard')
    // }
    const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
        useFormik({
            initialValues,
            validationSchema: organizationScheme,
            validateOnChange: true,
            validateOnBlur: false,
            onSubmit: (values, action) => {
                var formdata = new FormData();
                formdata.append("role", "organization");
                formdata.append("orgName", values.orgName);
                formdata.append("address", values.orgAddress);
                formdata.append("website", values.orgWebsite);
                formdata.append("email", values.orgEmail);
                formdata.append("introduction", values.orgIntro);

                var requestOptions = {
                    method: 'POST',
                    body: formdata,
                    redirect: 'follow'
                };

                fetch(API_Routes.SIGNUP, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        if (result.status == 200) {
                            showMessage(result?.message)
                            // gotoNext()

                        } else {
                            showMessage(result?.message, 'error')

                        }
                    })
                    .catch(error => console.log('error', error));


            },
        });

    return (
        <>
            <div className="container">
                <div className="row login-row pt-0">
                    <div className=' org-box px-3'>
                        <div className='login-body org-form'>
                            <h6 className='text-center'>{'Tell us about your organization!'}</h6>
                            <div className='my-5'></div>

                            <div className='login-form'>
                                <form onSubmit={handleSubmit}>
                                    <div className='row align-items-center row-cols-md-2 flex-md-nowrap'>
                                        <div className='mb form-main col col-12 '>
                                            <label htmlFor="fname">{'Organization name*'}</label>
                                            <InputField
                                                placeholder={'input text'}
                                                type="text"
                                                name='orgName'
                                                value={values.orgName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {errors.orgName && touched.orgName ? (
                                                <p className="form-error mt-2">{errors.orgName}</p>
                                            ) : null}
                                        </div>
                                        <div className='mb form-main col-12 col'>
                                            <label htmlFor="fname">{'Address*'}</label>
                                            <InputField
                                                placeholder={'input text'}
                                                type="text"
                                                name='orgAddress'
                                                value={values.orgAddress}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {errors.orgAddress && touched.orgAddress ? (
                                                <p className="form-error mt-2">{errors.orgAddress}</p>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className='row align-items-center row-cols-md-2 flex-md-nowrap'>
                                        <div className='mb form-main col col-12'>
                                            <label htmlFor="fname">{'Website'}</label>
                                            <InputField
                                                placeholder={'input text'}
                                                type="text"
                                                name='orgWebsite'
                                                value={values.orgWebsite}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {errors.orgWebsite && touched.orgWebsite ? (
                                                <p className="form-error mt-2">{errors.orgWebsite}</p>
                                            ) : null}
                                        </div>
                                        <div className='mb form-main col-12 col'>
                                            <label htmlFor="fname">{'Contact e-mail*'}</label>
                                            <InputField
                                                placeholder={'input text'}
                                                type="email"
                                                name='orgEmail'
                                                value={values.orgEmail}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {errors.orgEmail && touched.orgEmail ? (
                                                <p className="form-error mt-2">{errors.orgEmail}</p>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className='mb form-main col col-12'>
                                        <label htmlFor="fname">{'Introduction about your mission and service '}</label>
                                        <textarea
                                            cols="30" rows="10"
                                            placeholder='input text'
                                            name='orgIntro'
                                            value={values.orgIntro}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {errors.orgIntro && touched.orgIntro ? (
                                            <p className="form-error mt-2">{errors.orgIntro}</p>
                                        ) : null}
                                    </div>
                                    <div className="org-btn mb-4">
                                        {/* <Link > */}
                                        <Button
                                            type={'submit'}
                                            onClick={HandleClick}
                                            class={"bottom-btn profile-btn "}
                                            data={"Sign up"}
                                        />
                                        {/* </Link> */}
                                        <Link to={"/signup"}>Go Back</Link>
                                    </div>

                                </form>


                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default OrganizationDetail



