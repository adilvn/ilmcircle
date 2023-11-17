import React, { useState } from 'react'
import './lunchingpage.css'

// ---------------------components---------------------//
import Header from '../../layout/Header'
import Button from '../../components/reuseable/Button'
import Footer from '../../layout/Footer'

// ---------------------librarys---------------------//
import { ReactSVG } from 'react-svg'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// ---------------------Images---------------------//
import left from '../../asserts/images/left.svg'
import right from '../../asserts/images/right.svg'
import img1 from '../../asserts/images/cap.svg'
import img3 from '../../asserts/images/hijab3.svg'
import img2 from '../../asserts/images/ramadan 2.svg'
import cap from '../../asserts/images/cap.svg'
import ramdan from '../../asserts/images/ramadan 2.svg'
import InputField from '../../components/reuseable/InputField'
import LauchingHeader from './LaucingHeader'
import hijab3 from "../../asserts/images/hijab3.svg";
import API_Routes from '../../Routes/API_Routes'
import { showMessage } from '../../components/reuseable/Tostify'
import { Loader } from '../../components/reuseable/Loader'
import axios from 'axios'
import { useEffect } from 'react'

const options = [
    { value: 'student', label: 'A student', img: cap },
    { value: 'teacher', label: 'A teacher', img: hijab3 },
    { value: 'organization', label: 'An organization', img: ramdan }
];

