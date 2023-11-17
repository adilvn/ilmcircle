import React, { useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import Accordian from '../components/Accordian/Accordian'
import "./layout.css"

function HelpCenter() {
  const [active, setActive] = useState(null);

  const handleToggle = (index) => {
    if (active === index) {
      setActive(null);
    } else {
      setActive(index);
    }
  }
  const array = [
    {
      _id: '0',
      heading: 'How to join ILM Circle? ',
      description: 'Go to signup page. Enter your details, choose your favorite plan , shortly you will receive a conformation Email. WELCOME TO ILM CIRCLE FAMILY!  '
    },
    {
      _id: '1',
      heading: 'Where to get the upcoming events details? ',
      description: 'Go to events page. There you will find the upcoming event for you. Select any event and there you will see all the details of the events.'
    },
    {
      _id: '2',
      heading: 'How to be the member of ILM CIRCLE?',
      description: 'Send email to us. We will reach you out as soon as possible.'
    },

  ]

  return (
    <>
      <Header />
      <div className='container pb-3 pt-sm-2 pt-1  '>
        <div className='row p-sm-5 px-2 py-4 main-col2'>
          <div className='col'>
            <h6 className='pb-3'>Help Center</h6>



            {array.map((faq, index) => {
              return (
                <Accordian key={index} active={active} handleToggle={handleToggle} faq={faq} />
              )
            })
            }

          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default HelpCenter