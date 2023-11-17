import React, { useRef } from 'react'
import { FaChevronRight } from 'react-icons/fa'
import '../Accordian/accordian.css'
import { useTranslation } from 'react-i18next'


export const faqs = [
    {
        id: 1,
        header: "accor1",
        text: `accortext1`
    },
    {
        id: 2,
        header: "accor3",
        text: `accortext3`
    },
    {
        id: 3,
        header: "accor2",
        text: `accortext2`
    },

    {
        id: 4,
        header: "accor4",
        text: `accortext4`
    },
    {
        id: 5,
        header: "accor5",
        text: `accortext5`
    },
    {
        id: 6,
        header: "accor6",
        text: `accortext6`
    }
]

const Accordian = (props) => {
    const { t, i18n } = useTranslation();
    document.body.dir = i18n.dir();
    const contentEl = useRef();
    const { handleToggle, active, faq } = props;
    const { heading, _id, description } = faq;


    return (
        <div className="rc-accordion-card">
            <div className="rc-accordion-header">
                <div className={`rc-accordion-toggle ps-3 ${active === _id ? 'active' : ''}`} onClick={() => handleToggle(_id)}>
                    <h5 className="rc-accordion-title">{heading}</h5>
                    <span className={active ? 'rc-accordion-icon' : 'rc-accordion-icon2'}>
                        <span style={{ color: "red" }}> <FaChevronRight style={{ color: "#F47B00" }} />
                        </span></span>
                </div>
            </div>
            <div ref={contentEl} className={`rc-collapse ${active === _id ? 'show' : ''}`} style={
                active === _id
                    ? { height: contentEl.current.scrollHeight }
                    : { height: "0px" }
            }>
                <div className="rc-accordion-body">
                    <p className='mb-0'>{description}</p>
                </div>
            </div>
        </div>
    )
}



export default Accordian
