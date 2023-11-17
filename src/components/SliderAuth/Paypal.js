import React, { useEffect, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast, ToastContainer } from 'react-toastify';
import Button from '../reuseable/Button';
import { showMessage } from '../reuseable/Tostify';
import { PaymentsScreens } from './PaymentsScreens';
import { PaypalPaymentScreen } from './PaypalPaymentScreen';


const Paypal = ({ onButtonClick, paypalData, uid, planDetails, roleData, email, setStripeData, setSixthCard, setSeventhCard, setPaypalData }) => {






    // const history = useHistory()
    // const location = useLocation();
    // const data = secureLocalStorage.getItem('name');
    // const name = data.substring(data.indexOf('[') + 1, data.indexOf(']')).replace(/"/g, '');

    // const lastname = secureLocalStorage.getItem('lastname');

    const [cost, setcost] = useState('')
    // const [stateParam, setStateParam] = useState('')

    const [id, setId] = useState('')
    const [PaymentId, setPaymentId] = useState('')
    const [payerId, setPayerId] = useState('')
    const [payerEmail, setPayerEmail] = useState('')
    const [amount, setAmount] = useState('')
    const [status, setStatus] = useState('')
    const [currency, setCurrency] = useState('')
    const accessToken = secureLocalStorage.getItem('accessToken')
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    const [data, setData] = useState('')
    const [details, setDetails] = useState('')



    // useEffect(() => {
    //     window.scrollTo(0, 0);
    //     const accessToken = secureLocalStorage.getItem('accessToken');
    //     if (!accessToken) {
    //         history.push('./');
    //     }
    // }, [])


    // const searchParams = new URLSearchParams(location.search);
    // const selectedCost = searchParams?.get('selectedCost');
    // const stateParam = searchParams?.get('stateParam');
    // const notify = (message, type) => {
    //     // alert('error', +message)
    //     type == "success" ? toast.success(message, {

    //         position: "top-center",
    //         autoClose: 1000,
    //         hideProgressBar: true,
    //         closeOnClick: false,
    //         closeButton: false,
    //         pauseOnHover: false,
    //         draggable: true,
    //         progress: undefined,
    //         theme: "colored",
    //     }) :
    //         toast.error(message, {
    //             position: "top-center",
    //             autoClose: 1000,
    //             hideProgressBar: true,
    //             closeOnClick: false,
    //             closeButton: false,
    //             pauseOnHover: false,
    //             draggable: true,
    //             progress: undefined,
    //             theme: "colored",

    //             style: {
    //                 backgroundColor: '#D92533'
    //             }
    //         });
    // }


    const initialOptions = {
        "client-id": "AU9NEBXE--1xhNuGTu8FEPsCtUD81_37xBfXwlDLVMe9g1CRqaTuz5DrIiLhWZhoqxOS1T9U3Q_hxNTX",
        currency: "EUR",
    };


    const onInit = () => {
        setIsScriptLoaded(true);
    };

    setTimeout(() => {
        setIsScriptLoaded(true);
    }, 3000);

    return (
        <div>

            <div className='container paymentMain'>
                <div className='row'>
                    {/* <h6>Hi, Maaz,</h6> */}
                    <div className=' col-md-12 mt-5'>
                        {/* <div className='payment'>
                            <div>
                                <h1>Pay Ads Dot $50</h1>
                            </div>
                        </div> */}

                        <div className="App-body">
                            <PayPalScriptProvider options={initialOptions} onInit={onInit}>
                                {isScriptLoaded ?
                                    <PayPalButtons
                                        createOrder={(data, actions) => {


                                            return actions.order.create({
                                                purchase_units: [
                                                    {
                                                        amount: {
                                                            value: parseFloat(planDetails?.price?.replace(",", "."))



                                                        },
                                                    },
                                                ],
                                            });
                                        }}

                                        onApprove={async (data, actions) => {
                                            const details = await actions.order.capture();

                                            const trasectionDate = details?.update_time.split('T')[0];

                                            const plans = [`Subscription Price: € ${details?.purchase_units[0]?.amount?.value}`,
                                            `Subscription Plan: ${planDetails?.name}`,
                                            `Payment Method: ${data?.paymentSource}`,
                                            `Order ID: ${data?.orderID}`,
                                            `Transaction Date: ${trasectionDate}`]


                                            var formdata = new FormData();
                                            formdata.append("role", roleData?.prompt);
                                            formdata.append("email", email);
                                            formdata.append("planId", planDetails?._id);
                                            formdata.append("details", plans);


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
                                                        if (!uid) {
                                                            showMessage(result?.message)

                                                        }
                                                        onButtonClick()
                                                        setSixthCard(false)
                                                        setSeventhCard(true)
                                                        setPaypalData({ data, details, planDetails })
                                                        setData(data)
                                                        setDetails(details)
                                                        setStripeData(data)



                                                        // setPaypalData({ data, details, planDetails })
                                                        // setData(data)
                                                        // setDetails(details)
                                                        // setStripeData(data)


                                                    } else {
                                                        showMessage(result?.message)
                                                    }
                                                })
                                                .catch(error => console.log('error', error));

                                        }}
                                    />
                                    :
                                    <p>Loading...</p>
                                }

                            </PayPalScriptProvider>

                        </div>

                    </div>

                    {/* <div className='col-md-6 px-5 rowTwohead'>
                        <h1>Summary</h1>
                        <div className='summaryPaypal'>
                            <div className='row summarySecTwo'>
                                <div className='col-md-10'>
                                    <h2>Feature 1 Ad for 7 Days</h2>
                                    <p>Quantity 1 • $50 each</p>
                                </div>
                                <div className='col-md-2'>
                                    <h2>$50</h2>
                                </div>
                            </div>

                            <div className='hrLine'></div>

                            <div className='summaryTotal'>
                                <div className='row'>
                                    <div className='col-md-10'>
                                        <h2>Total Order Amount</h2>
                                    </div>
                                    <div className='col-md-2'>
                                        <h2>$50</h2>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div> */}


                </div>
            </div>
        </div >
    )
}

export default Paypal
