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
import { logEvent, Result, ErrorResult } from './Util';
import './common.css';
import Header from '../../layout/Header'
import DashboardNavbar from '../../Dashboard/DashboardCmp/DashboardNavbar';
import Button from '../../components/reuseable/Button';


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
const CheckoutForm = () => {
    const elements = useElements();
    const stripe = useStripe();
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [postal, setPostal] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);

    const [processing, setProcessing] = useState(false);
    const [amountPaid, setAmountPaid] = useState(0);
    const [pi, setPi] = useState('');
    const [pm, setPmID] = useState('');
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (event) => {
        setLoading(true)
        event.preventDefault();
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
                // console.log('[error]', payload.error);
                setErrorMessage(payload.error.message);
                setPaymentMethod(null);
            } else {
                setPmID(payload.paymentMethod.id)
                // postPiID(payload.paymentMethod.id)
                setPaymentMethod(payload.paymentMethod);
                setErrorMessage(null);
            }
        } catch (error) {
            setError(error);
            console.error("Payment error: ", error);
        }


    }
    return (
        <div>
            <DashboardNavbar />
            <div className="container my-5">


                <div className="row align-items-start ">
                    <div className="col-md-6">
                        <div className='payment'>

                            <div>

                                <h1 className='mt-4'>Checkout</h1>
                                <p className='mt-4'>Quick checkout with</p>

                                <div className='paymentCards mt-3'>
                                    <img style={{ width: '126px' }} className='me-4' src={require('../../asserts/images/google.png')} />
                                    <img style={{ width: '126px' }} className='me-4' src={require('../../asserts/images/paypal.png')} />
                                </div>
                                <div className='d-flex justify-content-between align-items-center mt-4'>
                                    <p>Or checkout by card</p>
                                    <div className='paymentCards'>
                                        <img style={{ width: '30px' }} className='me-3' src={require('../../asserts/images/Mastercard.png')} />
                                        <img style={{ width: '30px' }} className='me-3' src={require('../../asserts/images/visa.png')} />
                                        <img style={{ width: '30px' }} className='me-3' src={require('../../asserts/images/americanExpress.png')} />

                                    </div>

                                </div>


                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className='sripeForm mt-4' >
                                <input
                                    id="name"
                                    required
                                    placeholder="Name on the card"
                                    className='stripeInput'
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                />
                                <CardNumberElement
                                    id="cardNumber"
                                    onBlur={logEvent('blur')}
                                    onChange={logEvent('change')}
                                    onFocus={logEvent('focus')}
                                    className='stripeInput'
                                    onReady={logEvent('ready')}
                                    options={ELEMENT_OPTIONS}
                                />
                                <div className="row">
                                    <div className="col-md-6">
                                        <CardExpiryElement
                                            id="expiry"
                                            onBlur={logEvent('blur')}
                                            onChange={logEvent('change')}
                                            onFocus={logEvent('focus')}
                                            className='stripeInput'
                                            onReady={logEvent('ready')}
                                            options={ELEMENT_OPTIONS}
                                        />
                                    </div>
                                    <div className="col md-6 paymentInputs">

                                        <CardCvcElement
                                            id="cvc"
                                            onBlur={logEvent('blur')}
                                            onChange={logEvent('change')}
                                            onFocus={logEvent('focus')}
                                            className='stripeInput'
                                            onReady={logEvent('ready')}
                                            options={ELEMENT_OPTIONS}
                                        />
                                    </div>

                                </div>



                                <div class="form-check saveCard">
                                    <input class="form-check-input stripcheck" type="checkbox" value="" id="defaultCheck1" />
                                    <label class="form-check-label" for="defaultCheck1">
                                        Save this card for future payments
                                    </label>
                                </div>

                                <div className='billingHeading'>
                                    <p className='mt-4'>Billing address</p>

                                    <input
                                        id="housenumber"
                                        required
                                        placeholder="House number, street name"
                                        className='billingInput'


                                    />
                                    <div className='d-flex align-items-center gap-2'>
                                        <input
                                            id="City"
                                            required
                                            placeholder="City"

                                            className='billingInput'


                                        />

                                        <input
                                            id="postcode"
                                            required
                                            type='number'
                                            placeholder="postcode"
                                            className='postcode'

                                        />
                                    </div>

                                    <div className='d-flex align-items-center gap-2'>
                                        <input
                                            id="Province"
                                            required
                                            placeholder="Province"
                                            className='billingInput'


                                        />

                                        <input
                                            id="Country"
                                            required
                                            placeholder="Country"
                                            className='billingInput'
                                        />
                                    </div>
                                </div>



                                <div className='d-flex justify-content-center align-items-center gap-4 mt-5 payBtn'>
                                    <Button class={'profile-btn'} data={'Pay now'} />
                                    <p>Cancel</p>
                                </div>


                            </div>



                        </form>
                    </div>

                    <div className='col-md-6 d-flex align-items-center justify-content-center mt-5 pt-5'>
                        <div className='summarySectionMain'>
                            <div className='summarySection'>
                                <h1>Class summary</h1>
                                <p>Memorize with Meaning: Understanding and Memorizing<br />the Quranic Verses</p>
                                <p>Teacher: Fatima Al-Rashid</p>

                            </div>
                            <div className='orderSummary'>
                                <h1>Order summary</h1>
                                <div className='d-flex justify-content-between align-items-center summarysectionTwo'>
                                    <p>Memorize with Meaning: Understanding<br />and Memorizing the Quranic Verses</p>
                                    <sub>$40</sub>
                                </div>

                                <div className='d-flex justify-content-between align-items-center summarysectionTwo'>
                                    <p>TVA(2%)</p>
                                    <sub>$2</sub>
                                </div>

                                <div className='d-flex justify-content-between align-items-center summarysectionTwo'>
                                    <p>Total amount</p>
                                    <sub>$42</sub>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

const stripePromise = loadStripe('pk_test_51MXPmGHG0vE1KySarl2KbF5gYObnmcJnMlXvAWdH9X1J2Lwwm61F2OJjwqB8zt4vf89fopbyf1t7OBKoHuQ8568b009C2XjeMH');

const CardMinimal = () => {

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
};

export default CardMinimal;

