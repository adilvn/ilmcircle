import React from 'react'
import './auth.css'

//---------images---------------------//
import left from '../asserts/images/auth left.png'
import right from '../asserts/images/auth right.png'

//------------components-----------------//
import Header from '../layout/Header'
import SliderAuth from '../components/SliderAuth/SliderAuth'

const Signup = () => {

    return (
        <>
            <section>
                <Header />
                <div className="container-fluid px-zero light-images">
                    <div className='img-left-side'><img className='img-fluid' src={left} alt="" /></div>
                    <div className='img-right-side'><img className='img-fluid' src={right} alt="" /></div>
                    <div className="container">
                        <div className="row signup-main">
                            <div className="col">
                                <SliderAuth />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Signup
