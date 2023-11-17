import React from 'react'
import Button from './Button'
import img from '../../asserts/images/people.png'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const PeopleSection = ({ title }) => {
    const { t, i18n } = useTranslation();
    document.body.dir = i18n.dir();
    const navigate = useNavigate();
    return (
        <>
            <section >
                <div className="container">
                    <div className="row people-main">
                        <div className='bg-pink'></div>
                        <div className='people-box'>
                            <h6>{title}</h6>
                            <Button data={'Sign up'} class={'profile-btn people-btn'} onClick={() => navigate('/signup')}>  </Button>
                        </div>
                        {/* <div className="people-box-two">
                            <img className='img-fluid' src={img} alt="" />
                        </div> */}
                    </div>
                </div>
            </section>
        </>
    )
}

export default PeopleSection
