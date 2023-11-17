import React, { useEffect, useState } from "react";

//-----------images----------------------------//
import left from "../asserts/images/auth left.png";
import right from "../asserts/images/auth right.png";
import { t } from "i18next";
import Button from "../components/reuseable/Button";
import Header from "../layout/Header";
import { Loader } from '../components/reuseable/Loader'
import { showMessage } from "../components/reuseable/Tostify";
import secureLocalStorage from "react-secure-storage";
import { useLocation } from "react-router-dom";
import API_Routes from "../Routes/API_Routes";


const ContactThankYou = () => {
    const [loader, setLoader] = useState(false);
    const token = secureLocalStorage.getItem('token')

    const location = useLocation()

    const { contactDetails } = location?.state || {};

    const sendCopyMsgToMail = () => {
        setLoader(true)
        var myHeaders = new Headers();
        // myHeaders.append("Accept", "application/json");
        // myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + token);

        var formdata = new FormData();
        formdata.append("id", contactDetails?._id);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch(API_Routes.SENDACOPY, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status === 200 || result.status === 201) {
                    setLoader(false)
                    showMessage(result?.message);
                } else {
                    showMessage(result?.message, 'error');
                    setLoader(false)

                }
            })
            .catch(error => {
                setLoader(false)
                console.log('error', error);
            });
    }

    return (
        <>
            <section>
                {loader && <div className="loaderScreen">
                    <Loader />
                </div>}
                <Header />
                <div className="container-fluid px-zero light-images">
                    <div className="img-left-side thank-left">
                        <img className="img-fluid" src={left} alt="" />
                    </div>
                    <div className="img-right-side">
                        <img className="img-fluid" src={right} alt="" />
                    </div>
                    <div className="container">
                        <div>
                            <div className="row align-items-center justify-content-center thanks-row contactThanksMain">
                                <h6 className="text-center text-dark">Thank you for reaching out!</h6>
                                <div className="contactCenterText">
                                    <p className="text-center ">Your message has been sent successfully.<br /> To receive a copy of your message, please click on the link below. </p>
                                </div>

                            </div>
                            <div className="text-center">
                                <Button onClick={() => sendCopyMsgToMail()} data={'Send a copy'} class={'thankYouContactBtn'} />
                            </div>

                            <div className="thankYouTxt2 mt-3">
                                <p className="text-center ">
                                    Please expect a response from our team within the next <span>2-3 business days</span>. Kindly note that response<br /> times may vary depending on the volume of inquiries we receive.
                                </p>
                            </div>

                            <div className="thankYouTxt3" >
                                <p className="text-center">We appreciate your patience and understanding.</p>
                            </div>

                            <div className="thankYouTxt4" >
                                <p className="text-center">Sincerely,</p>
                            </div>
                        </div>
                        <div className="ilmCircleTeamTxt">
                            <p className="text-center">
                                The <span className="orange-text">I</span>lm <span className="orange-text">C</span>ircle Team
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
};

export default ContactThankYou;
