import React from 'react'


//----------components------------------//
import Header from '../layout/Header'
import Button from '../components/reuseable/Button'
//--------------images=--------------//
import left from '../asserts/images/auth left.png'
import right from '../asserts/images/auth right.png'
import InputField from '../components/reuseable/InputField'
const Orgnaization = () => {
    return (
        <>
            <section>
                <Header />
                <div className="container-fluid px-zero light-images">
                    <div className='img-left-side'><img className='img-fluid' src={left} alt="" /></div>
                    <div className='img-right-side'><img className='img-fluid' src={right} alt="" /></div>
                    <div className="container">
                        <div className='org-head'>
                            <h6 className='text-center'>Tell us about your organization</h6>
                        </div>
                        <div className='row org-main'>
                            <div className="org-box">
                                <form>
                                    <div className="org-row">
                                        <div className='mb form-main w-50'>
                                            <label for="fname">Organization name* </label>
                                            <InputField placeholder='Input Organization name' type="text" />

                                        </div>
                                        <div className='mb form-main w-50'>
                                            <label for="fname">Address*</label>
                                            <InputField placeholder='Input address' type="text" />
                                        </div>
                                    </div>
                                    <div className="org-row">
                                        <div className='mb form-main w-50'>
                                            <label for="fname">Website</label>
                                            <InputField placeholder='Input Website URL' type="text" />

                                        </div>
                                        <div className='mb form-main w-50'>
                                            <label for="fname">Contact e-mail*</label>
                                            <InputField placeholder='Input email address' type="email" />

                                        </div>
                                    </div>
                                    <div className='mb form-main bg-white'>
                                        <label for="fname">Introduction about your mission and service </label>
                                        <textarea placeholder='Input text' required id="w3review" name="w3review" rows="4" cols="50"></textarea>
                                    </div>
                                    <div className='text-center'>
                                        <Button data={'Sign up'} class={'w-50 profile-btn '}></Button>
                                        <p className='pt-sm-4 pt-3 '>Go back</p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Orgnaization
