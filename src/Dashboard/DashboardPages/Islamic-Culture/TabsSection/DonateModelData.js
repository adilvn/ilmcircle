import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js';
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    Elements,
    useElements,
    useStripe
} from '@stripe/react-stripe-js';
import '../../../../views/Checkout/common.css';
import { logEvent } from '../../../../views/Checkout/Util';
import secureLocalStorage from 'react-secure-storage';
import { showMessage } from '../../../../components/reuseable/Tostify'
import { Loader } from '../../../../components/reuseable/Loader';
import Paypal from '../../../../components/SliderAuth/Paypal';
import { Link } from 'react-router-dom';
import Button from '../../../../components/reuseable/Button';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import API_Routes from '../../../../Routes/API_Routes';
const ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: '18px',
            color: '#424770',
            letterSpacing: '0.025em',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#9e2146',
        },
    },
};
const DonateModel = ({ onButtonClick, id, sedingTitle, GetProjects, projectsID, showModal, setShowModal, handleModal, setStripeData, planDetails, roleData, email, setSixthCard, setSeventhCard, setPaypalData }) => {
    const elements = useElements();
    const stripe = useStripe();
    const [name, setName] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [code, setCode] = useState('');

    const [error, setError] = useState(null);
    const [postal, setPostal] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);

    const [processing, setProcessing] = useState(false);
    const [amountPaid, setAmountPaid] = useState(0);
    const [pi, setPi] = useState('');
    const [pm, setPmID] = useState('');
    const [value, setValue] = useState('');

    const [loading, setLoading] = useState(false);
    const [showPaypal, setShowPayPal] = useState(false);
    const token = secureLocalStorage.getItem('token')
    const [loader, setLoader] = useState(false);


    const [data, setData] = useState({});
    const [step, setStep] = useState(true);
    const handleStep2 = () => {
        setStep(false);
    };


    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isRepeatePasswordVisible, setIsRepeatePasswordVisible] = useState(false);
    const [fname, setfName] = useState('');
    const [lname, setlName] = useState('');
    const [amount, setAmount] = useState('');
    const [payMethod, setPayMethod] = useState('');
    const [expDate, setExpDate] = useState('');
    const { t, i18n } = useTranslation();
    const [addTax, setAddTax] = useState("")
    const [myNewAmount, setMynewAmout] = useState('')
    // useEffect(() => {

    //     postPaymentIntent(planDetails?.price)

    // }, [])
    // const price = secureLocalStorage.getItem('price')
    useEffect(() => {
        const newAmout = +amount + +addTax
        setMynewAmout(newAmout)



    }, [addTax])
    const btnText = 'Paynow';
    let piid

    const postPaymentIntent = (price) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append("Authorization", "Bearer sk_test_51OAnvAECJ5FGZvDs15yVvNyCChnYZemnwaGHEyQOijpc0ncRaeVQkF4wthFKTAuDNjoRkbE7SCHRmOvjU9XqZR5F00l1Y2R8kY");

        var urlencoded = new URLSearchParams();
        urlencoded.append("amount", myNewAmount * 100);
        urlencoded.append("currency", "usd");
        urlencoded.append("automatic_payment_methods[enabled]", false);
        urlencoded.append("payment_method_types[]", "card");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("https://api.stripe.com/v1/payment_intents", requestOptions)
            .then(response => response.json())
            .then(result => {
                // console.log('result',result.id)
                piid = result.id
            })
            .catch(error => {
                console.log('error', error)

            });
    }

    const postPiID = (pmID) => {
        setLoader(true)

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer sk_test_51OAnvAECJ5FGZvDs15yVvNyCChnYZemnwaGHEyQOijpc0ncRaeVQkF4wthFKTAuDNjoRkbE7SCHRmOvjU9XqZR5F00l1Y2R8kY");
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("payment_method", pmID);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`https://api.stripe.com/v1/payment_intents/${piid}/confirm`, requestOptions)
            .then(response => response.json())
            .then(result => {
                PaymentCharge(result?.latest_charge)

            })
            .catch(error => console.log('error', error));
    }

    const [stripeDetails, setStripeDetails] = useState();

    const handleButtonClick = async (result) => {


        if (result) {
            const data = result
            setStripeData(data)
            // setStripeDetails(result);

        }
    };


    const PaymentCharge = (charge) => {
        setLoader(true)
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append("Authorization", "Bearer sk_test_51OAnvAECJ5FGZvDs15yVvNyCChnYZemnwaGHEyQOijpc0ncRaeVQkF4wthFKTAuDNjoRkbE7SCHRmOvjU9XqZR5F00l1Y2R8kY");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://api.stripe.com/v1/charges/${charge}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                SendStripeDetails(result)

            })
            .catch(error => {
                console.log('error', error)

                setLoader(false)
            });
    }


    const SendStripeDetails = (data) => {
        setLoader(true)
        const plans = [
            `Order ID: ${data?.id}`,
            `Subscription Price: € ${data?.amount / 100}`,
            `Card: ${data?.payment_method_details?.card?.brand}`,
            `exp_month: ${data?.payment_method_details?.card?.exp_month}`,
            `exp_year: ${data?.payment_method_details?.card?.exp_year}`,
            `Transaction Date: ${moment.unix(data?.created).format("YYYY-MM-DD")}`,

        ]

        // setLoa(true)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        var formdata = new FormData();
        formdata.append("projectId", projectsID);
        formdata.append("amount", myNewAmount);
        formdata.append("paymentMethod", "stripe");
        formdata.append("details", plans);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch(API_Routes.PROJECTDONATENOW, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result?.status == 200 || result?.status == 201) {
                    GetProjects(id)
                    setTimeout(function () { setLoader(false) }, 5000);
                    setShowModal(false)

                    showMessage(result.message)
                } else {
                    setLoader(false)

                    showMessage(result.message, 'error')

                }
            })
            .catch(error => {
                setShowModal(false)

                console.log('error', error)
            });
    }


    const handleSubmit = async (event) => {
        setLoader(true)
        event.preventDefault();
        postPaymentIntent()
        if (!stripe || !elements) {

            return;
        }
        const card = elements.getElement(CardNumberElement);
        if (card == null) {
            return;
        }

        try {
            const payload = await stripe.createPaymentMethod({

                type: 'card',
                card,
                billing_details: {
                    name,
                    address: {
                        postal_code: postal,
                    },
                },
            });


            if (payload.error) {
                setLoader(false)

                showMessage(payload?.error?.message, 'error')
                setErrorMessage(payload.error.message);
                setPaymentMethod(null);

            } else {
                // console.log('success', payload.paymentMethod.id, payload.paymentMethod.id, payload.paymentMethod);
                setPmID(payload.paymentMethod.id)
                postPiID(payload.paymentMethod.id)
                setPaymentMethod(payload.paymentMethod);
                setErrorMessage(null);


            }
        } catch (error) {
            setError(error);

            console.error("Payment error: ", error);
            setLoader(false)

        }

    }
    useEffect(() => {
        setAddTax(amount * 0.02)
    }, [amount])

    return (
        <div>
            {loader && <div className="loaderScreen">
                <Loader />
            </div>}
            <div className="container pt-3">
                <div className="">
                    <div className='login-form resetPasswordInput'>
                        <h1 className="donateHeadText">{sedingTitle ? sedingTitle : ""}</h1>

                    </div>
                    <div className="col-md-12">
                        {showPaypal ?

                            <Paypal
                                paypalData={setStripeData}
                                onButtonClick={onButtonClick}
                                planDetails={planDetails}
                                roleData={roleData}
                                email={email}
                                setSixthCard={setSixthCard}
                                setSeventhCard={setSeventhCard}
                                setStripeData={setStripeData}
                                setPaypalData={setPaypalData}

                            />
                            :
                            <form onSubmit={handleSubmit}>


                                <div className='sripeForm mt-4 donateModalForm' >
                                    <div className="row mt-4">
                                        <div className="col-md-6">
                                            <label>First name </label>
                                            <div className="mt-1">

                                                <input
                                                    id="name"
                                                    required
                                                    placeholder="input text"
                                                    className='stripeInput'
                                                    value={fname}
                                                    onChange={(e) => {
                                                        setfName(e.target.value);
                                                    }}
                                                />
                                            </div>

                                        </div>
                                        <div className="col md-6 paymentInputs ">
                                            <label>Last name</label>
                                            <div className="mt-1">

                                                <input
                                                    id="month"
                                                    required
                                                    placeholder="input text"
                                                    className='stripeInput'
                                                    value={lname}
                                                    onChange={(e) => {
                                                        setlName(e.target.value);
                                                    }}
                                                />
                                            </div>

                                        </div>
                                    </div>

                                    <div>
                                        <label>E-mail</label>
                                        <div className="mt-1">

                                            <input
                                                id="name"
                                                required
                                                placeholder="input text"
                                                className='stripeInput'
                                                type="email"
                                            // value={email}
                                            // onChange={(e) => {
                                            //     setEmail(e.target.value);
                                            // }}
                                            />
                                        </div>

                                    </div>

                                    <div>
                                        <label>Enter amount</label>

                                        <div className="mt-1">
                                            <input
                                                id="name"
                                                required
                                                placeholder="$ 100.00"
                                                className='stripeInput'
                                                value={amount}
                                                type="number"
                                                onChange={(e) => {
                                                    setAmount(e.target.value);
                                                }}
                                            />
                                        </div>

                                    </div>
                                    <div className='sripeForm mt-1 form-main w-100' >
                                        <label htmlFor="fname">{'Payment method'}</label>
                                        <div>
                                            <CardNumberElement
                                                id="cardNumber"
                                                onBlur={logEvent('blur')}
                                                onChange={logEvent('change')}
                                                onFocus={logEvent('focus')}
                                                className='stripeInput mt-0'
                                                onReady={logEvent('ready')}
                                                options={ELEMENT_OPTIONS}
                                            />
                                            <div className='eventStripeIcon'>
                                                <img className="icon" style={{ width: '30px' }} src={require('../../../../asserts/images/Mastercard.png')} alt="passwordIcon" />
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">

                                                <label className='mt-lg-0 mt-sm-0' htmlFor="fname">{'Expiry date'}</label>

                                                <CardExpiryElement
                                                    id="expiry"
                                                    onBlur={logEvent('blur')}
                                                    onChange={logEvent('change')}
                                                    onFocus={logEvent('focus')}
                                                    className='stripeInput mt-0'
                                                    onReady={logEvent('ready')}
                                                    options={ELEMENT_OPTIONS}
                                                />
                                            </div>
                                            <div className="col md-6  paymentInputs">
                                                <label className='mt-lg-0' htmlFor="fname">{'CVV'}</label>
                                                <CardCvcElement
                                                    id="cvc"
                                                    onBlur={logEvent('blur')}
                                                    onChange={logEvent('change')}
                                                    onFocus={logEvent('focus')}
                                                    className='stripeInput mt-0'
                                                    onReady={logEvent('ready')}
                                                    options={ELEMENT_OPTIONS}
                                                />
                                            </div>

                                        </div>
                                    </div>

                                </div>



                                <div className='orderSummary'>
                                    <div className='d-flex justify-content-between align-items-center  donateOrderSummary'>
                                        <p>Subtotal</p>
                                        <sub>${amount ? amount : 0}</sub>  </div>

                                    <div className='d-flex justify-content-between align-items-center donateOrderSummary'>
                                        <p>TVA(2%)</p>
                                        <sub>${(amount * 0.02)}</sub>
                                    </div>
                                    <hr
                                        style={{
                                            marginTop: "0.5rem",
                                            marginBottom: "0.5rem",
                                        }}
                                    ></hr>
                                    <div className='d-flex justify-content-between align-items-center  donateOrderSummary'>
                                        <h5>Total amount</h5>
                                        <sub>${amount ? +amount + +addTax : 0}</sub>
                                    </div>
                                </div>




                                <div>
                                    <Button type={"submit"} disabled={!stripe} class={'bottom-btn profile-btn w-100'} data={'Donate now'}></Button>
                                </div>
                                {/* <button type='submit' disabled={!stripe} onClick={(e) => handleSubmit(e)}>Submit</button> */}
                            </form>
                        }



                    </div>



                </div>
            </div>
        </div>
    )
}

const stripePromise = loadStripe('pk_test_51OAnvAECJ5FGZvDsiXiuZRY4Hjl5wAxxHAz8H017eXxTKogcMsFmrrcI23qA99cUQW4WZX34zegOEVmDvvec63ui00GcAWqD0D');

const CardMinimal = ({ onButtonClick, sedingTitle, id, setStripeData, GetProjects, setShowModal, planDetails, roleData, email, setSixthCard, setSeventhCard, setPaypalData, projectsID, showModal, handleModal }) => {


    return (
        <Elements stripe={stripePromise}>
            <DonateModel sedingTitle={sedingTitle} id={id} GetProjects={GetProjects} roleData={roleData} setShowModal={setShowModal} projectsID={projectsID} onButtonClick={onButtonClick} setPaypalData={setPaypalData} setSixthCard={setSixthCard} setSeventhCard={setSeventhCard} setStripeData={setStripeData} planDetails={planDetails} email={email} showModal={showModal} handleModal={handleModal} />
        </Elements>
    );
};

export default CardMinimal;


