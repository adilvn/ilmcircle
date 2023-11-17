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
import '../../views/Checkout/common.css';
import Header from '../../layout/Header'
import DashboardNavbar from '../../Dashboard/DashboardCmp/DashboardNavbar';
import Button from '../../components/reuseable/Button';
import { logEvent } from '../../views/Checkout/Util';
import warningICon from '../../asserts/images/warningIcon.png'
import Paypal from './Paypal';
import secureLocalStorage from 'react-secure-storage';
import { showMessage } from '../../components/reuseable/Tostify'
import { PaymentsScreens } from './PaymentsScreens';
import { Loader } from '../reuseable/Loader';
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
const CheckOut = ({ setSendDetails, isGoogle, uid, onButtonClick, setStripeData, onButtonClick2, planDetails, roleData, email, setSixthCard, setSeventhCard, setPaypalData }) => {
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

  const [saveCard, setSaveCard] = useState(false);

  const handleCheckboxChange = () => {
    setSaveCard(!saveCard);
    setSendDetails(!saveCard)

  };

  // useEffect(() => {

  //   postPaymentIntent(planDetails?.price)

  // }, [])
  // const price = secureLocalStorage.getItem('price')

  const btnText = 'Paynow';
  let piid
  const postPaymentIntent = async (price) => {
    const amount = parseFloat(planDetails?.price?.replace(",", "."));
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", "Bearer sk_test_51OAnvAECJ5FGZvDs15yVvNyCChnYZemnwaGHEyQOijpc0ncRaeVQkF4wthFKTAuDNjoRkbE7SCHRmOvjU9XqZR5F00l1Y2R8kY");

    var urlencoded = new URLSearchParams();
    urlencoded.append("amount", amount * 100);
    urlencoded.append("currency", "eur");
    urlencoded.append("automatic_payment_methods[enabled]", false);
    urlencoded.append("payment_method_types[]", "card");

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    try {
      const response = await fetch("https://api.stripe.com/v1/payment_intents", requestOptions);
      const result_1 = await response.json();
      piid = result_1.id;
    } catch (error) {
      console.error('error', error);
      throw error; // Re-throw the error to propagate it to the next catch
    }
  };



  const postPiID = async (pmID) => {
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

    try {
      const response = await fetch(`https://api.stripe.com/v1/payment_intents/${piid}/confirm`, requestOptions);
      const result_1 = await response.json();
      console.log('confirm', result_1);
      PaymentCharge(result_1?.latest_charge);
    } catch (error) {
      console.error('error', error);
      throw error;
    }
  };


  const [stripeDetails, setStripeDetails] = useState();

  const handleButtonClick = async (result) => {

    if (result) {
      const data = result
      setStripeData(data)

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
        console.log('result', result)
        setSeventhCard(false)
        handleButtonClick(result)
        onButtonClick()
        setLoader(false)

        // SendStripeDetails(result)
      })
      .catch(error => {
        console.log('error', error)
        setLoader(false)
      });
  }



  const handleSubmit = async (event) => {
    setLoading(true)
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
        // console.log('[error]', payload.error);
        showMessage(payload?.error?.message, 'error')
        setErrorMessage(payload.error.message);
        setPaymentMethod(null);
        setLoader(false)
      } else {
        // console.log('success', payload);
        setPmID(payload.paymentMethod.id)
        postPiID(payload.paymentMethod.id)
        setPaymentMethod(payload.paymentMethod);
        setErrorMessage(null);
        setLoader(false)

      }
    } catch (error) {
      setError(error);
      console.error("Payment error: ", error);
      setLoader(false)

    }

  }
  return (
    <div>
      {loader && <div className="loaderScreen">
        <Loader />
      </div>}
      <div className="container ">

        {/* {stripeDetails && <PaymentsScreens stripeDetails={stripeDetails} />} */}
        <div className="row justify-content-center align-items-start ">
          <div className="col-md-12 w-50 ">
            <div className='payment'>

              <div>

                <h1 className='mt-4 text-center'>Checkout</h1>
                <p className='mt-4'>Quick checkout with</p>

                <div className='paymentCards mt-3'>
                  <img onClick={() => setShowPayPal(false)} style={{ width: '126px', cursor: "pointer" }} className='me-4' src={require('../../asserts/images/google.png')} />
                  {/* <img onClick={() => setShowPayPal(true)} style={{ width: '126px', cursor: "pointer" }} className='me-4' src={require('../../asserts/images/paypal.png')} /> */}
                </div>


                {showPaypal ?

                  ""

                  :

                  <div className='d-flex justify-content-between align-items-center mt-4'>
                    <p>Checkout by card</p>
                    <div className='paymentCards'>
                      <img style={{ width: '30px' }} className='me-3' src={require('../../asserts/images/Mastercard.png')} />
                      <img style={{ width: '30px' }} className='me-3' src={require('../../asserts/images/visa.png')} />
                      <img style={{ width: '30px' }} className='me-3' src={require('../../asserts/images/americanExpress.png')} />

                    </div>

                  </div>
                }


              </div>
            </div>
            {showPaypal ?

              <Paypal
                paypalData={setStripeData}
                onButtonClick={onButtonClick2}
                planDetails={planDetails}
                roleData={roleData}
                email={email}
                isGoogle={isGoogle}
                uid={uid}
                setSixthCard={setSixthCard}
                setSeventhCard={setSeventhCard}
                setStripeData={setStripeData}
                setPaypalData={setPaypalData}

              />
              :
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

                  <div className="form-check saveCard align-items-center mb-0">
                    <input
                      style={{ marginTop: 6, cursor: 'pointer' }}
                      className="form-check-input stripcheck"
                      type="checkbox"
                      value=""
                      id="defaultCheck1"
                      checked={saveCard}
                      onChange={handleCheckboxChange}
                    />
                    <label className="form-check-label" htmlFor="defaultCheck1">
                      Save this card for future payments
                    </label>
                  </div>
                </div>
                <button
                  type='submit'
                  // onClick={onButtonClick}
                  className="thank-btn mt-3 w-35"
                >
                  {btnText}
                </button>
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

const CardMinimal = ({ onButtonClick, onButtonClick2, setSendDetails, setStripeData, planDetails, isGoogle, uid, roleData, email, setSixthCard, setSeventhCard, setPaypalData }) => {


  return (
    <Elements stripe={stripePromise}>
      <CheckOut onButtonClick2={onButtonClick2} setSendDetails={setSendDetails} roleData={roleData} isGoogle={isGoogle} uid={uid} onButtonClick={onButtonClick} setPaypalData={setPaypalData} setSixthCard={setSixthCard} setSeventhCard={setSeventhCard} setStripeData={setStripeData} planDetails={planDetails} email={email} />

    </Elements>
  );
};

export default CardMinimal;

