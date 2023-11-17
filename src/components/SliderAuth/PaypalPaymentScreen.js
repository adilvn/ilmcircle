import React, { useEffect, useState } from "react";

//-----------images----------------------------//

//-----------components-------------------------//

import { useLocation, useNavigate } from "react-router-dom";
import { completedRegistration } from "../../Auth/ThankuAllText";
import Button from "../reuseable/Button";
import moment from "moment";
import { showMessage } from "../reuseable/Tostify";
import { Loader } from "../reuseable/Loader";
export const PaypalPaymentScreen = ({
    allData,
    showBtn, addClass,
    onButtonClick,
    selectedOption1,
    stripeDetails,
    setShowBtn,
    planDetails,
    paypalData,
    uid,

    email, roleData }) => {
    const [plans, setPlans] = useState([]);

    const [data, setData] = useState();
    const navigate = useNavigate();
    const [loader, setLoader] = useState();

    useEffect(() => {
        setData(allData);
        const trasectionDate = planDetails?.details?.update_time?.split('T')[0];
        const plan = [

            `Subscription Price: € ${planDetails?.details?.purchase_units[0]?.amount?.value}`,
            `Subscription Plan: ${planDetails?.planDetails?.name}`,
            `Payment Method: ${planDetails?.data?.paymentSource}`,
            `Order ID: ${planDetails?.data?.orderID}`,
            `Transaction Date: ${trasectionDate}`
        ];

        setPlans(plan)
    }, []);

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

    const sendPlans = [
        { SubscriptionPrice: `€ ${stripeDetails?.amount / 100}` },
        { SubscriptionPlan: planDetails?.name },
        { PaymentMethod: stripeDetails?.payment_method_details?.card?.brand },
        { OrderID: stripeDetails?.id },
        { Card: stripeDetails?.payment_method_details?.card?.brand },
        { exp_month: stripeDetails?.payment_method_details?.card?.exp_month },
        { exp_year: stripeDetails?.payment_method_details?.card?.exp_year },
        { TransactionDate: moment.unix(stripeDetails?.created).format("YYYY-MM-DD") },
        { FuturePayment: false },

    ]


    const sendPlansFuture = [
        { SubscriptionPrice: `€ ${stripeDetails?.amount / 100}` },
        { SubscriptionPlan: planDetails?.name },
        { PaymentMethod: stripeDetails?.payment_method_details?.card?.brand },
        { OrderID: stripeDetails?.id },
        { Card: stripeDetails?.payment_method_details?.card?.brand },
        { exp_month: stripeDetails?.payment_method_details?.card?.exp_month },
        { exp_year: stripeDetails?.payment_method_details?.card?.exp_year },
        { TransactionDate: moment.unix(stripeDetails?.created).format("YYYY-MM-DD") },
        { FuturePayment: true },


    ]


    {
        data?.length && (
            <div className="paymentSendBg my-4">
                {data?.map((item, index) => (
                    <p key={index} className="mb-1">
                        <span className={index === 0 ? 'subcriptionPriceTxt' : 'subcriptionPriceTxt2'}>{item}</span>
                    </p>
                ))}
            </div>
        )
    }


    const Signup = (check) => {
        setLoader(true)
        var formdata = new FormData();
        formdata.append("role", roleData?.prompt);
        formdata.append("email", email);
        formdata.append("planId", planDetails?._id);
        formdata.append("details", planDetails ? JSON.stringify(sendPlans) : JSON.stringify(sendPlansFuture));

        if (uid) {
            formdata.append("providerCode", uid);
            formdata.append("registrationType", "google");
        }


        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://ilmcircle.com/backend/api/user/signup", requestOptions)
            .then(response => response.json())
            .then(result => {

                if (result.status == 200) {
                    showMessage(result?.message)
                    if (uid) {
                        navigate('/login')
                    } else {
                        setShowBtn(true)
                    }

                    // if (check) {
                    //   // onButtonClic2()
                    //   onButtonClick()
                    //   // seEightCard(true)
                    //   setLoader(false)
                    // }
                    setLoader(false)

                } else {
                    showMessage(result?.message)
                    setLoader(false)

                }
            })
            .catch(error => {
                console.log('error', error)
                setLoader(false)

            });
    }

    const Signup2 = () => {
        navigate('/login')
        showMessage('signup Successfull')
    }


    const btnText = "Complete your registration"
    const btnTextNow = "Go to my mailbox"

    return (
        <>
            <section>
                {loader && <div className="loaderScreen">
                    <Loader />
                </div>}
                {showBtn ?

                    < div className="row thanks-row">

                        <h6 className="text-center text-dark">{completedRegistration?.heading}</h6>
                        <div className={`thanks-box ${addClass}`}>
                            <div className="thank-para">
                                <p className={`${addClass ? "mb-4" : ""}`}>{completedRegistration?.body1}</p>
                                {completedRegistration?.body2 && <p>{completedRegistration?.body2}</p>}
                            </div>
                            <div>
                                {showBtn ?
                                    < div onClick={() => Signup()} className="my-3 orange point text-center fw-bold completeRegBtn">
                                        {completedRegistration?.btn2Text}
                                    </div>
                                    :
                                    null
                                }
                            </div>
                        </div>
                    </div>
                    :

                    <div className="row thanks-row">
                        <h6 className="text-center text-dark">{data?.heading}</h6>
                        <div className={`thanks-box ${addClass}`}>
                            <div className="thank-para">
                                <p className={`${addClass ? "mb-4" : ""}`}>{data?.body1}</p>
                                {data?.body2 && <p>{data?.body2}</p>}
                            </div>

                            {plans?.length && (
                                <div className="paymentSendBg my-4">
                                    {plans?.map((item, index) => (
                                        <p key={index} className="mb-1">
                                            <span className={index === 0 ? 'subcriptionPriceTxt' : 'subcriptionPriceTxt2'}>{item}</span>
                                        </p>
                                    ))}
                                </div>
                            )}
                            <div>
                                <div onClick={() => Signup()} className="my-3 orange point text-center fw-bold completeRegBtn">
                                    {data?.btn2Text}
                                </div>
                            </div>
                        </div>
                    </div>
                }





                {showBtn ?
                    <Button
                        data={btnTextNow}
                        onClick={() => redirectToEmailService()}
                        class={"thank-btn w-35"}
                    ></Button>

                    :
                    <Button
                        data={btnText}
                        // onClick={onButtonClick}
                        onClick={() => uid ? Signup2() : Signup(true)}
                        class={"thank-btn w-35"}
                    ></Button>

                }

            </section >
        </>
    );
};