const LunchingPage = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [lauchingData, setLauchingData] = useState([]);
    const [landingBottomtxt, setLandingBottomtxt] = useState([]);

    const [loader, setLoader] = useState(false);

    const { t, i18n } = useTranslation();
    document.body.dir = i18n.dir();


    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const SendNotifyMeData = () => {
        setLoader(true);


        var formdata = new FormData();
        formdata.append("name", name);
        formdata.append("email", email);
        formdata.append("role", selectedOption);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch(API_Routes.NOTIFYMEHOME, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status === 200 || result.status === 201) {
                    setLoader(false);
                    showMessage(result?.message);
                } else {
                    setLoader(false);
                    showMessage(result?.message, 'error');
                }
            })
            .catch(error => {
                setLoader(false);
                console.log('error', error)
            });



        // console.log('name:', name);
        // console.log('email:', email);
        // console.log('selectedOption:', selectedOption);

        // var formdata = new FormData();
        // formdata.append("name", name);
        // formdata.append("email", email);
        // formdata.append("role", selectedOption);

        // axios.post(API_Routes.NOTIFYMEHOME, formdata)
        //     .then(response => {
        //         console.log('response===>', response)
        //         if (response.status === 200 || response.status === 201) {
        //             setLoader(false);
        //             showMessage(response.data?.message);
        //         } else {
        //             setLoader(false);
        //             showMessage(response.data?.message, 'error');
        //         }
        //     })
        //     .catch(error => {
        //         setLoader(false);
        //         console.log('error', error);
        //     });
    }


    useEffect(() => {
        GetHomeData()
    }, [])


    const GetHomeData = () => {
        setLoader(true)
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("https://ilmcircle.com/backend/api/page/home", requestOptions)
            .then(response => response.json())
            .then(result => {

                if (result.status == 200 || result.status == 201) {
                    setLoader(false)
                    const lauchingData = result?.data?.filter((item) => item?.key == "landingBanner");
                    setLauchingData(lauchingData)


                    const landingSection = result?.data?.filter((item) => item?.key == "landingSection");
                    setLandingBottomtxt(landingSection)

                } else {
                    setLoader(false)
                    showMessage(result?.message)
                }

            })
            .catch(error => {
                setLoader(false)
                console.log('error', error)
            });
    }

    return (
        <>

            {loader && <div className="loaderScreen">
                <Loader />
            </div>}

            {/* /////////  LunchingPAge////////// */}
            <section className='container-fluid bg-img lauchingPageMain'>
                <LauchingHeader />
                <main className='container'>
                    <div className='row main-hero'>
                        <div className="box-1 ">
                            {/* <ReactSVG className='img-fluid' src={left} /> */}
                            {lauchingData[0]?.landingBanner?.leftImage?.url && <img style={{ width: 276, height: 280 }} className="img-fluid" src={lauchingData[0]?.landingBanner?.leftImage?.url} alt="img1" />}

                        </div>
                        <div className="box-2 ">
                            <div className='content homecontent'>
                                <h6 className="home-heading">
                                    {lauchingData[0]?.landingBanner?.title}
                                </h6>

                                <p className="mt-4">
                                    {lauchingData[0]?.landingBanner?.description}
                                </p>
                                <button className='main-btn-2 w-80 mx-0' data-bs-toggle="modal" data-bs-target="#exampleModal"> Notify me when it’s available</button>
                            </div>
                        </div>
                        <div className="box-3 ">
                            {/* <ReactSVG className='img-fluid' src={right} /> */}
                            {lauchingData[0]?.landingBanner?.rightImage?.url && <img style={{ width: 276, height: 280 }} className="img-fluid" src={lauchingData[0]?.landingBanner?.rightImage?.url} alt="img1" />}

                        </div>
                    </div>
                </main>
            </section>


            {/* <!-- Modal --> */}
            <div class="modal fade NotifyModalStyle" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div class="modal-dialog">
                    <div class="modal-content modal-backgorund">
                        <div class="modal-header border-0">
                            <h1 class="modal-title fs-5" id="exampleModalLabel"></h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <h6 className='text-center fs-3 mb-3'>Notify me when it’s available</h6>
                            <div className='slide-box-one px-5'>
                                <form onSubmit={SendNotifyMeData}>
                                    <div className='mb form-main w-100'>
                                        <label htmlFor="fname">Name</label>
                                        <InputField
                                            placeholder={'Input your name '}
                                            type="text"
                                            name="name"
                                            onChange={(e) => setName(e.target.value)}

                                        />
                                    </div>
                                    <div className='mb form-main w-100'>
                                        <label htmlFor="fname">E-mail</label>
                                        <InputField
                                            placeholder={'Input e-mail address'}
                                            type="email"
                                            name="email"
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </form>

                                <div className='slide-box-body'>
                                    <div><h3 >I am...</h3></div>
                                    {options.map((option) => (
                                        <label key={option.value} className='bottom-slide-box mt-1'>
                                            <div className='svg-style'>
                                                <span><ReactSVG src={option.img} /></span>
                                                <span> {option.label}</span>
                                            </div>
                                            <div>
                                                <input
                                                    type="radio"
                                                    value={option.value}
                                                    checked={selectedOption === option.value}
                                                    onChange={handleOptionChange}
                                                />
                                            </div>
                                        </label>
                                    ))}
                                    <div>
                                        <Button onClick={() => SendNotifyMeData()} data={'Send e-mail'} class={'bottom-btn profile-btn w-100'}></Button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {/* ///////// LunchingPAge Section end ////////// */}
            <div className="container pb-5">
                <div className="row justify-content-between text-center">


                    {landingBottomtxt[0]?.landingSection?.data?.map((item, index) => {
                        return <div key={index} className="col-lg-3 col-md-4 col-sm-6">
                            {/* <ReactSVG src={img1} /> */}
                            <img style={{ width: 55, height: 55 }} src={item?.image?.url} alt='url' />
                            <div className='lunching-text py-3 px-4'>
                                <p>{item?.description}</p>
                            </div>
                        </div>
                    })}



                    {/* <div className="col-lg-3 col-md-4 col-sm-6">
                        <ReactSVG src={img2} />
                        <div className='lunching-text py-3 px-4'>

                            <p>Keeping the local community up to date on the events you organize.</p>
                        </div>

                    </div>
                    <div className="col-lg-3 co-md-4 col-sm-6">
                        <ReactSVG src={img3} />
                        <div className='lunching-text py-3 px-5'>
                            <p>A platform for you to teach students on an hourly rate basis.</p>
                        </div>

                    </div> */}
                </div>
            </div>


            {/* <Footer /> */}

        </>
    )
}

export default LunchingPage
