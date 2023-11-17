import React from 'react'
//----------components------------------//
import Header from '../layout/Header'
import Button from '../components/reuseable/Button'
//--------------images=--------------//
import left from '../asserts/images/auth left.png'
import right from '../asserts/images/auth right.png'
import InputField from '../components/reuseable/InputField'
const Teacher = () => {
  return (
    <>
      
      <section>
                <Header />
                <div className="container-fluid px-zero light-images">
                    <div className='img-left-side'><img className='img-fluid' src={left} alt="" /></div>
                    <div className='img-right-side'><img className='img-fluid' src={right} alt="" /></div>
                    <div className="container">
                        <div className='org-head'>
                            <h6 className='text-center'>Tell us about you</h6>
                        </div>
                        <div className='row org-main'>
                            <div className="org-box">
                                <form>
                                    <div className="org-row">
                                        <div className='mb form-main w-50'>
                                            <label for="fname">Full name*  </label>
                                            <InputField placeholder='Input text' type="text"/>                             
                                        </div>

                                        <div className='mb form-main w-50'>
                                            <label for="fname">Email*</label>
                                            <InputField placeholder='Input email address'  type="email"/>                                         
                                        </div>
                                    </div>
                                    <div className="org-row">
                                        <div className='mb form-main w-50'>
                                            <label for="fname">Phone number*</label>
                                            <InputField placeholder='Input phone No'  type="phone"/>  
                                            
                                        </div>
                                        <div className='mb form-main w-50'>
                                            <label for="fname">Contact email*</label>
                                            <InputField placeholder='Input address'  type="email"/>                                        
                                        </div>
                                    </div>
                                    <div className='mb form-main bg-white'>
                                        <label for="fname">Introduction about yourself and your service </label>
                                        <textarea  placeholder='Input text' required id="w3review" name="w3review" rows="4" cols="50"></textarea>
                                    </div>
                                    <div className='text-center'>
                                        <Button data={'Sign up'} class={'w-50 profile-btn '}></Button>
                                        <p>Go back</p>
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

export default Teacher
