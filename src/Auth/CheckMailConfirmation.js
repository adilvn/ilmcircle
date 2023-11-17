import React, { useEffect } from 'react'
import './auth.css'

//----------components------------------//
import Header from '../layout/Header'
import Button from '../components/reuseable/Button'
import InputField from '../components/reuseable/InputField'

//-----------images-------------------------//
import left from '../asserts/images/auth left.png'
import right from '../asserts/images/auth right.png'
import checkMailIcon from '../asserts/images/checkMainIcon.png'
import backIcon from '../asserts/images/backIcon.png'
//----------library-------------------------//
import { ReactSVG } from 'react-svg'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import API_ENDPOINTS from '../Routes/API_Routes';
import { Loader } from '../components/reuseable/Loader'
import secureLocalStorage from 'react-secure-storage'
import { showMessage } from '../components/reuseable/Tostify'
import { useState } from 'react'


const CheckMailConfirmation = () => {
    const { t, i18n } = useTranslation();
    document.body.dir = i18n.dir();

    const [loader, setLoader] = useState(false);
    const [email, setEmail] = useState(false);

    const navigate = useNavigate()
    const location = useLocation();

    const redirectToEmailService = () => {
        const domain = email?.split('@')[1];

        const redirectionUrls = {
            'gmail.com': 'https://gmail.com',
            'yahoo.com': 'https://yahoo.com',
            'hotmail.com': 'https://outlook.live.com/owa/',
            'outlook.com': 'https://outlook.live.com/owa/',
            'aol.com': 'https:/aol.com',
            'icloud.com': 'https://www.icloud.com/mail',
            'protonmail.com': 'https://protonmail.com',
            'zoho.com': 'https://zoho.com/mail',

        };

        if (redirectionUrls.hasOwnProperty(domain)) {
            const redirectUrl = redirectionUrls[domain];
            window.open(redirectUrl, '_blank');
        } else {
            showMessage(`No redirection URL defined for domain: ${domain}`, 'error')
        }
    };

    useEffect(() => {
        const { email } = location.state || {};
        setEmail(email)
    }, [])

    const ResendEmail = () => {
        setLoader(true)
        var formdata = new FormData();
        formdata.append("email", email);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch(API_ENDPOINTS.FORGETPASSWORD, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status == 200) {
                    // navigate('/dashboard')

                    secureLocalStorage.setItem('resetUserEmail', email)
                    navigate('/confirm-email');
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

    }
    return (
        <>
            <section>
                {loader && <div className="loaderScreen">
                    <Loader />
                </div>}
                {/* <Header /> */}
                {/* <Header /> */}
                <div className="px-zero light-images">
                    {/* <div className='img-left-side'><img className='img-fluid' src={left} alt="" /></div>
                    <div className='img-right-side'><img className='img-fluid' src={right} alt="" /></div> */}
                    <div className='signInBackgroundImage'>
                        {/* <div className="login-rowMain"> */}
                        <div className="d-lflex">
                            <div className="login-row ">
                                <div className='login-box px-4 login-rowMain w-38'>
                                    <div className='login-body py-2'>
                                        <div className='text-center'>
                                            <img className='image-height-width' src={checkMailIcon} alt='backIcon' />

                                        </div>
                                        <div className='d-flex justify-content-center align-items-center'>
                                            <div className='forgetTextMain margin-model-top' style={{ marginTop: 40 }}>
                                                <h1>Please check your mailbox</h1>
                                                <p>We have sent you an e-mail with instructions to reset your password.</p>
                                            </div>
                                        </div>
                                        <div >
                                            <Button
                                                data={"Go to mailbox"}
                                                onClick={() => redirectToEmailService()}
                                                class={"thank-btn w-75 mt-3 mb-3"}
                                            ></Button>
                                        </div>



                                    </div>

                                    <div className='forgetPasswordSpan'>
                                        <p>
                                            Kindly allow a few moments for the e-mail to arrive and don't forget to check your spam folder or <span onClick={() => ResendEmail()}><Link >resend the e-mail.</Link></span>
                                        </p>
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

export default CheckMailConfirmation
