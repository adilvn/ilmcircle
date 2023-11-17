import React from 'react'
import Button from './Button'
import dot from '../../asserts/images/dot.svg'
import not from '../../asserts/images/not.svg'
import { useTranslation } from 'react-i18next'
import { ReactSVG } from 'react-svg'
import { useNavigate } from 'react-router-dom'
const Cardfree = (props) => {
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();
  const navigate = useNavigate()

  return (
    <>
      <div className="card-price">
        <div className="price-body">
          <div className='badge-main'>
            <span>
              <h1>{props.top}<small className='text-muted'> {props.month}</small> </h1>
            </span>
            <span className={props.class}>
              {props.discount}
            </span>
          </div>
          <strong>{props.heading} </strong>
          <p className='text-muted'>{props.para}</p>
          <div className="line"></div>
          <form>
            <ul className='price-list'>
              <li><ReactSVG src={dot} /> {'24/7 support'}</li>
              <li><ReactSVG src={dot} /> {'1 watchlist included'}</li>
              <li><ReactSVG src={not} /> {'Access to all features'}</li>
              <li><ReactSVG src={not} /> {'Exclusive premium widgets'}</li>

            </ul>
          </form>
          <Button onClick={() => navigate('/checkout')} data={'Subscribe now'} class={'profile-btn contact-btn w-100'}> </Button>
        </div>
      </div>
    </>
  )
}

export default Cardfree
