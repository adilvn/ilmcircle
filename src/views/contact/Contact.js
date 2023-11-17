import React, { useState } from 'react'
import '../contact/contact.css'

//--------------components--------------//s
import Header from '../../layout/Header'
import main from '../../asserts/images/Frame 594.png'
import Button from '../../components/reuseable/Button'
import Footer from '../../layout/Footer'
import { useTranslation } from 'react-i18next'
import Accordian from '../../components/Accordian/Accordian'
import { faqs } from '../../components/Accordian/Accordian'
import { useNavigate } from 'react-router-dom'
import { contactUsThanks } from "../../Auth/ThankuAllText";
import secureLocalStorage from 'react-secure-storage'
import { showMessage } from '../../components/reuseable/Tostify'
import API_Routes from '../../Routes/API_Routes'
import { contactusScheme } from '../../Schemas/ContactUsScheme'
import { useFormik } from 'formik'
import axios from 'axios'
import { Loader } from '../../components/reuseable/Loader'
import DashboardNavbar from '../../Dashboard/DashboardCmp/DashboardNavbar'
import { useEffect } from 'react'
const Contact = () => {
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();
  const [active, setActive] = useState(null);
  const [loader, setLoader] = useState(false);
  const [faqs, setFaqs] = useState([]);



  const handleToggle = (index) => {
    if (active === index) {
      setActive(null);
    } else {
      setActive(index);
    }
  }
  const navigate = useNavigate()
  const token = secureLocalStorage.getItem('token')



  const initialValues = {
    name: "",
    email: "",
    message: "",

  };

  // if (token) {
  //   navigate('/dashboard')
  // }
  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: contactusScheme,
      validateOnChange: true,
      validateOnBlur: false,
      onSubmit: (values, action) => {
        // const myHeaders = {
        //   Accept: 'application/json',
        //   'Content-Type': 'application/json',
        // };
        setLoader(true)
        const formData = {
          name: values.name,
          message: values.message,
          email: values.email,
        };

        axios.post(API_Routes.CONTACTUS, formData)
          .then(response => {
            if (response.status === 200 || response.status === 201) {
              navigate("/thank-you", {
                state: { contactDetails: response?.data?.data },
              });
              setLoader(false)
              showMessage(response.data.message);
            } else {
              showMessage(response.data.message, 'error');
              setLoader(false)

            }
          })
          .catch(error => {
            setLoader(false)
            console.log('error', error);
          });
      },
    });

  useEffect(() => {
    GetFaqs()
  }, [])

  const GetFaqs = () => {
    setLoader(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(API_Routes.ALLFAQS, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status == 200) {
          setFaqs(result?.data)
          setLoader(false)


        } else {
          showMessage(result.message, 'error')
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
      <section style={{ backgroundColor: '#FCFCFC' }}>
        {loader && <div className="loaderScreen">
          <Loader />
        </div>}
        {token ? <DashboardNavbar /> : <Header />}
        <div className="container mb-text">
          <div className="contact-main">
            <div className="contact-box">
              <img className='img-fluid' src={main} alt="" />
            </div>
            <div className="contact-box-two">
              <h6>{'Contact us'}</h6>
              <p>Feel free to get in touch or take a look at our FAQ.</p>
              <div className='form-main'>
                <form onSubmit={handleSubmit}>
                  <div className='mb'>
                    <label htmlFor="fname">{'Name'}</label>
                    <input name='name'
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder='Input text'
                      type="text" />
                    {errors.name && touched.name ? (
                      <p className="form-error mt-2">{errors.name}</p>
                    ) : null}
                  </div>
                  <div className='mb'>
                    <label htmlFor="fname">E-mail</label>
                    <input
                      name='email'
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder='Input text'
                      type="email"

                    />
                    {errors.email && touched.email ? (
                      <p className="form-error mt-2 ">{errors.email}</p>
                    ) : null}
                  </div>
                  <div className='mb'>
                    <label htmlFor="fname">{'Message'}</label>
                    <textarea
                      name='message'
                      value={values.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="text"
                      style={{ minHeight: '100px' }}
                      placeholder='Input text'
                      id="w3review"
                      rows="4"
                      cols="50" />
                    {errors.message && touched.message ? (
                      <p className="form-error mt-2 ">{errors.message}</p>
                    ) : null}
                  </div>
                  <div>
                    <Button type="submit" data={'Send message'} class={'profile-btn w-100'}> </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* ///////////Accordian////////// */}
          <section>
            <div className="container mt-sm-5 pt-sm-5 mt-0 pt-0">
              <div className="row faq-main pt-sm-0 pt-3">
                <div className="col ">
                  <h6> {'Frequently Asked Questions'} </h6>
                </div>
              </div>
              <div className="row faq-row">
                <div className="faq-col">
                  {faqs.map((faq, index) => {
                    return (
                      <Accordian key={index} active={active} handleToggle={handleToggle} faq={faq} />
                    )
                  })
                  }
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default Contact
